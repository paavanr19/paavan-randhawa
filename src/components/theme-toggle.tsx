import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.setAttribute("data-theme", "dark"); else document.documentElement.removeAttribute("data-theme");
    try { localStorage.setItem("mode", next ? "dark" : "light"); } catch { /* storage unavailable */ }
  };
  return <Button variant="ghost" size="icon" className="theme-toggle" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={toggle}>{dark ? <Sun /> : <Moon />}</Button>;
}
