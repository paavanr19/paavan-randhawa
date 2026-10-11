import { describe, expect, it } from "vitest";
import { education } from "@/lib/education";

describe("Education records", () => {
  it("uses the requested degree and expected graduation", () => {
    expect(education.degree).toBe("Bachelor of Applied Science in Mathematics and Computing Science");
    expect(education.started).toBe(2024);
    expect(education.expectedGraduation).toBe("April 2028");
  });
  it("uses GPA 3.57 out of 4.33", () => {
    expect(education.gpa).toBe(3.57);
    expect(education.gpaScale).toBe(4.33);
  });
  it("marks only the four specified courses in progress", () => {
    expect(education.courses.flatMap(c => c.codes).filter(c => c.inProgress).map(c => c.code)).toEqual(["MACM 201", "CMPT 310", "CMPT 371", "MATH 360"]);
  });
  it("has the 14 requested course links without CMPT 120 or 125", () => {
    const codes = education.courses.flatMap(c => c.codes);
    expect(codes.map(c => c.code)).toEqual(["MATH 150", "MATH 152", "MATH 251", "MATH 232", "MACM 101", "MACM 201", "CMPT 225", "STAT 270", "CMPT 276", "CMPT 201", "CMPT 295", "CMPT 310", "CMPT 371", "MATH 360"]);
    for (const code of codes) {
      const [subject, number] = code.code.toLowerCase().split(" ");
      expect(code.href).toBe(`https://www.sfu.ca/students/calendar/2026/fall/courses/${subject}/${number}.html`);
    }
  });
  it("preserves Claude's credential and September 2026 completion", () => {
    expect(education.certifications[0]).toMatchObject({ title: "Claude Code 101", issuer: "Anthropic", date: "September 2026", href: "https://academy.claude.com/verify/ea78f9af75f6f61de17a240430d2ed9b" });
  });
  it("preserves OpenAI's credential and April 2027 expiration", () => {
    expect(education.certifications[1]).toMatchObject({ title: "Applied AI Foundations", issuer: "OpenAI", date: "October 2026", expires: "April 2027", href: "https://oaiacademy.credential.net/b56eb820-8cd6-4254-b325-d419d5fcfa82" });
  });
  it("records DELF A2 completed in June 2024", () => {
    expect(education.certifications[2]).toMatchObject({ title: "DELF A2", issuer: "France Éducation international", date: "June 2024", inProgress: false });
  });
  it("records IBM SkillsBuild as in progress, without an invented completion date", () => {
    expect(education.certifications[3]).toMatchObject({ title: "Fundamentals of Cloud Computing", issuer: "IBM SkillsBuild", inProgress: true, date: undefined });
  });
});