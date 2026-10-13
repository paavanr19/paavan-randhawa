import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { EducationSection } from "@/components/education-section";
import { ContactForm } from "@/components/contact-form";
import { InterestsArc } from "@/components/interests-arc";
import { ArrowUpRight, Download, Github, Linkedin, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PixelSticker } from "@/components/pixel-sticker";
import content from "@/lib/portfolio-content.json";
const portrait = { url: "/images/pfp.png" };
const resume = { url: "/images/PaavanRandhawa-Resume.pdf" };

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Paavan Randhawa" },
    { name: "description", content: "Paavan Randhawa, computing science student at Simon Fraser University in Vancouver. Projects, education, interests, and contact." },
    { property: "og:title", content: "Paavan Randhawa" },
    { property: "og:description", content: "Explore Paavan's software projects, education at Simon Fraser University, and life beyond the screen." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const sections = ["About", "Projects", "Education", "Interests", "Contact"];
const github = "https://github.com/paavanr19";
const linkedin = "https://www.linkedin.com/in/paavan-randhawa-229738292";

function ResumeLink() {
  return <Button asChild variant="outline" className="portfolio-button"><a href={resume.url} download="PaavanRandhawa-Resume.pdf">Download Resume <Download size={16} /></a></Button>;
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      if (progressRef.current) progressRef.current.style.width = `${el.scrollTop / (el.scrollHeight - el.clientHeight) * 100}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const sectionEls = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-links a[href^='#']");
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`)); }),
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 }
    );
    sectionEls.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  const [typedCharacters, setTypedCharacters] = useState(0);
  const name = "Paavan Randhawa!";
  const greeting = "Hi, I'm";
  const greetingLength = greeting.length + name.length;
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedCharacters(greetingLength);
      return;
    }
    let timer: number | undefined;
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        setTypedCharacters(count => {
          if (count + 1 >= greetingLength) window.clearInterval(timer);
          return Math.min(count + 1, greetingLength);
        });
      }, 85);
    }, 1500);
    return () => { window.clearTimeout(start); window.clearInterval(timer); };
  }, [greetingLength]);
  return <div className="portfolio-shell">
    <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
    <header className="portfolio-nav">
      <a href="#about" className="wordmark">Paavan Randhawa</a>
      <Button variant="ghost" size="icon" className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      <nav id="main-navigation" className="nav-links" data-open={menuOpen} aria-label="Main navigation">{sections.map(section => <a key={section} href={`#${section.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{section}</a>)}</nav>
      <Button asChild className="nav-cta"><a href={github} target="_blank" rel="noopener noreferrer">Visit GitHub <ArrowUpRight size={15} /></a></Button>
    </header>
    <main>
      <section id="about" className="original-about">
        <div className="original-about-copy">
          <p className="hello" aria-label={greeting}><span className="terminal-prompt" aria-hidden="true">&gt;_</span> {typedCharacters === 0 && <span className="terminal-caret" aria-hidden="true">|</span>}<span aria-hidden="true">{greeting.slice(0, typedCharacters)}<span className="typewriter-pending">{greeting.slice(typedCharacters)}</span></span></p>
          <h1 aria-label={name} data-typing={typedCharacters > greeting.length && typedCharacters < greetingLength}><span aria-hidden="true">{name.slice(0, Math.max(0, typedCharacters - greeting.length))}<span className="typewriter-pending">{name.slice(Math.max(0, typedCharacters - greeting.length))}</span></span></h1>
          <p className="bio">{content.bio}</p>
          <div className="btn-group"><ResumeLink /><Button asChild className="portfolio-button"><a href="#contact">Contact <ArrowUpRight size={16} /></a></Button></div>
          <div className="socials"><Button asChild variant="ghost" size="icon"><a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><Github /></a></Button><Button asChild variant="ghost" size="icon"><a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin /></a></Button></div>
        </div>
        <figure className="original-portrait"><img src={portrait.url} alt="Paavan Randhawa" fetchPriority="high" /></figure>
      </section>
      <section id="projects" className="original-projects">
        <div className="section-heading"><h2 className="section-title">Projects</h2></div>
        <div className="project-grid">
          {content.projects.map(project => <article key={project.title} className="original-project"><img className="project-image" src={project.image} alt={project.imageAlt} loading="lazy" /><div className="project-body"><h3>{project.title}</h3><Button asChild variant="outline" className="portfolio-button"><a href={project.href} target="_blank" rel="noopener noreferrer">View project <ArrowUpRight size={16} /></a></Button><p>{project.description}</p></div></article>)}
        </div>
      </section>
      <EducationSection />
      <section id="interests" className="original-interests">
        <div><div className="section-heading"><h2 className="section-title">Interests</h2></div><p>{content.interests}</p></div>
        <InterestsArc />
      </section>
      <section id="contact" className="original-contact">
        <div className="contact-header">
          <div className="section-heading"><h2 className="section-title">Contact Me</h2><PixelSticker className="contact-envelope" /></div>
          <p>{content.contact}</p>
        </div>
        <ContactForm />
      </section>
    </main>
    <footer className="portfolio-footer"><nav aria-label="Footer navigation">{sections.map(section => <a key={section} href={`#${section.toLowerCase()}`}>{section}</a>)}</nav><p>© 2026 Paavan Randhawa</p></footer>
  </div>;
}
