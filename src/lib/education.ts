const calendar = "https://www.sfu.ca/students/calendar/2026/fall/courses";
const course = (subject: string, number: number, inProgress = false) => ({
  code: `${subject.toUpperCase()} ${number}`,
  href: `${calendar}/${subject}/${number}.html`,
  inProgress,
});

export const education = {
  institution: "Simon Fraser University",
  degree: "Bachelor of Applied Science in Mathematics and Computing Science",
  started: 2024,
  expectedGraduation: "April 2028",
  gpa: 3.57,
  gpaScale: 4.33,
  courses: [
    { codes: [course("math", 150), course("math", 152), course("math", 251)], title: "Calculus I–III" },
    { codes: [course("math", 232)], title: "Applied Linear Algebra" },
    { codes: [course("macm", 101), course("macm", 201, true)], title: "Discrete Mathematics I/II" },
    { codes: [course("cmpt", 225)], title: "Data Structures and Programming" },
    { codes: [course("stat", 270)], title: "Introduction to Probability and Statistics" },
    { codes: [course("cmpt", 276)], title: "Introduction to Software Engineering" },
    { codes: [course("cmpt", 201)], title: "Systems Programming" },
    { codes: [course("cmpt", 295)], title: "Intro to Computer Systems" },
    { codes: [course("cmpt", 310, true)], title: "Introduction to Artificial Intelligence" },
    { codes: [course("cmpt", 371, true)], title: "Data Communications and Networking" },
    { codes: [course("math", 360, true)], title: "Introduction to Biomathematics" },
  ],
  certifications: [
    { title: "Claude Code 101", issuer: "Anthropic", date: "September 2026", href: "https://academy.claude.com/verify/ea78f9af75f6f61de17a240430d2ed9b", expires: undefined, inProgress: false },
    { title: "Applied AI Foundations", issuer: "OpenAI", date: "October 2026", href: "https://oaiacademy.credential.net/b56eb820-8cd6-4254-b325-d419d5fcfa82", expires: "April 2027", inProgress: false },
    { title: "DELF A2", issuer: "France Éducation international", date: "June 2024", href: undefined, expires: undefined, inProgress: false },
    { title: "Fundamentals of Cloud Computing", issuer: "IBM SkillsBuild", date: undefined, href: undefined, expires: undefined, inProgress: true },
  ],
};