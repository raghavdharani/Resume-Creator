import { useEffect, useMemo, useState, type ReactNode } from "react";

import { resumeDocumentSchema, type ResumeDocument } from "../domain";
import { workspaceCatalog } from "../data/workspace-catalog.generated";
import { toRenderResumeDocument } from "../integration/resume-render-adapter";
import { analyzeResumeDensity, renderResumeHtml } from "../render";

type Page = "dashboard" | "launchpad" | "intake" | "resumes" | "jds" | "collaterals" | "admin" | "evidence" | "claims" | "qa" | "workspace";
type EvidenceDecision = "available" | "approved" | "forbidden";
type ClaimDecision = "pending" | "approved" | "safer";
type ResumeDecision = "active" | "archived";
type ArtifactType = "resume" | "coverLetter" | "outreach" | "interviewPrep" | "auditTrail";

interface ApplicationDraft {
  company: string;
  role: string;
  jd: string;
  sourceResume: string;
  highlights: string;
  avoids: string;
  maxPages: number;
}

interface SavedApplication extends ApplicationDraft {
  id: string;
  profileSlug: string;
  createdAt: string;
}

interface ApplicationArtifacts {
  coverLetter: string;
  outreach: string;
  interviewPrep: string;
}

interface PersistedWorkspace {
  activeApplicationId: string;
  activeProfileSlug: string;
  applications: SavedApplication[];
  artifacts: Record<string, ApplicationArtifacts>;
  evidenceDecisions: Record<string, EvidenceDecision>;
  claimDecisions: Record<string, ClaimDecision>;
  resumeDecisions: Record<string, ResumeDecision>;
  resumeDrafts: Record<string, ResumeDocument>;
}

const storageKey = "resume-os-local-workspace-v1";

const emptyDraft: ApplicationDraft = {
  company: "",
  role: "",
  jd: "",
  sourceResume: "",
  highlights: "",
  avoids: "",
  maxPages: 2
};

const intakeSteps = ["Job details", "Source resume", "Focus limits", "Review"];

export function ModernizationApp() {
  const persisted = useMemo(loadPersistedWorkspace, []);
  const [activeProfileSlug, setActiveProfileSlug] = useState(
    persisted.activeProfileSlug || workspaceCatalog.profiles[0].slug
  );
  const [page, setPage] = useState<Page>("dashboard");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ApplicationDraft>(emptyDraft);
  const [applications, setApplications] = useState<SavedApplication[]>(persisted.applications);
  const [activeApplicationId, setActiveApplicationId] = useState(persisted.activeApplicationId || "");
  const [artifacts, setArtifacts] = useState<Record<string, ApplicationArtifacts>>(persisted.artifacts);
  const [evidenceDecisions, setEvidenceDecisions] = useState<Record<string, EvidenceDecision>>(persisted.evidenceDecisions);
  const [claimDecisions, setClaimDecisions] = useState<Record<string, ClaimDecision>>(persisted.claimDecisions);
  const [resumeDecisions, setResumeDecisions] = useState<Record<string, ResumeDecision>>(persisted.resumeDecisions);
  const [resumeDrafts, setResumeDrafts] = useState<Record<string, ResumeDocument>>(persisted.resumeDrafts);

  const activeProfile =
    workspaceCatalog.profiles.find((profile) => profile.slug === activeProfileSlug) ??
    workspaceCatalog.profiles[0];
  const profileApplications = applications.filter(
    (application) => application.profileSlug === activeProfile.slug
  );
  const activeApplication = applications.find(
    (application) => application.id === activeApplicationId
  );

  const preview = useMemo(() => {
    const parsed = resumeDocumentSchema.safeParse(
      activeApplication ? resumeDrafts[activeApplication.id] ?? activeProfile.resume : activeProfile.resume
    );
    if (!parsed.success) {
      return {
        density: null,
        error: "The resume has an incomplete required block. Finish the edit to restore preview and export.",
        html: ""
      };
    }
    const renderDocument = toRenderResumeDocument(parsed.data);
    return {
      density: analyzeResumeDensity(renderDocument),
      error: "",
      html: renderResumeHtml(renderDocument)
    };
  }, [activeApplication, activeProfile, resumeDrafts]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({
      applications,
      activeApplicationId,
      activeProfileSlug,
      artifacts,
      evidenceDecisions,
      claimDecisions,
      resumeDecisions,
      resumeDrafts
    } satisfies PersistedWorkspace));
  }, [activeApplicationId, activeProfileSlug, applications, artifacts, evidenceDecisions, claimDecisions, resumeDecisions, resumeDrafts]);

  function updateDraft<Key extends keyof ApplicationDraft>(
    key: Key,
    value: ApplicationDraft[Key]
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function startApplication(jobDescription?: (typeof workspaceCatalog.profiles)[number]["jobDescriptions"][number]) {
    setDraft({
      ...emptyDraft,
      role: activeProfile.targetRoles[0] ?? "",
      sourceResume: activeProfile.sourceResumes.find((resume) => (resumeDecisions[resume.path] ?? "active") === "active")?.path ?? "",
      jd: jobDescription?.content ?? "",
      maxPages: activeProfile.slug === "aatmika_natarajan" ? 3 : 2
    });
    setStep(0);
    setPage("intake");
  }

  function saveApplication() {
    const application: SavedApplication = {
      ...draft,
      id: `${activeProfile.slug}-${Date.now()}`,
      profileSlug: activeProfile.slug,
      createdAt: new Date().toISOString()
    };
    setApplications((current) => [application, ...current]);
    setArtifacts((current) => ({
      ...current,
      [application.id]: createDefaultArtifacts(application, activeProfile.name)
    }));
    setResumeDrafts((current) => ({
      ...current,
      [application.id]: structuredClone(activeProfile.resume)
    }));
    setActiveApplicationId(application.id);
    setPage("workspace");
  }

  const canContinue =
    step === 0
      ? Boolean(draft.company.trim() && draft.role.trim() && draft.jd.trim())
      : step === 1
        ? Boolean(draft.sourceResume)
        : true;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark">R</span>
          <div>
            <strong>Resume OS</strong>
            <span>Application Workspace</span>
          </div>
        </div>
        <div className="context-controls">
          <label>
            <span>Active profile</span>
            <select
              aria-label="Active profile"
              onChange={(event) => {
                setActiveProfileSlug(event.target.value);
                setPage("dashboard");
                setActiveApplicationId("");
              }}
              value={activeProfile.slug}
            >
              {workspaceCatalog.profiles.map((profile) => (
                <option key={profile.slug} value={profile.slug}>
                  {profile.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Application</span>
            <select
              aria-label="Active application"
              onChange={(event) => {
                setActiveApplicationId(event.target.value);
                if (event.target.value) setPage("workspace");
              }}
              value={activeApplicationId}
            >
              <option value="">No active application</option>
              {profileApplications.map((application) => (
                <option key={application.id} value={application.id}>
                  {application.company} | {application.role}
                </option>
              ))}
            </select>
          </label>
          <button className="primary-action" onClick={() => startApplication()} type="button">
            New application
          </button>
        </div>
      </header>

      <aside className="sidebar">
        <div className="sidebar-context">
          <span>Active profile</span>
          <strong>{activeProfile.name}</strong>
          <small>{activeProfile.positioning}</small>
        </div>
        <nav aria-label="Workspace">
          <button
            className={page === "dashboard" ? "active" : ""}
            onClick={() => setPage("dashboard")}
            type="button"
          >
            Dashboard
          </button>
          <button onClick={() => startApplication()} type="button">
            New application
          </button>
          <button
            className={page === "jds" ? "active" : ""}
            onClick={() => setPage("jds")}
            type="button"
          >
            Previous JDs <small>{activeProfile.jobDescriptions.length}</small>
          </button>
          <button
            className={page === "resumes" ? "active" : ""}
            onClick={() => setPage("resumes")}
            type="button"
          >
            Resume repository <small>{activeProfile.sourceResumes.length}</small>
          </button>
          <button
            className={page === "collaterals" ? "active" : ""}
            onClick={() => setPage("collaterals")}
            type="button"
          >
            Collaterals <small>{activeProfile.collaterals.length}</small>
          </button>
          <button
            className={page === "evidence" ? "active" : ""}
            onClick={() => setPage("evidence")}
            type="button"
          >
            Evidence library
          </button>
          <button
            className={page === "workspace" ? "active" : ""}
            disabled={!activeApplication}
            onClick={() => setPage("workspace")}
            type="button"
          >
            Resume workspace
          </button>
          <button
            className={page === "claims" ? "active" : ""}
            disabled={!activeApplication}
            onClick={() => setPage("claims")}
            type="button"
          >
            Claims review
          </button>
          <button
            className={page === "qa" ? "active" : ""}
            disabled={!activeApplication}
            onClick={() => setPage("qa")}
            type="button"
          >
            QA report
          </button>
          <button
            className={page === "admin" ? "active" : ""}
            onClick={() => setPage("admin")}
            type="button"
          >
            Admin panel
          </button>
        </nav>
        <div className="sidebar-footer">
          <span>Local workspace catalog</span>
          <small>{workspaceCatalog.profiles.length} profiles loaded</small>
        </div>
      </aside>

      <main className="workspace">
        {page === "dashboard" && (
          <Dashboard
            applications={profileApplications}
            onOpenApplication={(applicationId) => {
              setActiveApplicationId(applicationId);
              setPage("workspace");
            }}
            onLaunch={() => setPage("launchpad")}
            onNavigate={setPage}
            profile={activeProfile}
          />
        )}
        {page === "launchpad" && (
          <ApplicationLaunchpad
            onBlank={() => startApplication()}
            onReuse={startApplication}
            profile={activeProfile}
          />
        )}
        {page === "intake" && (
          <Intake
            canContinue={canContinue}
            draft={draft}
            onCancel={() => setPage("dashboard")}
            onSave={saveApplication}
            onStep={setStep}
            onUpdate={updateDraft}
            profile={activeProfile}
            resumeDecisions={resumeDecisions}
            step={step}
          />
        )}
        {page === "workspace" && activeApplication && (
          <ResumeWorkspace
            application={activeApplication}
            artifacts={artifacts[activeApplication.id] ?? createDefaultArtifacts(activeApplication, activeProfile.name)}
            claimDecisions={claimDecisions}
            density={preview.density}
            error={preview.error}
            html={preview.html}
            onArtifacts={(nextArtifacts) =>
              setArtifacts((current) => ({ ...current, [activeApplication.id]: nextArtifacts }))
            }
            onResume={(resume) =>
              setResumeDrafts((current) => ({ ...current, [activeApplication.id]: resume }))
            }
            profileName={activeProfile.name}
            profile={activeProfile}
            resume={resumeDrafts[activeApplication.id] ?? activeProfile.resume}
          />
        )}
        {page === "evidence" && (
          <EvidenceLibrary
            decisions={evidenceDecisions}
            onDecision={(evidenceId, decision) =>
              setEvidenceDecisions((current) => ({ ...current, [evidenceId]: decision }))
            }
            profile={activeProfile}
          />
        )}
        {page === "resumes" && (
          <ResumeRepository
            decisions={resumeDecisions}
            onDecision={(path, decision) =>
              setResumeDecisions((current) => ({ ...current, [path]: decision }))
            }
            profile={activeProfile}
          />
        )}
        {page === "jds" && <PreviousJobDescriptions onBlank={() => startApplication()} onReuse={startApplication} profile={activeProfile} />}
        {page === "collaterals" && <CollateralLibrary profile={activeProfile} />}
        {page === "admin" && (
          <AdminPanel
            activeProfileSlug={activeProfile.slug}
            onManage={(profileSlug) => {
              setActiveProfileSlug(profileSlug);
              setActiveApplicationId("");
              setPage("dashboard");
            }}
          />
        )}
        {page === "claims" && activeApplication && (
          <ClaimsReview
            application={activeApplication}
            decisions={claimDecisions}
            onDecision={(claimId, decision) =>
              setClaimDecisions((current) => ({ ...current, [claimId]: decision }))
            }
            profile={activeProfile}
          />
        )}
        {page === "qa" && activeApplication && (
          <QaReport
            application={activeApplication}
            claimDecisions={claimDecisions}
            density={preview.density}
            evidenceDecisions={evidenceDecisions}
            profile={activeProfile}
          />
        )}
      </main>
    </div>
  );
}

function Dashboard({
  applications,
  onLaunch,
  onNavigate,
  onOpenApplication,
  profile
}: {
  applications: SavedApplication[];
  onLaunch: () => void;
  onNavigate: (page: Page) => void;
  onOpenApplication: (applicationId: string) => void;
  profile: (typeof workspaceCatalog.profiles)[number];
}) {
  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Profile workspace</span>
          <h1>{profile.name}</h1>
          <p>{profile.positioning}</p>
        </div>
        <button className="primary-action" onClick={onLaunch} type="button">
          Start target application
        </button>
      </section>

      <section className="metrics-strip" aria-label="Profile summary">
        <div><span>Source resumes</span><strong>{profile.sourceResumes.length}</strong></div>
        <div><span>Previous JDs</span><strong>{profile.jobDescriptions.length}</strong></div>
        <div><span>Stored collaterals</span><strong>{profile.collaterals.length}</strong></div>
        <div><span>Profile status</span><strong>Ready</strong></div>
      </section>

      <section className="dashboard-grid">
        <div className="surface application-list">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Application pipeline</span>
              <h2>Target applications</h2>
            </div>
            <button className="secondary-action" onClick={onLaunch} type="button">Browse options</button>
          </div>
          {applications.length ? (
            applications.map((application) => (
              <button
                className="application-row"
                key={application.id}
                onClick={() => onOpenApplication(application.id)}
                type="button"
              >
                <span><strong>{application.company}</strong><small>{application.role}</small></span>
                <span><small>Maximum {application.maxPages} pages</small><b>Open</b></span>
              </button>
            ))
          ) : (
            <div className="empty-state">
              <strong>No target applications yet</strong>
              <p>Start with a job description. The intake flow will capture the source resume, positioning focus, and page constraints.</p>
              <button className="primary-action" onClick={onLaunch} type="button">Create first application</button>
            </div>
          )}
        </div>

        <div className="surface profile-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Positioning guardrails</span>
              <h2>Target roles</h2>
            </div>
          </div>
          <ul className="role-list">
            {profile.targetRoles.map((role) => <li key={role}>{role}</li>)}
          </ul>
          <div className="source-summary">
            <strong>{profile.sourceResumes.length} reusable source resumes</strong>
            <span>Loaded from users/{profile.slug}/source_resumes</span>
          </div>
        </div>
      </section>
      <section className="surface quick-links">
        <div className="section-heading">
          <div><span className="eyebrow">Workspace libraries</span><h2>Manage profile content</h2></div>
        </div>
        <div className="quick-link-grid">
          <button onClick={() => onNavigate("jds")} type="button"><strong>Previous JDs</strong><span>{profile.jobDescriptions.length} stored descriptions</span></button>
          <button onClick={() => onNavigate("resumes")} type="button"><strong>Resume repository</strong><span>{profile.sourceResumes.length} source files</span></button>
          <button onClick={() => onNavigate("collaterals")} type="button"><strong>Collaterals</strong><span>{profile.collaterals.length} generated files</span></button>
          <button onClick={() => onNavigate("admin")} type="button"><strong>Admin panel</strong><span>{workspaceCatalog.profiles.length} managed users</span></button>
        </div>
      </section>
    </>
  );
}

function ApplicationLaunchpad({
  onBlank,
  onReuse,
  profile
}: {
  onBlank: () => void;
  onReuse: (jobDescription: (typeof workspaceCatalog.profiles)[number]["jobDescriptions"][number]) => void;
  profile: (typeof workspaceCatalog.profiles)[number];
}) {
  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Application launchpad</span>
          <h1>Start target application</h1>
          <p>Reuse a previous job description or begin with a blank intake for a new opportunity.</p>
        </div>
        <button className="primary-action" onClick={onBlank} type="button">Start blank application</button>
      </section>
      <LibrarySection
        empty="No previous job descriptions are stored for this profile."
        eyebrow="Reuse prior context"
        title="Previous JDs"
      >
        {profile.jobDescriptions.map((jobDescription) => (
          <article className="library-row" key={jobDescription.path}>
            <div>
              <strong>{friendlyFileName(jobDescription.name)}</strong>
              <small>{jobDescription.path}</small>
            </div>
            <button className="secondary-action" onClick={() => onReuse(jobDescription)} type="button">Reuse JD</button>
          </article>
        ))}
      </LibrarySection>
    </>
  );
}

function ResumeRepository({
  decisions,
  onDecision,
  profile
}: {
  decisions: Record<string, ResumeDecision>;
  onDecision: (path: string, decision: ResumeDecision) => void;
  profile: (typeof workspaceCatalog.profiles)[number];
}) {
  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Profile documents</span>
          <h1>Resume repository</h1>
          <p>Manage the source resumes available to this profile. Archive decisions stay in this browser until authenticated sync is connected.</p>
        </div>
        <button className="secondary-action" disabled type="button">Upload resume: production sync pending</button>
      </section>
      <LibrarySection eyebrow="Source resumes" title={`${profile.sourceResumes.length} stored resume files`}>
        {profile.sourceResumes.map((resume) => {
          const decision = decisions[resume.path] ?? "active";
          return (
            <article className={`library-row library-${decision}`} key={resume.path}>
              <div>
                <strong>{resume.name}</strong>
                <small>{resume.path}</small>
              </div>
              <div className="library-actions">
                <span className="file-pill">{resume.extension.toUpperCase()} | {formatBytes(resume.sizeBytes)}</span>
                <button className="secondary-action" onClick={() => onDecision(resume.path, decision === "active" ? "archived" : "active")} type="button">
                  {decision === "active" ? "Archive" : "Restore"}
                </button>
              </div>
            </article>
          );
        })}
      </LibrarySection>
    </>
  );
}

function PreviousJobDescriptions({
  onBlank,
  onReuse,
  profile
}: {
  onBlank: () => void;
  onReuse: (jobDescription: (typeof workspaceCatalog.profiles)[number]["jobDescriptions"][number]) => void;
  profile: (typeof workspaceCatalog.profiles)[number];
}) {
  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Reusable targeting context</span>
          <h1>Previous JDs</h1>
          <p>Open an existing job description as the starting point for a new tailored application.</p>
        </div>
        <button className="primary-action" onClick={onBlank} type="button">New blank application</button>
      </section>
      <LibrarySection empty="No previous job descriptions are stored for this profile." eyebrow="Job description library" title={`${profile.jobDescriptions.length} stored JDs`}>
        {profile.jobDescriptions.map((jobDescription) => (
          <article className="library-row" key={jobDescription.path}>
            <div>
              <strong>{friendlyFileName(jobDescription.name)}</strong>
              <small>{jobDescription.path}</small>
            </div>
            <div className="library-actions">
              <span className="file-pill">{jobDescription.extension.toUpperCase()}</span>
              <button className="secondary-action" onClick={() => onReuse(jobDescription)} type="button">Reuse JD</button>
            </div>
          </article>
        ))}
      </LibrarySection>
    </>
  );
}

function CollateralLibrary({ profile }: { profile: (typeof workspaceCatalog.profiles)[number] }) {
  const packages = profile.collaterals.reduce<Record<string, typeof profile.collaterals>>((grouped, collateral) => {
    (grouped[collateral.packageName] ??= []).push(collateral);
    return grouped;
  }, {});
  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Generated application assets</span>
          <h1>Collateral library</h1>
          <p>Previously generated resumes, assessments, cover letters, recruiter messages, interview notes, and publishing previews for this profile.</p>
        </div>
        <span className="local-state">{profile.collaterals.length} files</span>
      </section>
      <div className="package-list">
        {Object.entries(packages).map(([packageName, collaterals]) => (
          <LibrarySection eyebrow="Application package" key={packageName} title={friendlyFileName(packageName)}>
            {(collaterals ?? []).map((collateral) => (
              <article className="library-row" key={collateral.path}>
                <div>
                  <strong>{collateral.name}</strong>
                  <small>{collateral.category.replaceAll("_", " ")} | {collateral.path}</small>
                </div>
                <span className="file-pill">{collateral.extension.toUpperCase()} | {formatBytes(collateral.sizeBytes)}</span>
              </article>
            ))}
          </LibrarySection>
        ))}
      </div>
    </>
  );
}

function AdminPanel({
  activeProfileSlug,
  onManage
}: {
  activeProfileSlug: string;
  onManage: (profileSlug: string) => void;
}) {
  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Workspace administration</span>
          <h1>User management</h1>
          <p>Review local profile inventories and switch into the profile that needs attention.</p>
        </div>
        <button className="secondary-action" disabled type="button">Add user: production sync pending</button>
      </section>
      <section className="admin-grid">
        {workspaceCatalog.profiles.map((profile) => (
          <article className="surface admin-card" key={profile.slug}>
            <div className="section-heading">
              <div><span className="eyebrow">{profile.slug}</span><h2>{profile.name}</h2></div>
              <span className="status-pill">{activeProfileSlug === profile.slug ? "Active" : "Ready"}</span>
            </div>
            <p>{profile.positioning}</p>
            <dl>
              <dt>Source resumes</dt><dd>{profile.sourceResumes.length}</dd>
              <dt>Previous JDs</dt><dd>{profile.jobDescriptions.length}</dd>
              <dt>Collaterals</dt><dd>{profile.collaterals.length}</dd>
              <dt>Guardrails</dt><dd>{profile.forbiddenClaims.length}</dd>
            </dl>
            <button className="primary-action" disabled={activeProfileSlug === profile.slug} onClick={() => onManage(profile.slug)} type="button">Manage profile</button>
          </article>
        ))}
      </section>
    </>
  );
}

function LibrarySection({
  children,
  empty,
  eyebrow,
  title
}: {
  children: ReactNode;
  empty?: string;
  eyebrow: string;
  title: string;
}) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <section className="surface library-section">
      <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div></div>
      {hasChildren ? children : <div className="empty-state"><p>{empty}</p></div>}
    </section>
  );
}

function Intake({
  canContinue,
  draft,
  onCancel,
  onSave,
  onStep,
  onUpdate,
  profile,
  resumeDecisions,
  step
}: {
  canContinue: boolean;
  draft: ApplicationDraft;
  onCancel: () => void;
  onSave: () => void;
  onStep: (step: number) => void;
  onUpdate: <Key extends keyof ApplicationDraft>(key: Key, value: ApplicationDraft[Key]) => void;
  profile: (typeof workspaceCatalog.profiles)[number];
  resumeDecisions: Record<string, ResumeDecision>;
  step: number;
}) {
  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Guided tailoring intake</span>
          <h1>New target application</h1>
          <p>Capture the job context before drafting. Claims and evidence review follow in the next slice.</p>
        </div>
        <button className="text-action" onClick={onCancel} type="button">Cancel</button>
      </section>

      <ol className="stepper">
        {intakeSteps.map((label, index) => (
          <li className={index === step ? "active" : index < step ? "done" : ""} key={label}>
            <span>{index + 1}</span>
            <strong>{label}</strong>
          </li>
        ))}
      </ol>

      <section className="surface intake-panel">
        {step === 0 && (
          <div className="form-stack">
            <FormField label="Company name">
              <input onChange={(event) => onUpdate("company", event.target.value)} placeholder="e.g. Stripe" value={draft.company} />
            </FormField>
            <FormField label="Target role">
              <input onChange={(event) => onUpdate("role", event.target.value)} placeholder="e.g. Senior Product Manager" value={draft.role} />
            </FormField>
            <FormField label="Paste job description">
              <textarea onChange={(event) => onUpdate("jd", event.target.value)} placeholder="Paste responsibilities, requirements, and outcomes..." rows={12} value={draft.jd} />
            </FormField>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="section-heading">
              <div><span className="eyebrow">Profile library</span><h2>Select the base resume</h2></div>
            </div>
          <div className="resume-choice-list">
            {profile.sourceResumes.filter((resume) => (resumeDecisions[resume.path] ?? "active") === "active").map((resume) => (
                <label className={draft.sourceResume === resume.path ? "selected" : ""} key={resume.path}>
                  <input checked={draft.sourceResume === resume.path} name="sourceResume" onChange={() => onUpdate("sourceResume", resume.path)} type="radio" />
                  <span><strong>{resume.name}</strong><small>{resume.path}</small></span>
                </label>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="form-stack">
            <FormField label="Strengths to highlight">
              <textarea onChange={(event) => onUpdate("highlights", event.target.value)} placeholder="e.g. Emphasize platform modernization and AI-assisted delivery..." rows={5} value={draft.highlights} />
            </FormField>
            <FormField label="Topics to avoid or downplay">
              <textarea onChange={(event) => onUpdate("avoids", event.target.value)} placeholder="e.g. Avoid implying hands-on ML engineering..." rows={5} value={draft.avoids} />
            </FormField>
            <FormField label={`Maximum resume length: ${draft.maxPages} pages`}>
              <input max="4" min="1" onChange={(event) => onUpdate("maxPages", Number(event.target.value))} type="range" value={draft.maxPages} />
            </FormField>
          </div>
        )}
        {step === 3 && (
          <div className="review-grid">
            <ReviewItem label="Candidate" value={profile.name} />
            <ReviewItem label="Company" value={draft.company} />
            <ReviewItem label="Target role" value={draft.role} />
            <ReviewItem label="Source resume" value={draft.sourceResume.split("/").at(-1) ?? ""} />
            <ReviewItem label="Maximum length" value={`${draft.maxPages} pages`} />
            <ReviewItem label="JD captured" value={`${draft.jd.trim().split(/\s+/).length} words`} />
          </div>
        )}
        <footer className="intake-actions">
          <button className="secondary-action" disabled={step === 0} onClick={() => onStep(step - 1)} type="button">Back</button>
          {step < intakeSteps.length - 1 ? (
            <button className="primary-action" disabled={!canContinue} onClick={() => onStep(step + 1)} type="button">Continue</button>
          ) : (
            <button className="primary-action" onClick={onSave} type="button">Create application workspace</button>
          )}
        </footer>
      </section>
    </>
  );
}

function ResumeWorkspace({
  application,
  artifacts,
  claimDecisions,
  density,
  error,
  html,
  onArtifacts,
  onResume,
  profile,
  profileName,
  resume
}: {
  application: SavedApplication;
  artifacts: ApplicationArtifacts;
  claimDecisions: Record<string, ClaimDecision>;
  density: ReturnType<typeof analyzeResumeDensity> | null;
  error: string;
  html: string;
  onArtifacts: (artifacts: ApplicationArtifacts) => void;
  onResume: (resume: ResumeDocument) => void;
  profile: (typeof workspaceCatalog.profiles)[number];
  profileName: string;
  resume: ResumeDocument;
}) {
  const [artifactType, setArtifactType] = useState<ArtifactType>("resume");
  const [resumeMode, setResumeMode] = useState<"preview" | "edit">("preview");
  const [packageSelection, setPackageSelection] = useState<Record<ArtifactType, boolean>>({
    resume: true,
    coverLetter: true,
    outreach: true,
    interviewPrep: true,
    auditTrail: true
  });
  const [packageMessage, setPackageMessage] = useState("");
  const auditTrail = createAuditTrail(application, profile, claimDecisions);
  const unresolvedClaimCount = profile.claimCandidates.filter(
    (claim) => (claimDecisions[claim.id] ?? "pending") === "pending"
  ).length;
  const canPublish = unresolvedClaimCount === 0 && !error;

  function updateArtifact(key: keyof ApplicationArtifacts, value: string) {
    onArtifacts({ ...artifacts, [key]: value });
  }

  function downloadPackage() {
    const content = createPackageMarkdown({
      application,
      artifacts,
      auditTrail,
      profileName,
      selection: packageSelection
    });
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${application.company.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "application"}-package.md`;
    anchor.click();
    URL.revokeObjectURL(url);
    setPackageMessage("Selected collateral downloaded as a Markdown package.");
  }

  function downloadResumeHtml() {
    const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${application.company.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "resume"}-resume.html`;
    anchor.click();
    URL.revokeObjectURL(url);
    setPackageMessage("ATS-safe resume HTML downloaded. Use the verified Chromium renderer for the polished PDF.");
  }

  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">{application.company}</span>
          <h1>{application.role}</h1>
          <p>{profileName} | {application.sourceResume.split("/").at(-1)}</p>
        </div>
        <button className="primary-action" disabled type="button">AI tailoring: backend connection pending</button>
      </section>
      <div className="artifact-tabs" role="tablist" aria-label="Application artifacts">
        {([
          ["resume", "Resume"],
          ["coverLetter", "Cover letter"],
          ["outreach", "Outreach"],
          ["interviewPrep", "Interview prep"],
          ["auditTrail", "Audit trail"]
        ] as Array<[ArtifactType, string]>).map(([key, label]) => (
          <button className={artifactType === key ? "active" : ""} key={key} onClick={() => setArtifactType(key)} role="tab" type="button">
            {label}
          </button>
        ))}
      </div>
      <section className="workspace-grid">
        <div className="surface workspace-summary">
          <div className="section-heading">
            <div><span className="eyebrow">Application brief</span><h2>Targeting context</h2></div>
          </div>
          <dl>
            <dt>Maximum length</dt><dd>{application.maxPages} pages</dd>
            <dt>JD captured</dt><dd>{application.jd.trim().split(/\s+/).length} words</dd>
            <dt>Highlight</dt><dd>{application.highlights || "No additional direction"}</dd>
            <dt>Avoid</dt><dd>{application.avoids || "No additional exclusions"}</dd>
          </dl>
          <div className="next-slice">
            <strong>Local package export</strong>
            <span>Select the collateral to include. Polished PDF publishing remains available through the verified host-side renderer until the backend endpoint is connected.</span>
          </div>
          <div className="package-options">
            {([
              ["resume", "Resume"],
              ["coverLetter", "Cover letter"],
              ["outreach", "Outreach"],
              ["interviewPrep", "Interview prep"],
              ["auditTrail", "Audit trail"]
            ] as Array<[ArtifactType, string]>).map(([key, label]) => (
              <label key={key}><input checked={packageSelection[key]} onChange={(event) => setPackageSelection((current) => ({ ...current, [key]: event.target.checked }))} type="checkbox" /> {label}</label>
            ))}
          </div>
          <button className="primary-action package-download" disabled={!canPublish} onClick={downloadPackage} type="button">Download selected package</button>
          <button className="secondary-action package-download" disabled={!canPublish} onClick={downloadResumeHtml} type="button">Download resume HTML</button>
          {!canPublish && (
            <p className="export-blocker">
              Final export is paused. {unresolvedClaimCount ? `Resolve ${unresolvedClaimCount} pending claim decision(s). ` : ""}
              {error}
            </p>
          )}
          {packageMessage && <p className="package-message">{packageMessage}</p>}
        </div>
        <div className="surface preview-panel">
          <div className="panel-heading">
            <div><strong>{artifactLabel(artifactType)}</strong><span>{artifactType === "resume" ? density ? `${density.estimatedPages} estimated pages | ${density.bulletCount} evidence-linked bullets` : "Preview paused until the resume is valid" : "Editable local draft"}</span></div>
            {artifactType === "resume" ? (
              <div className="resume-mode">
                <button className={resumeMode === "preview" ? "active" : ""} onClick={() => setResumeMode("preview")} type="button">Preview</button>
                <button className={resumeMode === "edit" ? "active" : ""} onClick={() => setResumeMode("edit")} type="button">Edit blocks</button>
              </div>
            ) : <b className="status-pill">Local draft</b>}
          </div>
          {artifactType === "resume" && resumeMode === "preview" && (error ? <div className="resume-validation">{error}</div> : <iframe className="resume-frame" srcDoc={html} title="ATS-safe resume preview" />)}
          {artifactType === "resume" && resumeMode === "edit" && <StructuredResumeEditor onResume={onResume} resume={resume} />}
          {artifactType === "coverLetter" && <textarea className="artifact-editor" aria-label="Cover letter draft" onChange={(event) => updateArtifact("coverLetter", event.target.value)} value={artifacts.coverLetter} />}
          {artifactType === "outreach" && <textarea className="artifact-editor" aria-label="Outreach draft" onChange={(event) => updateArtifact("outreach", event.target.value)} value={artifacts.outreach} />}
          {artifactType === "interviewPrep" && <textarea className="artifact-editor" aria-label="Interview prep draft" onChange={(event) => updateArtifact("interviewPrep", event.target.value)} value={artifacts.interviewPrep} />}
          {artifactType === "auditTrail" && <textarea className="artifact-editor" aria-label="Audit trail" readOnly value={auditTrail} />}
        </div>
      </section>
    </>
  );
}

function StructuredResumeEditor({ onResume, resume }: { onResume: (resume: ResumeDocument) => void; resume: ResumeDocument }) {
  function updateSummary(summary: string) {
    onResume({ ...resume, summary });
  }

  function updateBullet(experienceIndex: number, bulletIndex: number, text: string) {
    onResume({
      ...resume,
      experience: resume.experience.map((experience, currentExperienceIndex) =>
        currentExperienceIndex !== experienceIndex ? experience : {
          ...experience,
          bullets: experience.bullets.map((bullet, currentBulletIndex) =>
            currentBulletIndex !== bulletIndex ? bullet : { ...bullet, text }
          )
        }
      )
    });
  }

  function moveBullet(experienceIndex: number, bulletIndex: number, direction: -1 | 1) {
    onResume({
      ...resume,
      experience: resume.experience.map((experience, currentExperienceIndex) => {
        if (currentExperienceIndex !== experienceIndex) return experience;
        const nextIndex = bulletIndex + direction;
        if (nextIndex < 0 || nextIndex >= experience.bullets.length) return experience;
        const bullets = [...experience.bullets];
        [bullets[bulletIndex], bullets[nextIndex]] = [bullets[nextIndex], bullets[bulletIndex]];
        return { ...experience, bullets };
      })
    });
  }

  function removeBullet(experienceIndex: number, bulletIndex: number) {
    onResume({
      ...resume,
      experience: resume.experience.map((experience, currentExperienceIndex) =>
        currentExperienceIndex !== experienceIndex || experience.bullets.length === 1 ? experience : {
          ...experience,
          bullets: experience.bullets.filter((_, currentBulletIndex) => currentBulletIndex !== bulletIndex)
        }
      )
    });
  }

  return (
    <div className="structured-editor">
      <label className="form-field">
        <span>Professional summary</span>
        <textarea aria-label="Professional summary" onChange={(event) => updateSummary(event.target.value)} rows={7} value={resume.summary} />
      </label>
      {resume.experience.map((experience, experienceIndex) => (
        <section className="experience-editor" key={experience.id}>
          <header><strong>{experience.company}</strong><span>{experience.title}</span></header>
          {experience.bullets.map((bullet, bulletIndex) => (
            <label key={bullet.id}>
              <div className="bullet-editor-meta">
                <span>{bulletIndex + 1}</span>
                <small>{bullet.evidenceLinks?.length ?? 0} evidence link(s)</small>
                <button aria-label={`Move ${experience.company} bullet ${bulletIndex + 1} up`} disabled={bulletIndex === 0} onClick={() => moveBullet(experienceIndex, bulletIndex, -1)} title="Move bullet up" type="button">↑</button>
                <button aria-label={`Move ${experience.company} bullet ${bulletIndex + 1} down`} disabled={bulletIndex === experience.bullets.length - 1} onClick={() => moveBullet(experienceIndex, bulletIndex, 1)} title="Move bullet down" type="button">↓</button>
                <button aria-label={`Remove ${experience.company} bullet ${bulletIndex + 1}`} disabled={experience.bullets.length === 1} onClick={() => removeBullet(experienceIndex, bulletIndex)} title="Remove bullet" type="button">×</button>
              </div>
              <textarea aria-label={`${experience.company} bullet ${bulletIndex + 1}`} onChange={(event) => updateBullet(experienceIndex, bulletIndex, event.target.value)} rows={3} value={bullet.text} />
            </label>
          ))}
        </section>
      ))}
    </div>
  );
}

function QaReport({
  application,
  claimDecisions,
  density,
  evidenceDecisions,
  profile
}: {
  application: SavedApplication;
  claimDecisions: Record<string, ClaimDecision>;
  density: ReturnType<typeof analyzeResumeDensity> | null;
  evidenceDecisions: Record<string, EvidenceDecision>;
  profile: (typeof workspaceCatalog.profiles)[number];
}) {
  const report = createQaReport(application, profile, density, evidenceDecisions, claimDecisions);
  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">{application.company} | {application.role}</span>
          <h1>QA and simulation report</h1>
          <p>Deterministic local checks provide an immediate review baseline. AI-assisted simulations can replace or extend these scores once the authenticated backend is connected.</p>
        </div>
        <span className="local-state">Local baseline</span>
      </section>
      <section className="score-grid" aria-label="Application QA scores">
        {report.scores.map((score) => (
          <div className="surface score-card" key={score.label}>
            <span>{score.label}</span>
            <strong>{score.value}</strong>
            <small>{score.note}</small>
          </div>
        ))}
      </section>
      <section className="simulation-grid">
        <article className="surface simulation-panel">
          <span className="eyebrow">20-second recruiter scan</span>
          <h2>Recruiter screen</h2>
          <p>{report.recruiterSummary}</p>
          <ul>{report.recruiterChecks.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="surface simulation-panel">
          <span className="eyebrow">Hiring-manager deep dive</span>
          <h2>Credibility review</h2>
          <p>{report.hiringManagerSummary}</p>
          <ul>{report.credibilityChecks.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </section>
      <section className="surface simulation-panel action-panel">
        <span className="eyebrow">Resolve before publishing</span>
        <h2>Priority actions</h2>
        <ul>{report.actions.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
    </>
  );
}

function EvidenceLibrary({
  decisions,
  onDecision,
  profile
}: {
  decisions: Record<string, EvidenceDecision>;
  onDecision: (evidenceId: string, decision: EvidenceDecision) => void;
  profile: (typeof workspaceCatalog.profiles)[number];
}) {
  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Reusable profile evidence</span>
          <h1>Evidence library</h1>
          <p>Review defensible source material before tailoring. Decisions are saved in this browser; authenticated profile sync remains a production integration step.</p>
        </div>
        <span className="local-state">Local decisions</span>
      </section>
      <section className="metrics-strip" aria-label="Evidence summary">
        <div><span>Confirmed claims</span><strong>{profile.evidence.filter((item) => item.kind === "confirmed_claim").length}</strong></div>
        <div><span>Approved metrics</span><strong>{profile.evidence.filter((item) => item.kind === "approved_metric").length}</strong></div>
        <div><span>Extrapolations</span><strong>{profile.evidence.filter((item) => item.kind === "approved_extrapolation").length}</strong></div>
        <div><span>Guardrails</span><strong>{profile.forbiddenClaims.length}</strong></div>
      </section>
      <section className="evidence-layout">
        <div className="evidence-list">
          {profile.evidence.length ? profile.evidence.map((item) => {
            const decision = decisions[item.id] ?? "available";
            return (
              <article className={`surface evidence-card evidence-${decision}`} key={item.id}>
                <div className="evidence-card-heading">
                  <span className={`evidence-kind kind-${item.kind}`}>{kindLabel(item.kind)}</span>
                  <span className={`decision-badge decision-${decision}`}>{decision}</span>
                </div>
                <h2>{item.text}</h2>
                <p><strong>Source:</strong> {item.source}</p>
                {item.interviewDefense && <p><strong>Interview defense:</strong> {item.interviewDefense}</p>}
                {item.usableForRoles.length > 0 && (
                  <div className="tag-list">{item.usableForRoles.map((role) => <span key={role}>{role}</span>)}</div>
                )}
                <footer className="card-actions">
                  <button className="secondary-action" onClick={() => onDecision(item.id, "available")} type="button">Keep available</button>
                  <button className="approve-action" onClick={() => onDecision(item.id, "approved")} type="button">Prioritize</button>
                  <button className="forbid-action" onClick={() => onDecision(item.id, "forbidden")} type="button">Mark forbidden</button>
                </footer>
              </article>
            );
          }) : (
            <div className="surface empty-state"><strong>No reusable evidence recorded yet</strong><p>This profile is intentionally conservative. Add evidence only when source support is available.</p></div>
          )}
        </div>
        <aside className="surface guardrail-panel">
          <span className="eyebrow">Profile guardrails</span>
          <h2>Forbidden claims</h2>
          {profile.forbiddenClaims.length ? (
            <ul>{profile.forbiddenClaims.map((claim) => <li key={claim}>{claim}</li>)}</ul>
          ) : <p>No profile-level forbidden claims recorded.</p>}
          {profile.rejectedClaims.length > 0 && (
            <>
              <h2>Rejected claims</h2>
              <ul>{profile.rejectedClaims.map((claim) => <li key={claim}>{claim}</li>)}</ul>
            </>
          )}
        </aside>
      </section>
    </>
  );
}

function ClaimsReview({
  application,
  decisions,
  onDecision,
  profile
}: {
  application: SavedApplication;
  decisions: Record<string, ClaimDecision>;
  onDecision: (claimId: string, decision: ClaimDecision) => void;
  profile: (typeof workspaceCatalog.profiles)[number];
}) {
  const decidedCount = profile.claimCandidates.filter((claim) => (decisions[claim.id] ?? "pending") !== "pending").length;
  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">{application.company} | {application.role}</span>
          <h1>Claims review</h1>
          <p>Risky wording stays outside final artifacts until you explicitly choose the proposed claim or its safer alternative.</p>
        </div>
        <span className="local-state">{decidedCount}/{profile.claimCandidates.length} reviewed locally</span>
      </section>
      <section className="claims-list">
        {profile.claimCandidates.map((claim) => {
          const decision = decisions[claim.id] ?? "pending";
          return (
            <article className={`surface claim-card claim-${decision}`} key={claim.id}>
              <div className="evidence-card-heading">
                <span className={`risk-badge risk-${claim.risk}`}>{claim.risk.replace("_", " ")} risk</span>
                <span className={`decision-badge decision-${decision}`}>{claimDecisionLabel(decision)}</span>
              </div>
              <div className="claim-grid">
                <div>
                  <span className="claim-label">Proposed wording</span>
                  <p>{claim.proposed}</p>
                </div>
                <div>
                  <span className="claim-label">Safer alternative</span>
                  <p>{claim.safer}</p>
                </div>
              </div>
              <p><strong>Why this needs review:</strong> {claim.reason}</p>
              <p><strong>Question for the candidate:</strong> {claim.question}</p>
              <footer className="card-actions">
                <button className="secondary-action" onClick={() => onDecision(claim.id, "pending")} type="button">Reset</button>
                <button className="forbid-action" onClick={() => onDecision(claim.id, "safer")} type="button">Use safer wording</button>
                <button className="approve-action" onClick={() => onDecision(claim.id, "approved")} type="button">Approve proposed</button>
              </footer>
            </article>
          );
        })}
      </section>
      <section className="surface audit-summary">
        <span className="eyebrow">Local audit summary</span>
        <h2>Decision status</h2>
        <p>{decidedCount === profile.claimCandidates.length ? "All review candidates have a local decision." : `${profile.claimCandidates.length - decidedCount} claim decision(s) remain unresolved.`}</p>
        <span>Final export blocking is active. Authenticated audit-trail sync remains a production integration step.</span>
      </section>
    </>
  );
}

function kindLabel(kind: (typeof workspaceCatalog.profiles)[number]["evidence"][number]["kind"]) {
  if (kind === "approved_metric") return "Approved metric";
  if (kind === "approved_extrapolation") return "Approved extrapolation";
  return "Confirmed claim";
}

function claimDecisionLabel(decision: ClaimDecision) {
  if (decision === "approved") return "proposed approved";
  if (decision === "safer") return "safer wording selected";
  return "pending";
}

function createQaReport(
  application: SavedApplication,
  profile: (typeof workspaceCatalog.profiles)[number],
  density: ReturnType<typeof analyzeResumeDensity> | null,
  evidenceDecisions: Record<string, EvidenceDecision>,
  claimDecisions: Record<string, ClaimDecision>
) {
  const jdWords = application.jd.trim().split(/\s+/).filter(Boolean).length;
  const forbiddenCount = Object.values(evidenceDecisions).filter((decision) => decision === "forbidden").length;
  const prioritizedCount = Object.values(evidenceDecisions).filter((decision) => decision === "approved").length;
  const unresolvedClaims = profile.claimCandidates.filter((claim) => (claimDecisions[claim.id] ?? "pending") === "pending").length;
  const resolvedClaims = profile.claimCandidates.length - unresolvedClaims;
  const pagePressure = density ? density.estimatedPages > application.maxPages : true;
  const densityWarnings = density?.warnings ?? [];
  const ats = clamp(92 - densityWarnings.length * 2 - (pagePressure ? 12 : 0));
  const shortlist = clamp(64 + Math.min(profile.evidence.length, 14) + prioritizedCount * 2 - unresolvedClaims * 6);
  const credibility = clamp(78 + resolvedClaims * 5 - unresolvedClaims * 8 - forbiddenCount * 2);
  const defensibility = clamp(76 + resolvedClaims * 6 - unresolvedClaims * 10);
  const presentation = clamp(90 - (pagePressure ? 18 : 0) - densityWarnings.filter((warning) => warning.severity === "high").length * 4);
  const recruiterChecks = [
    `${profile.evidence.length} reusable evidence asset(s) available for role alignment.`,
    density ? `${density.bulletCount} evidence-linked resume bullet(s) in the validated base resume.` : "Resume validation must pass before the rendered preview is available.",
    jdWords >= 20 ? "JD intake is detailed enough for an initial tailoring pass." : "JD intake is too short for reliable tailoring; paste the complete posting."
  ];
  const credibilityChecks = [
    unresolvedClaims ? `${unresolvedClaims} risky claim decision(s) remain unresolved.` : "All profile-specific review candidates have a local decision.",
    forbiddenCount ? `${forbiddenCount} evidence item(s) are locally marked forbidden.` : "No additional evidence assets are locally forbidden.",
    density ? pagePressure ? `Current density estimates ${density.estimatedPages} pages against a ${application.maxPages}-page limit.` : "Estimated resume density fits the selected page constraint." : "Resume validation is incomplete; repair the edited block before publishing."
  ];
  const actions = [
    ...(unresolvedClaims ? ["Resolve every pending claim in Claims Review before publishing."] : []),
    ...(jdWords < 20 ? ["Replace the short JD placeholder with the full target job description."] : []),
    ...(pagePressure ? ["Tighten or reweight resume content to meet the selected page constraint."] : []),
    "Run the AI tailoring pass after the authenticated backend is connected.",
    "Generate the polished PDF and run extraction and screenshot QA before submission."
  ];
  return {
    scores: [
      { label: "ATS compatibility", value: ats, note: "Format and density baseline" },
      { label: "Recruiter shortlist", value: shortlist, note: "Evidence coverage baseline" },
      { label: "Hiring-manager credibility", value: credibility, note: "Claim proportionality baseline" },
      { label: "Defensibility", value: defensibility, note: "Approval readiness baseline" },
      { label: "Presentation readiness", value: presentation, note: "Page-pressure baseline" }
    ],
    recruiterSummary: shortlist >= 78 ? "The base profile has enough relevant evidence for a credible recruiter-facing draft." : "The profile needs stronger role-specific evidence selection before submission.",
    recruiterChecks,
    hiringManagerSummary: credibility >= 80 ? "The current evidence boundary is credible if unresolved claims remain excluded from final artifacts." : "The current draft needs claim decisions and tighter evidence calibration before publishing.",
    credibilityChecks,
    actions
  };
}

function createDefaultArtifacts(application: SavedApplication, profileName: string): ApplicationArtifacts {
  return {
    coverLetter: `Dear Hiring Team,

I am applying for the ${application.role} position at ${application.company}. My background aligns most strongly with ${application.highlights || "the core product and delivery outcomes described in the role"}.

I would welcome the opportunity to discuss how my experience can support your team.

Sincerely,
${profileName}`,
    outreach: `Subject: ${application.role} | ${profileName}

Hi,

I am reaching out regarding the ${application.role} opportunity at ${application.company}. My background is relevant to the role's priorities, and I would value a brief conversation.

Best,
${profileName}`,
    interviewPrep: `# Interview Bridge Notes

## Target
- Company: ${application.company}
- Role: ${application.role}

## Emphasize
- ${application.highlights || "Confirm the highest-value evidence during tailoring."}

## Avoid
- ${application.avoids || "Do not overstate unsupported ownership or technical depth."}
`
  };
}

function createAuditTrail(
  application: SavedApplication,
  profile: (typeof workspaceCatalog.profiles)[number],
  claimDecisions: Record<string, ClaimDecision>
) {
  return `# Claims Approval Audit Trail

- Profile: ${profile.name}
- Target application: ${application.company} | ${application.role}
- Local workspace state: not yet persisted to the filesystem or cloud

${profile.claimCandidates.map((claim) => `## ${claim.id}
- Risk: ${claim.risk.replace("_", " ")}
- Proposed: ${claim.proposed}
- Safer alternative: ${claim.safer}
- Local decision: ${claimDecisions[claim.id] ?? "pending"}
`).join("\n")}`;
}

function createPackageMarkdown({
  application,
  artifacts,
  auditTrail,
  profileName,
  selection
}: {
  application: SavedApplication;
  artifacts: ApplicationArtifacts;
  auditTrail: string;
  profileName: string;
  selection: Record<ArtifactType, boolean>;
}) {
  const sections = [
    `# ${profileName} | ${application.company} | ${application.role}`,
    selection.resume ? "## Resume\n\nUse the validated ATS-safe PDF or HTML resume artifact from the workspace preview." : "",
    selection.coverLetter ? `## Cover Letter\n\n${artifacts.coverLetter}` : "",
    selection.outreach ? `## Outreach\n\n${artifacts.outreach}` : "",
    selection.interviewPrep ? `## Interview Prep\n\n${artifacts.interviewPrep}` : "",
    selection.auditTrail ? `## Audit Trail\n\n${auditTrail}` : ""
  ];
  return sections.filter(Boolean).join("\n\n");
}

function artifactLabel(artifactType: ArtifactType) {
  if (artifactType === "coverLetter") return "Cover letter draft";
  if (artifactType === "outreach") return "Recruiter outreach draft";
  if (artifactType === "interviewPrep") return "Interview prep notes";
  if (artifactType === "auditTrail") return "Claims approval audit trail";
  return "Validated base resume preview";
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function friendlyFileName(value: string) {
  return value.replace(/\.[^.]+$/, "").replaceAll("_", " ").replaceAll("-", " ");
}

function formatBytes(sizeBytes: number) {
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function loadPersistedWorkspace(): PersistedWorkspace {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "") as Partial<PersistedWorkspace>;
    return {
      activeApplicationId: stored.activeApplicationId ?? "",
      activeProfileSlug: stored.activeProfileSlug ?? workspaceCatalog.profiles[0].slug,
      applications: stored.applications ?? [],
      artifacts: stored.artifacts ?? {},
      evidenceDecisions: stored.evidenceDecisions ?? {},
      claimDecisions: stored.claimDecisions ?? {},
      resumeDecisions: stored.resumeDecisions ?? {},
      resumeDrafts: stored.resumeDrafts ?? {}
    };
  } catch {
    return {
      activeApplicationId: "",
      activeProfileSlug: workspaceCatalog.profiles[0].slug,
      applications: [],
      artifacts: {},
      evidenceDecisions: {},
      claimDecisions: {},
      resumeDecisions: {},
      resumeDrafts: {}
    };
  }
}

function FormField({ children, label }: { children: ReactNode; label: string }) {
  return <label className="form-field"><span>{label}</span>{children}</label>;
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return <div className="review-item"><span>{label}</span><strong>{value}</strong></div>;
}
