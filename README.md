# Paavan Randhawa — Portfolio

My personal portfolio website. It introduces me, showcases my projects, lists my coursework and skills, shares a bit about my interests, and lets visitors download my resume or send me a message.

**Live site:** [paavan-randhawa.vercel.app](https://paavan-randhawa.vercel.app)

---

## Features

- **Typewriter greeting** that types out my name on load, and is skipped for visitors who prefer reduced motion
- **Project carousel** that loops and auto-advances, pauses on hover or focus, and has arrow and dot navigation
- **Resume download** button
- **Education section** with my relevant SFU courses and grouped technical skills
- **Interests section** with photos (lazy-loaded)
- **Contact form** sent through [Web3Forms](https://web3forms.com/), with a hidden spam-trap field, so no backend is needed
- **Pixel-art stickers** as decorative accents throughout the page
- **Responsive layout** with a collapsible menu on small screens
- Links to my **GitHub** and **LinkedIn**

---

## Built With

| Technology | Used for |
|---|---|
| [React 19](https://react.dev/) + TypeScript | Page components and logic |
| [TanStack Start](https://tanstack.com/start) / [TanStack Router](https://tanstack.com/router) | App framework and routing |
| [Vite](https://vite.dev/) | Development server and builds |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling and responsive layout |
| [shadcn/ui](https://ui.shadcn.com/) (Radix UI) | Buttons, inputs, and carousel components |
| [Embla Carousel](https://www.embla-carousel.com/) | Project carousel |
| [Lucide](https://lucide.dev/) | Icons |
| [Web3Forms](https://web3forms.com/) | Contact form submissions |
| [Vercel](https://vercel.com/) | Hosting |

The project was set up and is edited with [Lovable](https://lovable.dev/).

---

## Sections

| Section | Contents |
|---|---|
| **About** | Greeting, photo, resume download, contact button, and social links |
| **Projects** | Rubik's Cube Solver, Pocoloco, Mythos Seafarer, and Unix Shell |
| **Education** | Relevant SFU courses and technical skills |
| **Interests** | Sports, running, cycling, hiking, and reading, with photos |
| **Contact** | Message form |

---

## Project Structure

```
paavan-randhawa/
├── public/                 # Static files
├── src/
│   ├── routes/             # Pages (index.tsx is the portfolio)
│   ├── components/         # UI components and pixel stickers
│   ├── lib/                # Portfolio text content
│   ├── assets/             # Photos and resume
│   └── styles.css          # Global styles and typography
├── package.json
├── vite.config.ts
└── tsconfig.json
```

Most of the site's text lives in `src/lib/portfolio-content.json`, so wording can be updated without touching the page code.

---

## Running Locally

**Requirements:** Node.js 20 or later (or [Bun](https://bun.sh/))

```bash
git clone https://github.com/paavanr19/paavan-randhawa.git
cd paavan-randhawa
npm install
npm run dev
```

Then open the local URL shown in the terminal.

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Check the code with ESLint |
| `npm run test` | Run the tests with Vitest |
