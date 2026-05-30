import { describe, expect, it } from "vitest";

import { analyzeResumeDensity, renderResumeHtml } from "../../src/render";

const fixture = {
  name: "Jordan Lee",
  targetTitle: "Senior Product Manager | Workflow Automation",
  contact: {
    location: "Toronto, ON",
    email: "jordan@example.com",
    linkedIn: "linkedin.com/in/jordanlee",
  },
  summary:
    "Product leader focused on operational workflows, platform modernization, and measurable customer outcomes.",
  strengths: [
    { category: "Product", skills: ["Discovery", "Roadmaps", "Launch Planning"] },
    { category: "Delivery", skills: ["Agile", "Cross-functional Leadership"] },
  ],
  experience: [
    {
      company: "Example Corp",
      title: "Senior Product Manager",
      dates: "2022 - Present",
      location: "Toronto, ON",
      bullets: [
        "Led workflow modernization across customer onboarding and internal operations.",
        { text: "Partnered with engineering and design to improve product delivery." },
      ],
    },
  ],
  education: [
    {
      institution: "Example University",
      credential: "B.A., Economics",
      dates: "2014",
    },
  ],
};

describe("renderResumeHtml", () => {
  it("renders a complete ATS-safe printable HTML document", () => {
    const html = renderResumeHtml(fixture);

    expect(html).toContain("<!doctype html>");
    expect(html).toContain("@page");
    expect(html).toContain("size: Letter");
    expect(html).toContain("resume-header");
    expect(html).toContain("strength-row");
    expect(html).toContain("experience-heading");
    expect(html).toContain("Example Corp");
    expect(html).toContain("Senior Product Manager");
    expect(html).toContain("2022 - Present");
    expect(html).toContain('content: "-"');
  });

  it("escapes user-controlled text", () => {
    const html = renderResumeHtml({
      name: "Jordan <script>alert('x')</script>",
      summary: "Platform & workflow leadership",
    });

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Platform &amp; workflow leadership");
  });
});

describe("analyzeResumeDensity", () => {
  it("reports long bullets, excessive bullet count, and page pressure", () => {
    const longBullet = "Detailed delivery outcome ".repeat(30);
    const bullets = Array.from({ length: 21 }, () => longBullet);
    const analysis = analyzeResumeDensity({
      summary: "Summary ".repeat(300),
      strengths: [{ skills: ["Product strategy", "Workflow automation"] }],
      experience: [{ bullets }],
    });

    expect(analysis.bulletCount).toBe(21);
    expect(analysis.longBulletCount).toBe(21);
    expect(analysis.estimatedPages).toBeGreaterThan(2);
    expect(analysis.warnings.some((warning) => warning.code === "long_bullet")).toBe(true);
    expect(analysis.warnings.some((warning) => warning.code === "too_many_bullets")).toBe(true);
    expect(analysis.warnings.some((warning) => warning.code === "page_pressure")).toBe(true);
  });

  it("returns no warnings for a concise resume", () => {
    const analysis = analyzeResumeDensity(fixture);

    expect(analysis.bulletCount).toBe(2);
    expect(analysis.warnings).toEqual([]);
  });
});
