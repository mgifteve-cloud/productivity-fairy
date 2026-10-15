import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Field, ToolWorkspace } from "@/components/ToolWorkspace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RESEARCH_DEPTHS } from "@/lib/prompts";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Techbaby AI Assistance" },
      { name: "description", content: "Summarise articles and topics into key insights and recommended actions." },
      { property: "og:title", content: "AI Research Assistant — Techbaby AI" },
      { property: "og:description", content: "Summarise articles and topics into key insights and recommended actions." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [source, setSource] = useState("");
  const [depth, setDepth] = useState<string>(RESEARCH_DEPTHS[0]);
  return (
    <>
      <PageHeader icon={Search} title="AI Research Assistant" subtitle="Paste an article or ask a question — get a summary, insights and next steps." />
      <ToolWorkspace
        outputLabel="Research brief"
        canSubmit={topic.trim().length >= 3}
        getInput={() => ({ tool: "research", topic, source, depth })}
        form={
          <>
            <Field label="Topic or question *">
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={500} placeholder="e.g. How can a small bakery reduce food waste?" />
            </Field>
            <Field label="Depth">
              <div className="flex flex-wrap gap-2">
                {RESEARCH_DEPTHS.map((d) => (
                  <button type="button" key={d} onClick={() => setDepth(d)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${depth === d ? "border-primary bg-primary text-primary-foreground" : "bg-background text-foreground hover:bg-muted"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Source text (optional)" hint={`Paste an article, report or notes to analyse. ${source.length}/12000 characters.`}>
              <Textarea value={source} onChange={(e) => setSource(e.target.value)} maxLength={12000} rows={10} placeholder="Paste text here…" />
            </Field>
          </>
        }
      />
    </>
  );
}
