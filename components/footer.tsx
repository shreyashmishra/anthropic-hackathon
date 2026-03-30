import Link from "next/link";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/submit", label: "Submit" },
  { href: "/sources", label: "Sources" },
  { href: "/topics", label: "Topics" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">OpenFloor</p>
            <h2 className="mt-4 font-serif text-3xl text-balance sm:text-4xl">
              Context-first civic video for people who want to participate, not just react.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              A hackathon concept for the Governance & Collaboration track focused on helping
              people understand public-interest video, discuss it constructively, and follow the
              original source material.
            </p>
          </div>

          <nav className="flex flex-wrap gap-5 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/70 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 OpenFloor. Built for transparent civic understanding.</p>
          <p>Public browsing first. Demo-mode participation. Gemini for debate understanding.</p>
        </div>
      </div>
    </footer>
  );
}
