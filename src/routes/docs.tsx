import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation & Responsible AI — Techbaby AI Assistance" },
      { name: "description", content: "How Techbaby AI Assistance works, how prompts are engineered, and how your data is protected." },
      { property: "og:title", content: "Docs & Responsible AI — Techbaby AI" },
      { property: "og:description", content: "How the tools work, prompt design, and data protection." },
    ],
  }),
  component: DocsPage,
});

const sections = [
  { h: "How to use", items: [
    "Choose a tool from the sidebar: Email Generator, Task Planner or Research Assistant.",
    "Fill in the form — fields marked * are required. More detail gives better results.",
    "Press Generate. The answer streams in live; press Stop to cancel.",
    "Edit the result directly in the output box, then press Copy.",
  ]},
  { h: "Prompt engineering", items: [
    "Each tool has a dedicated system prompt defining a role (e.g. business writer, productivity coach, analyst).",
    "Your inputs are slotted into a structured template (purpose, tone, tasks, hours, depth) rather than sent as free text.",
    "Every prompt enforces a fixed output format so results are consistent and easy to scan.",
    "Shared guardrails forbid invented facts, require [placeholders] for missing details and refuse harmful requests.",
  ]},
  { h: "Security & privacy", items: [
    "AI requests are made only from the server; the AI key is never sent to your browser.",
    "Inputs are validated and length-limited on the server before reaching the AI.",
    "Nothing you type is stored by Techbaby — there is no database and no account required.",
    "Do not enter passwords, ID numbers, banking details or confidential client data.",
  ]},
  { h: "Responsible AI", items: [
    "AI can be wrong, outdated or biased. Always review results before sending or acting on them.",
    "The Research Assistant lists 'Things to verify' — check those against trusted sources.",
    "You remain responsible for any email you send or decision you make.",
  ]},
  { h: "Technology", items: [
    "TanStack Start (React) with Tailwind CSS for a responsive interface.",
    "Lovable AI Gateway with a modern reasoning model, streamed through a secure server endpoint.",
    "Clear error messages for rate limits, exhausted credits, invalid input and network failures.",
  ]},
];

function DocsPage() {
  return (
    <>
      <PageHeader icon={BookOpen} title="Documentation & Responsible AI" subtitle="How Techbaby works, and how we keep AI use safe and transparent." />
      <div className="grid gap-5 md:grid-cols-2">
        {sections.map((s) => (
          <section key={s.h} className="rounded-2xl border bg-card p-6 shadow-soft">
            <h2 className="mb-3 text-lg font-semibold text-foreground">{s.h}</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {s.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
