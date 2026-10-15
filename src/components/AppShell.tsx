import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, Mail, ListChecks, Search, BookOpen, Menu, X, ShieldCheck } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/docs", label: "Docs & Responsible AI", icon: BookOpen },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-primary data-[status=active]:font-medium data-[status=active]:text-sidebar-primary-foreground"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
  const brand = (
    <Link to="/" className="flex items-center gap-2.5 px-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary font-display text-lg font-bold text-sidebar-primary-foreground">T</span>
      <span className="font-display text-lg font-semibold leading-tight text-sidebar-accent-foreground">
        Techbaby<span className="block text-xs font-normal text-sidebar-foreground/60">AI Assistance</span>
      </span>
    </Link>
  );
  const footer = (
    <div className="mt-auto rounded-xl border border-sidebar-border p-3 text-xs text-sidebar-foreground/70">
      <ShieldCheck className="mb-1 h-4 w-4 text-sidebar-primary" />
      AI can make mistakes. Always review and verify results before using them.
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col gap-8 bg-sidebar p-5 lg:flex">
        {brand}
        {nav}
        {footer}
      </aside>
      <header className="sticky top-0 z-30 flex items-center justify-between bg-sidebar px-4 py-3 lg:hidden">
        {brand}
        <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="text-sidebar-accent-foreground">
          {open ? <X /> : <Menu />}
        </button>
      </header>
      {open && <div className="fixed inset-x-0 top-[60px] z-20 flex flex-col gap-4 bg-sidebar p-4 lg:hidden">{nav}{footer}</div>}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: typeof Mail }) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground"><Icon /></span>
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
