import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { CinematicIntro } from "@/components/cinematic-intro";
import { EducationSection } from "@/components/education-section";
import { InterestsArc } from "@/components/interests-arc";
import { ArrowUpRight, Download, Github, Linkedin, Menu, Play, X } from "lucide-react";

function PumpkinToggle() {
  return (
    <svg width="20" height="22" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 8 C20 4 23 1 26 4" stroke="#4a7520" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="7" cy="28" rx="7" ry="10" fill="#CC5500"/>
      <ellipse cx="33" cy="28" rx="7" ry="10" fill="#CC5500"/>
      <ellipse cx="20" cy="28" rx="14" ry="14" fill="#E86400"/>
      <polygon points="12,25 15,21 18,25" fill="#1a0500"/>
      <polygon points="22,25 25,21 28,25" fill="#1a0500"/>
      <path d="M11 33 L14 36 L17 33 L20 36 L23 33 L26 36 L29 33" stroke="#1a0500" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PumpkinDecoration({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.1)} viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22 7 C22 3 25 1 28 4" stroke="#4a7520" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M24 6 C29 2 35 5 31 10 C29 9 27 7 24 6Z" fill="#5a8a28"/>
      <ellipse cx="8" cy="30" rx="8" ry="11" fill="#CC5500"/>
      <ellipse cx="36" cy="30" rx="8" ry="11" fill="#CC5500"/>
      <ellipse cx="22" cy="30" rx="15" ry="15" fill="#E86400"/>
      <path d="M22 15 C28 22 28 38 22 45" stroke="#CC5500" strokeWidth="2" fill="none"/>
      <path d="M22 15 C16 22 16 38 22 45" stroke="#CC5500" strokeWidth="2" fill="none"/>
      <polygon points="13,27 16,23 19,27" fill="#280800"/>
      <polygon points="25,27 28,23 31,27" fill="#280800"/>
      <polygon points="21,32 22,30 23,32" fill="#280800"/>
      <path d="M11 36 L14 39 L17 36 L22 39 L27 36 L30 39 L33 36" stroke="#280800" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { PixelSticker } from "@/components/pixel-sticker";
import { DraggableSticker } from "@/components/draggable-sticker";
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
  const [altTheme, setAltTheme] = useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("alt-theme"));
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toggleTheme = () => {
    const next = !altTheme;
    document.documentElement.classList.toggle("alt-theme", next);
    try { localStorage.setItem("portfolio-theme", next ? "alt" : "default"); } catch (_) {}
    setAltTheme(next);
    if (next) {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setShowToast(true);
      toastTimer.current = setTimeout(() => setShowToast(false), 3500);
    }
  };
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
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: new FormData(e.currentTarget) });
      setFormState(res.ok ? "success" : "error");
    } catch {
      setFormState("error");
    }
  };
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
    <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
    {intro === "pending" && <div className="intro" aria-hidden="true" />}
    {intro === "playing" && <CinematicIntro onDone={finishIntro} />}
    <header className="portfolio-nav">
      <a href="#about" className="wordmark">Paavan Randhawa</a>
      <Button variant="ghost" size="icon" className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      <nav id="main-navigation" className="nav-links" data-open={menuOpen} aria-label="Main navigation">{sections.map(section => <a key={section} href={`#${section.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{section}</a>)}</nav>
      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle Halloween theme" title="Toggle Halloween theme"><PumpkinToggle /></Button>
      <Button asChild className="nav-cta"><a href={github} target="_blank" rel="noopener noreferrer">Visit GitHub <ArrowUpRight size={15} /></a></Button>
    </header>
    <main>
      <section id="about" className="original-about">
        <div className="original-about-copy">
          <p className="hello" aria-label={greeting}><span aria-hidden="true">{greeting.slice(0, typedCharacters)}<span className="typewriter-pending">{greeting.slice(typedCharacters)}</span></span></p>
          <h1 aria-label={name} data-typing={typedCharacters > greeting.length && typedCharacters < greetingLength}><span aria-hidden="true">{name.slice(0, Math.max(0, typedCharacters - greeting.length))}<span className="typewriter-pending">{name.slice(Math.max(0, typedCharacters - greeting.length))}</span></span></h1>
          <p className="lead">Student at Simon Fraser University</p>
          <span className="status-badge"><span className="status-dot" aria-hidden="true" />Currently seeking Summer 2027 Co-op</span>
          <p className="bio">{content.bio}</p>
          <div className="btn-group"><ResumeLink /><Button asChild className="portfolio-button"><a href="#contact">Contact <ArrowUpRight size={16} /></a></Button></div>
          <div className="socials"><Button asChild variant="ghost" size="icon"><a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><Github /></a></Button><Button asChild variant="ghost" size="icon"><a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin /></a></Button></div>
        </div>
        <figure className="original-portrait"><img src={portrait.url} alt="Paavan Randhawa" fetchPriority="high" /><DraggableSticker className="portrait-star-wrap"><PixelSticker className="portrait-star" /></DraggableSticker><DraggableSticker className="portrait-heart-wrap"><PixelSticker kind="heart" className="portrait-heart" /></DraggableSticker>{altTheme && <DraggableSticker className="pumpkin-portrait"><PumpkinDecoration size={44} /></DraggableSticker>}</figure>
      </section>
      <section id="projects" className="original-projects">
        <div className="section-heading"><h2 className="section-title">Projects</h2><DraggableSticker><PixelSticker className="projects-star" /></DraggableSticker></div>
        <Carousel opts={{ loop: true }} setApi={setApi} className="original-carousel" aria-label="Projects" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
          <CarouselContent>{content.projects.map((project, index) => <CarouselItem key={project.title} aria-hidden={active !== index}><article className="original-project"><h3>{project.title}</h3><div className="tech-chips">{project.tech.map(t => <span key={t} className="tech-chip">{t}</span>)}</div><Button asChild variant="outline" className="portfolio-button"><a href={project.href} target="_blank" rel="noopener noreferrer" tabIndex={active === index ? 0 : -1}>View project <ArrowUpRight size={16} /></a></Button><p>{project.description}</p></article></CarouselItem>)}</CarouselContent>
          <CarouselPrevious className="project-arrow" aria-label="Previous project" title="Previous project" /><CarouselNext className="project-arrow" aria-label="Next project" title="Next project" />
          <div className="carousel-dots">{content.projects.map((project, index) => <Button key={project.title} variant="ghost" size="icon" className="carousel-dot" data-active={active === index} aria-label={`Go to project ${index + 1}`} aria-pressed={active === index} onClick={() => api?.scrollTo(index)}><span /></Button>)}</div>
        </Carousel>
      </section>
      <EducationSection />
      <section id="interests" className="original-interests">
        <div><div className="section-heading"><h2 className="section-title">Interests</h2><DraggableSticker><PixelSticker kind="heart" className="interests-heart" /></DraggableSticker></div><p>{content.interests}</p></div>
        <InterestsArc />
      </section>
      <section id="contact" className="original-contact">
        <div className="contact-header">
          <div className="section-heading"><h2 className="section-title">Contact Me</h2><DraggableSticker><PixelSticker kind="envelope" className="contact-envelope" /></DraggableSticker></div>
          <p>{content.contact}</p>
        </div>
        {formState === "success" ? (
          <div className="contact-success" aria-live="polite">
            <div className="contact-airplane" aria-hidden="true">
              <svg className="airplane-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <polygon points="2,62 62,2 62,62 34,46" />
                <polygon points="34,46 62,62 62,2" opacity="0.45" />
              </svg>
            </div>
            <p className="contact-confirm-msg">Message sent!<br />I'll get back to you soon.</p>
          </div>
        ) : (
          <form action="https://api.web3forms.com/submit" method="POST" className="contact-form" onSubmit={handleSubmit}>
            <input type="hidden" name="access_key" value="1725c347-0370-4255-8441-e8334e976b59" />
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} />
            <label><span className="sr-only">Your name</span><Input name="name" placeholder="Your name" required /></label>
            <label><span className="sr-only">Your email</span><Input type="email" name="email" placeholder="Your email" required /></label>
            <label><span className="sr-only">Your message</span><Textarea name="message" rows={5} placeholder="Your message" required /></label>
            <Button type="submit" className="portfolio-button" disabled={formState === "submitting"}>
              {formState === "submitting" ? "Sending…" : <><span>Submit</span> <ArrowUpRight size={16} /></>}
            </Button>
            {formState === "error" && <p className="contact-error">Something went wrong — please try again.</p>}
          </form>
        )}
      </section>
    </main>
    <footer className="portfolio-footer"><nav aria-label="Footer navigation">{sections.map(section => <a key={section} href={`#${section.toLowerCase()}`}>{section}</a>)}</nav><Button variant="ghost" className="replay-intro" onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); setIntro("playing"); }}><Play size={11} /> Replay Intro</Button><p>© All Rights Reserved | Paavan Randhawa</p></footer>
    {altTheme && <>
      <DraggableSticker className="pumpkin-sticker-1"><PumpkinDecoration size={38} /></DraggableSticker>
      <DraggableSticker className="pumpkin-sticker-2"><PumpkinDecoration size={32} /></DraggableSticker>
    </>}
    {showToast && (
      <div className="halloween-toast" role="status" aria-live="polite">
        <PumpkinToggle /> You've switched to the Special Halloween Edition
      </div>
    )}
  </div>;
}
