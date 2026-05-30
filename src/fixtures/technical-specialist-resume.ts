import { SCHEMA_VERSION, type ResumeDocument } from "../domain";

export const technicalSpecialistResumeFixture = {
  schemaVersion: SCHEMA_VERSION,
  id: "fixture-technical-specialist",
  header: {
    name: "Avery Morgan",
    targetTitle: "SAP ABAP Technical Specialist",
    location: "Chicago, IL",
    email: "avery.morgan@example.com",
    links: [],
  },
  summary:
    "SAP technical specialist with implementation and support experience across business-critical enterprise workflows.",
  groupedStrengths: [
    {
      category: "SAP Development",
      strengths: ["ABAP OO", "RICEF", "IDoc", "BAPI"],
    },
    {
      category: "Delivery",
      strengths: ["Technical design", "Defect resolution", "Post-go-live support"],
    },
  ],
  experience: [
    {
      id: "technical-example-consulting",
      company: "Example Consulting",
      title: "SAP ABAP Technical Specialist",
      location: "Chicago, IL",
      dateRange: {
        start: "2021",
        isCurrent: true,
      },
      bullets: [
        {
          id: "technical-example-consulting-bullet-1",
          text: "Develop and support ABAP enhancements for Order to Cash workflows.",
          evidenceLinks: [
            {
              evidenceId: "technical-evidence-001",
              classification: "confirmed",
              approvalState: "not_required",
              source: "fixture source resume",
            },
          ],
        },
        {
          id: "technical-example-consulting-bullet-2",
          text: "Contribute to technical design and post-go-live defect resolution.",
          evidenceLinks: [
            {
              evidenceId: "technical-evidence-002",
              classification: "reasonable_reframe",
              approvalState: "not_required",
              source: "fixture source resume",
            },
          ],
        },
      ],
    },
    {
      id: "technical-example-services",
      company: "Enterprise Services Group",
      title: "SAP ABAP Consultant",
      dateRange: {
        start: "2016",
        end: "2021",
        isCurrent: false,
      },
      bullets: [
        {
          id: "technical-example-services-bullet-1",
          text: "Delivered reports, interfaces, conversions, enhancements, and forms for SAP implementations.",
          evidenceLinks: [
            {
              evidenceId: "technical-evidence-003",
              classification: "confirmed",
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
      institution: "Example Institute of Technology",
      credential: "Bachelor of Engineering",
      fieldOfStudy: "Computer Science",
    },
  ],
  tools: [
    {
      category: "SAP",
      tools: ["ABAP OO", "IDoc", "BAPI", "Smart Forms"],
    },
  ],
} satisfies ResumeDocument;
