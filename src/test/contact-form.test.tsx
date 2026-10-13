import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/contact-form";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

function submit() {
  fireEvent.change(screen.getByRole("textbox", { name: "Your name" }), { target: { value: "Test visitor" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Your email" }), { target: { value: "visitor@example.com" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Your message" }), { target: { value: "A contact test" } });
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
}

describe("Contact delivery", () => {
  it("confirms only a successful delivery response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) }));
    render(<ContactForm />);
    submit();
    await waitFor(() => expect(screen.getByRole("status")).not.toBeEmptyDOMElement());
    expect(screen.queryByRole("button", { name: "Submit" })).not.toBeInTheDocument();
  });

  it("preserves the message when the service rejects a send", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false }) }));
    render(<ContactForm />);
    submit();
    await screen.findByRole("alert");
    expect(screen.getByRole("textbox", { name: "Your message" })).toHaveValue("A contact test");
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
});