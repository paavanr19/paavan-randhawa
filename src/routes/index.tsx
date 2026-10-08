import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PixelSticker } from "@/components/pixel-sticker";
import studio from "@/assets/studio.jpg";
import journal from "@/assets/journal.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Paavan Randhawa — Design & Creative Portfolio" },
    { name: "description", content: "Explore Paavan Randhawa's creative world: thoughtful design, visual stories, and a little personality." },
    { property: "og:title", content: "Paavan Randhawa — Design & Creative Portfolio" },
    { property: "og:description", content: "Thoughtful design, visual stories, and a little personality. A creative portfolio by Paavan Randhawa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const projects = [
  { id: "01", title: "The Sunday Journal", category: "Brand identity", filter: "Branding", image: journal, description: "A sample identity for a slower kind of Sunday. Cerulean stationery, tactile papers, and a simple mark bring a thoughtful editorial world to life." },
  { id: "02", title: "Little things, collected", category: "Art direction", filter: "Branding", image: studio, description: "A sample visual story about everyday objects. Warm light, analog textures, and a carefully considered palette turn a collection of small things into something memorable." },
  { id: "03", title: "A world of her own", category: "Web design", filter: "Digital", image: studio, description: "A sample editorial website concept where expressive typography meets a clear, readable layout. Designed to feel personal, playful, and distinctly human." },
];

function Index() {
  const [filter, setFilter] = useState("All work");
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  return (
    <div className="portfolio-shell" id="top">
      <header className="portfolio-nav">
        <a href="#top" className="wordmark" aria-label="Paavan, home">Paavan.</a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#work">My work</a>
          <a href="#about" className="nav-about">A little about me</a>
          <Button asChild variant="outline" className="nav-cta"><a href="#contact">Let’s talk <ArrowUpRight size={13} /></a></Button>
        </nav>
      </header>
      <main>
        <section className="portfolio-hero" aria-label="Paavan Randhawa creative portfolio">
          <div className="hero-eyebrow"><span>A little curiosity. A lot of creativity.</span><span>Design · Visual storytelling</span></div>
          <h1 className="hero-title"><span>CREATIVE</span><span>PORTFOLIO</span></h1>
          <div className="hero-signature">Paavan Randhawa</div>
          <PixelSticker className="hero-star" />
          <div className="hero-bottom">
            <p>Thoughtful design, visual stories,<br />and a little bit of personality.</p>
            <a href="#work" className="scroll-link">Take a look around <ArrowDown size={17} /></a>
          </div>
        </section>
        <section className="about-section" id="about">
          <div>
            <div className="section-eyebrow">The person behind the pixels</div>
            <h2 className="about-heading">HI, I’M<br /><em>Paavan!</em></h2>
            <p className="about-copy">A curious mind with a soft spot for beautiful details. I’m drawn to design that feels like something — a story, a feeling, a little moment worth remembering.</p>
            <p className="about-copy mt-4">This is my little corner of the internet. A collection of ideas, explorations, and things made with care.</p>
            <div className="about-tags"><span>✳ Thoughtful by nature</span><span>↗ Creative at heart</span></div>
          </div>
          <figure className="about-photo">
            <img src={studio} width={1536} height={1024} alt="Burgundy art book, blue paper, vintage camera, and a flower on a sunlit creative desk" />
            <span className="hey-sticker" aria-hidden="true">hey there!</span>
            <figcaption className="photo-caption">A few of my favorite things ↗</figcaption>
          </figure>
        </section>
        <section className="work-section" id="work">
          <div className="section-eyebrow">A collection of creative explorations</div>
          <div className="work-header">
            <h2 className="section-heading">SELECTED <em>work</em></h2>
            <div className="work-filters" aria-label="Filter projects">
              {["All work", "Branding", "Digital"].map(item => <Button key={item} variant="ghost" className="filter-button" data-active={filter === item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</Button>)}
            </div>
          </div>
          <div className="work-grid">
            {projects.filter(project => filter === "All work" || project.filter === filter).map(project => <article key={project.id}>
              <Button variant="ghost" className="project-button" onClick={() => setSelected(project)} aria-label={`View ${project.title}`}>
                <div className="w-full">
                  {project.id === "03" ? <div className="website-art"><div className="mini-browser"><div className="browser-bar"><i /><i /><i /></div><div className="mini-hero">A WORLD<br />OF <em>her own.</em></div><img src={studio} alt="Editorial website concept" width={1536} height={1024} loading="lazy" /><div className="mini-caption">CURIOUS MIND. CREATIVE SOUL.</div></div></div> : <div className="project-image-wrap"><img className="project-image" src={project.image} alt={project.id === "01" ? "Blue journal with a burgundy sleeve and butter yellow paper" : "Editorial still life with a camera and art book"} width={project.id === "01" ? 1024 : 1536} height={1024} loading="lazy" /></div>}
                  <div className="project-meta"><div className="min-w-0"><h3 className="project-title">{project.title}</h3><p className="project-category">{project.id} / {project.category}</p></div><span className="project-arrow"><ArrowUpRight size={15} /></span></div>
                </div>
              </Button>
            </article>)}
          </div>
          <p className="work-footnote">Sample projects · A preview of the creative direction</p>
        </section>
        <section className="contact-section" id="contact">
          <div className="section-eyebrow">Good things start with a conversation</div>
          <h2 className="contact-heading">LET’S MAKE<br /><em>something lovely.</em></h2>
          <p className="contact-note">An idea, a collaboration, or just a hello — I’d love to hear it.</p>
          <Button className="contact-action" onClick={() => setContactOpen(true)}>Let’s connect <ArrowUpRight /></Button>
          <PixelSticker kind="heart" className="contact-heart" />
        </section>
      </main>
      <footer className="portfolio-footer"><span className="footer-name">Paavan Randhawa</span><a href="#top" className="flex items-center gap-3">Made with care · 2026 <ArrowUp size={13} /></a></footer>
      <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
        <DialogContent className="project-dialog">
          <DialogTitle className="dialog-title">{selected?.title}</DialogTitle>
          <DialogDescription className="dialog-copy">{selected?.category} · Sample concept</DialogDescription>
          {selected && <img className="dialog-project-image" src={selected.image} alt={selected.title} width={1024} height={1024} />}
          <p className="dialog-copy">{selected?.description}</p>
        </DialogContent>
      </Dialog>
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="project-dialog">
          <DialogTitle className="dialog-title">Let’s connect.</DialogTitle>
          <DialogDescription className="dialog-copy">Contact details are pending for this preview.</DialogDescription>
          <Button asChild><a href="https://ca.pinterest.com/paavan_randhawa/portfolio/" target="_blank" rel="noreferrer">My inspiration board <ArrowUpRight /></a></Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
