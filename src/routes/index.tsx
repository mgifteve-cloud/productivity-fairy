import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ListChecks, Search, ArrowRight, Clock, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Techbaby AI Assistance — AI productivity for small business" },
      { name: "description", content: "Write emails, plan your day and research faster with one AI dashboard built for small businesses." },
      { property: "og:title", content: "Techbaby AI Assistance" },
      { property: "og:description", content: "Write emails, plan your day and research faster with one AI dashboard." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Professional emails in six tones — follow-ups, quotes, apologies and more.", save: "~15 min per email" },
  { to: "/planner", icon: ListChecks, title: "AI Task Planner", desc: "Turn a messy to-do list into clear priorities and a time-blocked day.", save: "~30 min per day" },
  { to: "/research", icon: Search, title: "AI Research Assistant", desc: "Summarise articles and topics into insights and recommended actions.", save: "~1 hour per report" },
] as const;

function Dashboard() {
  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-hero p-8 text-primary-foreground shadow-soft sm:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs">
          <Sparkles className="h-3.5 w-3.5" /> Your AI workplace assistant
        </span>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold sm:text-5xl">Less admin. More business.</h1>
        <p className="mt-3 max-w-xl text-primary-foreground/85">
          Techbaby handles the emails, planning and research that eat your day — so you and your team can focus on customers.
        </p>
        <Link to="/email" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5">
          Start with an email <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <h2 className="mb-4 mt-10 text-xl font-semibold text-foreground">Your tools</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {tools.map(({ to, icon: Icon, title, desc, save }) => (
          <Link key={to} to={to} className="group flex flex-col rounded-2xl border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary"><Icon /></span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{desc}</p>
            <div className="mt-5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Saves {save}</span>
              <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3 rounded-2xl border bg-secondary p-6 sm:flex-row sm:items-center">
        <ShieldCheck className="h-8 w-8 shrink-0 text-primary" />
        <div className="flex-1 text-sm text-secondary-foreground">
          <p className="font-semibold">Private and responsible by design</p>
          <p className="text-muted-foreground">Nothing you type is stored, AI keys stay on the server, and every result reminds you to verify before you use it.</p>
        </div>
        <Link to="/docs" className="text-sm font-medium text-primary underline-offset-4 hover:underline">Learn more</Link>
      </div>
    </>
  );
}
