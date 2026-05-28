# Resume-Creator

Resume-Creator is a structured resume application workspace.

This workspace creates tailored job application packages for one or more candidates. It supports resume tailoring, recruiter messages, cover letters or application notes, ATS checks, recruiter-readiness checks, hiring-manager-readiness checks, presentation/publishing review, and interview-prep notes.

The workflow is candidate-agnostic. Before starting a JD-based task, Codex should ask who the resume is for, then use or create that person's profile under `users/`.

## Folder Structure

- `AGENTS.md`: Global operating instructions for the multi-user workflow.
- `users/`: Candidate-specific profiles, context, resumes, job descriptions, and outputs.
- `users/_template/`: Starter structure for creating a new candidate profile.
- `users/{user_slug}/profile.md`: Candidate identity and high-level targeting.
- `users/{user_slug}/context/`: Candidate-specific preferences, evidence, metrics, approvals, rejected claims, and positioning notes.
- `users/{user_slug}/source_resumes/`: Source resumes for that candidate.
- `users/{user_slug}/job_descriptions/`: Job descriptions for that candidate.
- `users/{user_slug}/notes/`: Candidate-specific notes, recruiter calls, constraints, and preferences.
- `users/{user_slug}/resume_formats/samples/`: Preferred resume formats, sample outputs, or visual references.
- `users/{user_slug}/outputs/`: Finished and working application packages, arranged by JD.
- `skills/`: Global reusable workflow patterns, role-positioning patterns, messaging patterns, and interview patterns.
- `templates/`: Candidate-neutral starter formats.

## Adding A Candidate

Create a new folder under `users/` using a lowercase slug:

```text
users/first_last/
```

Copy the structure from `users/_template/`, then fill in:

- `profile.md`
- `context/candidate_profile.md`
- `context/preferences.md`
- `context/company_positioning.md`
- Source resumes
- Notes
- Resume format samples

Keep candidate-specific facts inside that candidate folder.

## Adding Source Resumes

Place each candidate's resumes under:

```text
users/{user_slug}/source_resumes/
```

Use clear names such as:

- `master_resume.md`
- `retail_product_resume.docx`
- `ai_product_resume.pdf`

When a resume contains outdated, risky, or role-specific claims, add a note under:

```text
users/{user_slug}/notes/
```

## Adding Job Descriptions

Place each target job description under:

```text
users/{user_slug}/job_descriptions/
```

Use clear names such as:

- `company_role_job_description.md`
- `company_senior_product_manager_jd.txt`

Include the full posting if possible: responsibilities, requirements, preferred qualifications, company context, location, compensation, and recruiter notes.

## Running A Resume Tailoring Task

Start by identifying the candidate:

```text
Use the first_last profile and tailor a package for users/first_last/job_descriptions/company_role_jd.md.
```

If no candidate is specified, Codex should ask:

```text
Who is this resume or application package for?
```

Codex should follow the workflow in `AGENTS.md`:

1. Confirm or create the candidate profile.
2. Analyze the JD.
3. Extract evidence from that candidate's source resumes and context files.
4. Choose positioning.
5. Draft the resume.
6. Ask approval questions for strategic or risky claims.
7. Audit ATS, truth, recruiter fit, hiring manager credibility, and presentation readiness.
8. Revise.
9. Draft supporting messages or notes.
10. Save outputs.
11. Update the candidate's reusable context files when new learnings are approved.

## Saving Outputs

Every JD-based application package should have its own folder:

```text
users/{user_slug}/outputs/company_role_YYYY-MM-DD/
```

Recommended layout:

```text
users/{user_slug}/outputs/company_role_YYYY-MM-DD/
  resume/
  cover_letter/
  recruiter_messages/
  assessment/
  interview_prep/
```

Store all artifacts for that JD in the JD-specific folder.

## Continuous Learning

After each completed package, reusable learnings should be captured inside the active candidate's `context/` folder.

Examples:

- Confirmed claims go into `context/evidence_bank.json`.
- Approved metrics go into `context/approved_metrics.json`.
- Approved strategic extrapolations go into `context/approved_extrapolations.json`.
- Rejected or risky claims go into `context/rejected_claims.md` or `context/forbidden_claims.md`.
- Candidate-specific company positioning goes into `context/company_positioning.md`.
- Candidate-specific formatting preferences go into `context/preferences.md`.

## Approval-Based Extrapolation

The workspace does not fabricate experience.

Some role positioning may use strategic extrapolation only when it is grounded in the candidate's actual work and explicitly approved by the active user. Strategic extrapolation must be interview-defensible and cannot invent employers, titles, degrees, certifications, exact revenue, exact team sizes, patents, publications, or hands-on skills.

Unapproved strategic extrapolations and high-risk stretches must appear only in a working section called `Claims That Need Your Approval`. They must not appear in final resumes, cover letters, recruiter messages, or LinkedIn content until approved.

Approval questions and decisions should be recorded in:

```text
users/{user_slug}/outputs/company_role_YYYY-MM-DD/assessment/approval_audit_trail.md
```
