import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Download, Github, Linkedin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { PixelSticker } from "@/components/pixel-sticker";
import content from "@/lib/portfolio-content.json";
import portrait from "@/assets/original/pfp.png.asset.json";
import whistler from "@/assets/original/whistler.jpeg.asset.json";
import lostlake from "@/assets/original/lostlake.jpeg.asset.json";
import tunnelbluffs from "@/assets/original/tunnelbluffs.png.asset.json";
import resume from "@/assets/original/PaavanRandhawa-Resume.pdf.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Paavan Randhawa — Computing Science Portfolio" },
    { name: "description", content: "Paavan Randhawa, computing science student at Simon Fraser University in Vancouver. Projects, education, interests, and contact." },
    { property: "og:title", content: "Paavan Randhawa — Computing Science Portfolio" },
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
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!api) return;
    const update = () => setActive(api.selectedScrollSnap());
    update();
    api.on("select", update);
    return () => { api.off("select", update); };
  }, [api]);
  useEffect(() => {
    if (!api || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => api.scrollNext(), 5000);
    return () => window.clearInterval(timer);
  }, [api, paused, active]);
  return <div className="portfolio-shell">
    <header className="portfolio-nav">
      <a href="#about" className="wordmark">Paavan Randhawa</a>
      <Button variant="ghost" size="icon" className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      <nav id="main-navigation" className="nav-links" data-open={menuOpen} aria-label="Main navigation">{sections.map(section => <a key={section} href={`#${section.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{section}</a>)}</nav>
      <Button asChild className="nav-cta"><a href={github} target="_blank" rel="noopener noreferrer">Visit GitHub <ArrowUpRight size={15} /></a></Button>
    </header>
    <main>
      <section id="about" className="original-about">
        <div className="original-about-copy">
          <p className="hello">hi i'm</p>
          <h1>Paavan!</h1>
          <p className="lead">Student at Simon Fraser University</p>
          <p className="bio">{content.bio}</p>
          <div className="btn-group"><ResumeLink /><Button asChild className="portfolio-button"><a href="#contact">Contact <ArrowUpRight size={16} /></a></Button></div>
          <div className="socials"><Button asChild variant="ghost" size="icon"><a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><Github /></a></Button><Button asChild variant="ghost" size="icon"><a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin /></a></Button></div>
        </div>
        <figure className="original-portrait"><img src={portrait.url} alt="Paavan Randhawa" fetchPriority="high" /><PixelSticker className="portrait-star" /></figure>
      </section>
      <section id="projects" className="original-projects">
        <h2 className="section-title">Projects</h2>
        <Carousel opts={{ loop: true }} setApi={setApi} className="original-carousel" aria-label="Projects" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
          <CarouselContent>{content.projects.map((project, index) => <CarouselItem key={project.title} aria-hidden={active !== index}><article className="original-project"><h3>{project.title}</h3><Button asChild variant="outline" className="portfolio-button"><a href={project.href} target="_blank" rel="noopener noreferrer" tabIndex={active === index ? 0 : -1}>View project <ArrowUpRight size={16} /></a></Button><p>{project.description}</p></article></CarouselItem>)}</CarouselContent>
          <CarouselPrevious aria-label="Previous project" title="Previous project" /><CarouselNext aria-label="Next project" title="Next project" />
          <div className="carousel-dots">{content.projects.map((project, index) => <Button key={project.title} variant="ghost" size="icon" className="carousel-dot" data-active={active === index} aria-label={`Go to project ${index + 1}`} aria-pressed={active === index} onClick={() => api?.scrollTo(index)}><span /></Button>)}</div>
        </Carousel>
      </section>
      <section id="education" className="original-education">
        <h2 className="section-title">Education</h2>
        <div className="education-grid"><div><h3>Courses</h3><ul>{content.courses.map(course => <li key={course}>{course}</li>)}</ul></div><div><h3>Skills</h3>{content.skills.map(skill => <div key={skill.title} className="skill-group"><h4>{skill.title}</h4><p>{skill.description}</p></div>)}</div></div>
      </section>
      <section id="interests" className="original-interests">
        <div><h2 className="section-title">Interests</h2><p>{content.interests}</p></div>
        <div className="interest-photos"><img src={whistler.url} alt="Whistler" loading="lazy" /><img src={lostlake.url} alt="Lost Lake" loading="lazy" /><img src={tunnelbluffs.url} alt="Tunnel Bluffs" loading="lazy" /></div>
      </section>
      <section id="contact" className="original-contact">
        <div><h2 className="section-title">Contact Me</h2><p>{content.contact}</p><ResumeLink /><div className="contact-meta"><p>GitHub<br /><a href={github} target="_blank" rel="noopener noreferrer">github.com/paavanr19</a></p><p>LinkedIn<br /><a href={linkedin} target="_blank" rel="noopener noreferrer">Paavan Randhawa</a></p></div></div>
        <form action="https://api.web3forms.com/submit" method="POST" className="contact-form">
          {/* Web3Forms public form identifier, preserved from the owner's original HTML. */}
          <input type="hidden" name="access_key" value="1725c347-0370-4255-8441-e8334e976b59" />
          <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} />
          <label><span className="sr-only">Your name</span><Input name="name" placeholder="Your name" required /></label>
          <label><span className="sr-only">Your email</span><Input type="email" name="email" placeholder="Your email" required /></label>
          <label><span className="sr-only">Your message</span><Textarea name="message" rows={5} placeholder="Your message" required /></label>
          <Button type="submit" className="portfolio-button">Submit <ArrowUpRight size={16} /></Button>
        </form>
      </section>
    </main>
    <footer className="portfolio-footer"><nav aria-label="Footer navigation">{sections.map(section => <a key={section} href={`#${section.toLowerCase()}`}>{section}</a>)}</nav><p>© All Rights Reserved | Paavan Randhawa</p></footer>
  </div>;
}
