import { useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Project = { title: string; image: string; imageAlt: string; href: string; tech?: string[]; description: string };

function ViewProject({ href }: { href: string }) {
  return <Button asChild variant="outline" className="portfolio-button"><a href={href} target="_blank" rel="noopener noreferrer">View project <ArrowUpRight size={16} /></a></Button>;
}

export function ProjectCard({ project }: { project: Project }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return <article className="original-project">
    <button type="button" className="project-card-trigger" aria-label={`Enlarge project: ${project.title}`} onClick={() => dialogRef.current?.showModal()} />
    <img className="project-image" src={project.image} alt={project.imageAlt} loading="lazy" />
    <div className="project-body"><h3>{project.title}</h3><ViewProject href={project.href} /><p>{project.description}</p></div>
    <dialog ref={dialogRef} className="project-modal" aria-label={project.title} onClick={e => { if (e.target === e.currentTarget) dialogRef.current?.close(); }}>
      <button type="button" className="project-modal-close" aria-label="Close" onClick={() => dialogRef.current?.close()}><X size={20} /></button>
      <img className="project-modal-image" src={project.image} alt={project.imageAlt} />
      <div className="project-modal-body">
        <h3>{project.title}</h3>
        {project.tech && <ul className="project-modal-tech" aria-label="Technologies">{project.tech.map(t => <li key={t}>{t}</li>)}</ul>}
        <p>{project.description}</p>
        <ViewProject href={project.href} />
      </div>
    </dialog>
  </article>;
}
