import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function LostSnoopy() {
  return (
    <svg viewBox="0 0 180 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="lost-snoopy-svg">
      {/* Left ear — behind head */}
      <path d="M55,62 C35,70 26,118 32,142 C37,160 58,153 60,126 C63,100 60,74 55,62Z" fill="#1a1a1a" />
      {/* Right ear — behind head */}
      <path d="M125,62 C145,70 154,118 148,142 C143,160 122,153 120,126 C117,100 120,74 125,62Z" fill="#1a1a1a" />
      {/* Head */}
      <circle cx="90" cy="88" r="52" fill="white" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Snout */}
      <ellipse cx="108" cy="104" rx="26" ry="20" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      {/* Nose */}
      <ellipse cx="120" cy="96" rx="11" ry="8" fill="#1a1a1a" />
      {/* Eyes — looking sideways, lost */}
      <circle cx="72" cy="80" r="5" fill="#1a1a1a" />
      <circle cx="92" cy="77" r="5" fill="#1a1a1a" />
      {/* Pupils shifted to one side — looking around */}
      <circle cx="74" cy="80" r="2.5" fill="white" />
      <circle cx="94" cy="77" r="2.5" fill="white" />
      {/* Worried brows */}
      <path d="M67,70 Q75,65 82,67" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M88,67 Q96,62 103,64" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Sad/worried mouth */}
      <path d="M86,118 Q96,113 106,118" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="90" cy="178" rx="42" ry="44" fill="white" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Collar */}
      <path d="M55,148 Q90,158 125,148" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      {/* Question mark — floating above */}
      <text x="138" y="44" fontSize="30" fill="#1a1a1a" fontFamily="serif" fontWeight="bold" opacity="0.7">?</text>
    </svg>
  );
}

function NotFoundComponent() {
  return (
    <div className="not-found-page">
      <header className="portfolio-nav">
        <a href="/" className="wordmark">Paavan Randhawa</a>
      </header>
      <div className="not-found-content">
        <p className="not-found-missing">MISSING</p>
        <div className="not-found-polaroid">
          <div className="not-found-photo">
            <LostSnoopy />
          </div>
          <p className="not-found-caption">last seen on this page</p>
        </div>
        <p className="not-found-case">Case No. <strong>404</strong></p>
        <p className="not-found-desc">This page wandered off and hasn't come home.<br />If you find it, let us know.</p>
        <Link to="/" className="not-found-home">← Back Home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Paavan Randhawa — Creative Portfolio" },
      { name: "description", content: "Paavan Randhawa's creative portfolio of design and visual storytelling." },
      { name: "author", content: "Paavan Randhawa" },
      { property: "og:title", content: "Paavan Randhawa — Creative Portfolio" },
      { property: "og:description", content: "A considered collection of design and visual storytelling." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=DM+Sans:wght@400;500;600&family=Pinyon+Script&family=Reenie+Beanie&display=swap" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      
<body>
        {children}
<Analytics/>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
