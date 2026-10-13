import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "submitting" || state === "success") return;
    const data = new FormData(event.currentTarget);
    setState("submitting");
    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const result = await response.json();
      setState(response.ok && result.success === true ? "success" : "error");
    } catch {
      setState("error");
    }
  };

  const sent = state === "success";
  return <div className="contact-origami-stage" data-sent={sent}>
    <form action="https://api.web3forms.com/submit" method="POST" className="contact-form" onSubmit={handleSubmit} inert={sent} aria-hidden={sent || undefined}>
      <div className="contact-form-fields">
        <input type="hidden" name="access_key" value="1725c347-0370-4255-8441-e8334e976b59" />
        <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} />
        <label><span className="sr-only">Your name</span><Input name="name" placeholder="Your name" required /></label>
        <label><span className="sr-only">Your email</span><Input type="email" name="email" placeholder="Your email" required /></label>
        <label><span className="sr-only">Your message</span><Textarea name="message" rows={5} placeholder="Your message" required /></label>
        <Button type="submit" className="portfolio-button" disabled={state === "submitting"}>
          {state === "submitting" ? "Sending…" : <><span>Submit</span><ArrowUpRight size={16} /></>}
        </Button>
        {state === "error" && <p className="contact-error" role="alert">Something went wrong — please try again.</p>}
      </div>
      <div className="contact-paper-fold contact-paper-fold-left" aria-hidden="true" />
      <div className="contact-paper-fold contact-paper-fold-right" aria-hidden="true" />
      <div className="contact-paper-crease" aria-hidden="true" />
    </form>
    <div className="contact-success" role="status" aria-live="polite" aria-atomic="true">
      {sent && <p className="contact-confirm-msg">Message sent!<br />I'll get back to you soon.</p>}
    </div>
  </div>;
}