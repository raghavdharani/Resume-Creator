import { SCHEMA_VERSION, type ResumeDocument } from "../domain";

export const productManagerResumeFixture = {
  schemaVersion: SCHEMA_VERSION,
  id: "fixture-product-manager",
  header: {
    name: "Jordan Lee",
    targetTitle: "Senior Product Manager | Workflow Automation",
    location: "Toronto, ON",
    email: "jordan.lee@example.com",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/jordan-lee-example",
      },
    ],
  },
  summary:
    "Product manager focused on workflow modernization, platform delivery, and measurable operational improvements.",
  groupedStrengths: [
    {
      category: "Product",
      strengths: ["Product strategy", "Roadmaps", "Discovery"],
    },
    {
      category: "Delivery",
      strengths: ["Cross-functional leadership", "Workflow automation"],
    },
  ],
  experience: [
    {
      id: "pm-example-platform",
      company: "Northstar Platforms",
      title: "Senior Product Manager",
      location: "Toronto, ON",
      dateRange: {
        start: "2023",
        isCurrent: true,
      },
      bullets: [
        {
          id: "pm-example-platform-bullet-1",
          text: "Lead discovery and delivery for workflow improvements used by operations teams.",
          evidenceLinks: [
            {
              evidenceId: "pm-evidence-001",
              classification: "confirmed",
              approvalState: "not_required",
              source: "fixture source resume",
            },
          ],
        },
      ],
    },
    {
      id: "pm-example-commerce",
      company: "Beacon Commerce",
      title: "Product Manager",
      dateRange: {
        start: "2020",
        end: "2023",
        isCurrent: false,
      },
      bullets: [
        {
          id: "pm-example-commerce-bullet-1",
          text: "Prioritized platform enhancements with engineering and business stakeholders.",
          evidenceLinks: [
            {
              evidenceId: "pm-evidence-002",
              classification: "reasonable_reframe",
              approvalState: "not_required",
              source: "fixture source resume",
            },
          ],
        },
      ],
    },
  ],
  education: [
    {
      institution: "Example University",
      credential: "Bachelor of Commerce",
    },
  ],
  certifications: [
    {
      name: "Certified Scrum Product Owner",
      issuer: "Scrum Alliance",
    },
  ],
  tools: [
    {
      category: "Product delivery",
      tools: ["Jira", "Confluence", "Figma"],
    },
  ],
} satisfies ResumeDocument;
