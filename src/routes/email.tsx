import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Field, ToolWorkspace } from "@/components/ToolWorkspace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EMAIL_TONES } from "@/lib/prompts";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Techbaby AI Assistance" },
      { name: "description", content: "Write professional business emails in any tone in seconds." },
      { property: "og:title", content: "Smart Email Generator — Techbaby AI" },
      { property: "og:description", content: "Write professional business emails in any tone in seconds." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<string>("Professional");
  const [details, setDetails] = useState("");
  const [sender, setSender] = useState("");
  return (
    <>
      <PageHeader icon={Mail} title="Smart Email Generator" subtitle="Describe what you need — get a polished, ready-to-edit email." />
      <ToolWorkspace
        outputLabel="Your email"
        canSubmit={purpose.trim().length >= 3}
        getInput={() => ({ tool: "email", purpose, recipient, tone, details, sender })}
        form={
          <>
            <Field label="Purpose of the email *">
              <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} maxLength={500} placeholder="e.g. Follow up on an unpaid invoice" />
            </Field>
            <Field label="Recipient">
              <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} maxLength={120} placeholder="e.g. Mr Dlamini, accounts at ABC Ltd" />
            </Field>
            <Field label="Tone">
              <div className="flex flex-wrap gap-2">
                {EMAIL_TONES.map((t) => (
                  <button type="button" key={t} onClick={() => setTone(t)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${tone === t ? "border-primary bg-primary text-primary-foreground" : "bg-background text-foreground hover:bg-muted"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Key details" hint="Facts the email must mention. Avoid sharing passwords or banking details.">
              <Textarea value={details} onChange={(e) => setDetails(e.target.value)} maxLength={3000} rows={5} placeholder="Invoice #1043, R4 500, due 30 Sept, offer payment plan" />
            </Field>
            <Field label="Your name / sign-off">
              <Input value={sender} onChange={(e) => setSender(e.target.value)} maxLength={120} placeholder="e.g. Gift, Techbaby Studio" />
            </Field>
          </>
        }
      />
    </>
  );
}
