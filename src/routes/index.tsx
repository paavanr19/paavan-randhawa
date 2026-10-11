import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { CinematicIntro } from "@/components/cinematic-intro";
import { EducationSection } from "@/components/education-section";
import { InterestsArc } from "@/components/interests-arc";
import { ArrowUpRight, Download, Github, Linkedin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { PixelSticker } from "@/components/pixel-sticker";
import content from "@/lib/portfolio-content.json";
const portrait = { url: "/images/pfp.png" };
const resume = { url: "/images/PaavanRandhawa-Resume.pdf" };

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
  const [typedCharacters, setTypedCharacters] = useState(0);
  const [intro, setIntro] = useState<"pending" | "playing" | "done">("pending");
  const greeting = "Hi I'm";
  const name = "Paavan Randhawa!";
  const greetingLength = greeting.length + name.length;
  const finishIntro = useCallback(() => {
    setIntro("done");
  }, []);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIntro(reduce ? "done" : "playing");
  }, []);
  useEffect(() => {
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = intro === "done" ? "" : "hidden";
    return () => { document.documentElement.style.overflow = previousOverflow; };
  }, [intro]);
  useEffect(() => {
    if (intro !== "done") { setTypedCharacters(0); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedCharacters(greetingLength);
      return;
    }
    const timer = window.setInterval(() => {
      setTypedCharacters(count => {
        if (count + 1 >= greetingLength) window.clearInterval(timer);
        return Math.min(count + 1, greetingLength);
      });
    }, 85);
    return () => window.clearInterval(timer);
  }, [greetingLength, intro]);
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
    {intro === "pending" && <div className="intro" aria-hidden="true" />}
    {intro === "playing" && <CinematicIntro onDone={finishIntro} />}
    <header className="portfolio-nav">
      <a href="#about" className="wordmark">Paavan Randhawa</a>
      <Button variant="ghost" size="icon" className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      <nav id="main-navigation" className="nav-links" data-open={menuOpen} aria-label="Main navigation">{sections.map(section => <a key={section} href={`#${section.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{section}</a>)}</nav>
      <Button asChild className="nav-cta"><a href={github} target="_blank" rel="noopener noreferrer">Visit GitHub <ArrowUpRight size={15} /></a></Button>
    </header>
    <main>
      <section id="about" className="original-about">
        <div className="original-about-copy">
          <p className="hello" aria-label={greeting}><span aria-hidden="true">{greeting.slice(0, typedCharacters)}<span className="typewriter-pending">{greeting.slice(typedCharacters)}</span></span></p>
          <h1 aria-label={name} data-typing={typedCharacters > greeting.length && typedCharacters < greetingLength}><span aria-hidden="true">{name.slice(0, Math.max(0, typedCharacters - greeting.length))}<span className="typewriter-pending">{name.slice(Math.max(0, typedCharacters - greeting.length))}</span></span></h1>
          <p className="lead">Student at Simon Fraser University</p>
          <p className="bio">{content.bio}</p>
          <div className="btn-group"><ResumeLink /><Button asChild className="portfolio-button"><a href="#contact">Contact <ArrowUpRight size={16} /></a></Button></div>
          <div className="socials"><Button asChild variant="ghost" size="icon"><a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><Github /></a></Button><Button asChild variant="ghost" size="icon"><a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin /></a></Button></div>
        </div>
        <figure className="original-portrait"><img src={portrait.url} alt="Paavan Randhawa" fetchPriority="high" /><PixelSticker className="portrait-star" /><PixelSticker kind="heart" className="portrait-heart" /></figure>
      </section>
      <section id="projects" className="original-projects">
        <div className="section-heading"><h2 className="section-title">Projects</h2><PixelSticker className="projects-star" /></div>
        <Carousel opts={{ loop: true }} setApi={setApi} className="original-carousel" aria-label="Projects" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
          <CarouselContent>{content.projects.map((project, index) => <CarouselItem key={project.title} aria-hidden={active !== index}><article className="original-project"><h3>{project.title}</h3><Button asChild variant="outline" className="portfolio-button"><a href={project.href} target="_blank" rel="noopener noreferrer" tabIndex={active === index ? 0 : -1}>View project <ArrowUpRight size={16} /></a></Button><p>{project.description}</p></article></CarouselItem>)}</CarouselContent>
          <CarouselPrevious className="project-arrow" aria-label="Previous project" title="Previous project" /><CarouselNext className="project-arrow" aria-label="Next project" title="Next project" />
          <div className="carousel-dots">{content.projects.map((project, index) => <Button key={project.title} variant="ghost" size="icon" className="carousel-dot" data-active={active === index} aria-label={`Go to project ${index + 1}`} aria-pressed={active === index} onClick={() => api?.scrollTo(index)}><span /></Button>)}</div>
        </Carousel>
      </section>
      <EducationSection />
      <section id="interests" className="original-interests">
        <div><div className="section-heading"><h2 className="section-title">Interests</h2><PixelSticker kind="heart" className="interests-heart" /></div><p>{content.interests}</p></div>
        <InterestsArc />
      </section>
      <section id="contact" className="original-contact">
        <div><div className="section-heading"><h2 className="section-title">Contact Me</h2><PixelSticker kind="envelope" className="contact-envelope" /></div><p>{content.contact}</p></div>
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
    <footer className="portfolio-footer"><nav aria-label="Footer navigation">{sections.map(section => <a key={section} href={`#${section.toLowerCase()}`}>{section}</a>)}</nav><Button variant="ghost" className="replay-intro" onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); setIntro("playing"); }}>▶ Replay Intro</Button><p>© All Rights Reserved | Paavan Randhawa</p></footer>
  </div>;
}
