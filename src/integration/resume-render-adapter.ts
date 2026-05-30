import type { ResumeDocument as CanonicalResumeDocument } from "../domain";
import type { ResumeDocument as RenderResumeDocument } from "../render";

function formatDateRange(
  dateRange: CanonicalResumeDocument["experience"][number]["dateRange"]
): string {
  return `${dateRange.start} - ${dateRange.isCurrent ? "Present" : dateRange.end}`;
}

export function toRenderResumeDocument(
  resume: CanonicalResumeDocument
): RenderResumeDocument {
  return {
    name: resume.header.name,
    targetTitle: resume.header.targetTitle,
    contact: {
      location: resume.header.location,
      phone: resume.header.phone,
      email: resume.header.email,
      linkedIn: resume.header.links.find((link) =>
        link.label.toLowerCase().includes("linkedin")
      )?.url,
      website: resume.header.links.find(
        (link) => !link.label.toLowerCase().includes("linkedin")
      )?.url
    },
    summary: resume.summary,
    strengths: resume.groupedStrengths.map((group) => ({
      category: group.category,
      skills: group.strengths
    })),
    experience: resume.experience.map((experience) => ({
      company: experience.company,
      title: experience.title,
      dates: formatDateRange(experience.dateRange),
      location: experience.location,
      summary: experience.summary,
      bullets: experience.bullets.map((bullet) => ({
        text: bullet.text
      }))
    })),
    education: resume.education.map((education) => ({
      institution: education.institution,
      credential: [
        education.credential,
        education.fieldOfStudy
      ].filter(Boolean).join(", "),
      dates: education.graduationDate,
      location: education.location
    })),
    certifications: resume.certifications?.map((certification) =>
      [certification.name, certification.issuer].filter(Boolean).join(", ")
    ),
    tools: resume.tools?.flatMap((group) =>
      group.tools.map((tool) => `${group.category}: ${tool}`)
    )
  };
}
