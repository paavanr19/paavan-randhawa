import { ArrowUpRight } from "lucide-react";
import { PixelSticker } from "@/components/pixel-sticker";
import { education } from "@/lib/education";
import content from "@/lib/portfolio-content.json";

export function EducationSection() {
  return <section id="education" className="original-education">
    <div className="section-heading"><h2 className="section-title">Education</h2><PixelSticker kind="cursor" className="education-cursor" /></div>
    <div className="education-grid">
      <div className="education-courses"><h3>Courses</h3><p className="education-note">Click on each course code to learn more</p>
        <ul>{education.courses.map(item => <li key={item.title}>{item.codes.map((code, index) => <span key={code.code}>{index > 0 && " / "}<a href={code.href} target="_blank" rel="noopener noreferrer">{code.code}{code.inProgress && "*"}<span className="sr-only"> (opens in a new tab)</span></a></span>)}<span> — {item.title}</span></li>)}</ul>
        <p className="education-note course-footnote">* indicates course in progress</p>
      </div>
      <div className="education-side">
        <div><h3>Skills</h3>{content.skills.map(skill => <div key={skill.title} className="skill-group"><h4>{skill.title}</h4><p>{skill.description}</p></div>)}</div>
        <div className="certifications"><h3>Certifications</h3><ul>{education.certifications.map(cert => <li key={cert.title}>
          {cert.href ? <a href={cert.href} target="_blank" rel="noopener noreferrer" className="certification-link">{cert.title}<ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (verify credential, opens in a new tab)</span></a> : <strong>{cert.title}</strong>}
          <p>{cert.issuer}</p><p className="education-note">{cert.inProgress ? "In progress" : cert.date}{cert.expires && ` · Expires ${cert.expires}`}</p>
        </li>)}</ul></div>
      </div>
    </div>
  </section>;
}
