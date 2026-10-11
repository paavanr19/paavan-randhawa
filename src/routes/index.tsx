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

function TwemojiSticker({ code, size = 44, rotate = 0 }: { code: string; size?: number; rotate?: number }) {
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${code}.svg`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{ display: "block", ...(rotate ? { transform: `rotate(${rotate}deg)` } : {}) }}
    />
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
  const [altTheme, setAltTheme] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toggleTheme = () => {
    const next = !altTheme;
    document.documentElement.classList.toggle("alt-theme", next);
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
        <figure className="original-portrait"><img src={portrait.url} alt="Paavan Randhawa" fetchPriority="high" /><DraggableSticker className="portrait-star-wrap"><PixelSticker className="portrait-star" /></DraggableSticker><DraggableSticker className="portrait-heart-wrap"><PixelSticker kind="heart" className="portrait-heart" /></DraggableSticker>{altTheme && <DraggableSticker className="pumpkin-portrait"><TwemojiSticker code="1f383" size={28} rotate={16} /></DraggableSticker>}</figure>
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
      <DraggableSticker defaultXVw={2}  defaultYVh={14}><TwemojiSticker code="1f383" size={46} rotate={-10} /></DraggableSticker>
      <DraggableSticker defaultXVw={87} defaultYVh={52}><TwemojiSticker code="1f383" size={38} rotate={14} /></DraggableSticker>
      <DraggableSticker defaultXVw={26} defaultYVh={10}><TwemojiSticker code="1f47b" size={52} rotate={-6} /></DraggableSticker>
      <DraggableSticker defaultXVw={4}  defaultYVh={68}><TwemojiSticker code="1f47b" size={40} rotate={9} /></DraggableSticker>
      <DraggableSticker defaultXVw={18} defaultYVh={36}><TwemojiSticker code="1f342" size={44} rotate={-22} /></DraggableSticker>
      <DraggableSticker defaultXVw={74} defaultYVh={74}><TwemojiSticker code="1f341" size={38} rotate={20} /></DraggableSticker>
      <DraggableSticker defaultXVw={75} defaultYVh={26}><TwemojiSticker code="1f577" size={50} rotate={-8} /></DraggableSticker>
      <DraggableSticker defaultXVw={0}  defaultYVh={0}><TwemojiSticker code="1f578" size={72} /></DraggableSticker>
      <DraggableSticker defaultXVw={79} defaultYVh={54}><TwemojiSticker code="1f578" size={72} rotate={90} /></DraggableSticker>
    </>}
    {showToast && (
      <div className="halloween-toast" role="status" aria-live="polite">
        <PumpkinToggle /> You've switched to the Special Halloween Edition
      </div>
    )}
  </div>;
}
