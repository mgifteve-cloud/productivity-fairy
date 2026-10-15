import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Copy, Loader2, RotateCcw, Sparkles, Square, TriangleAlert, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { GenerateInput } from "@/lib/prompts";

export function ToolWorkspace({
  form,
  getInput,
  canSubmit,
  outputLabel,
}: {
  form: ReactNode;
  getInput: () => GenerateInput;
  canSubmit: boolean;
  outputLabel: string;
}) {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setError(null);
    setOutput("");
    setLoading(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getInput()),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        setOutput(text);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError((err as Error).message);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-soft">
        {form}
        <div className="flex gap-2 pt-2">
          {loading ? (
            <Button type="button" variant="outline" onClick={() => abortRef.current?.abort()}>
              <Square className="h-4 w-4" /> Stop
            </Button>
          ) : null}
          <Button type="submit" disabled={!canSubmit || loading} className="flex-1">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating…" : "Generate"}
          </Button>
        </div>
      </form>

      <div className="flex flex-col rounded-2xl border bg-card p-6 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            {outputLabel} {output && <Pencil className="h-3.5 w-3.5 text-muted-foreground" aria-label="editable" />}
          </h2>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setOutput("")} disabled={!output || loading}>
              <RotateCcw className="h-4 w-4" /> Clear
            </Button>
            <Button size="sm" variant="secondary" onClick={copy} disabled={!output}>
              <Copy className="h-4 w-4" /> Copy
            </Button>
          </div>
        </div>
        {error && (
          <div role="alert" className="mb-3 flex gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <TriangleAlert className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
        <Textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="Your AI-generated result will appear here. You can edit it freely before copying."
          className="min-h-[380px] flex-1 resize-y bg-background font-sans text-sm leading-relaxed"
          readOnly={loading}
        />
        <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          AI-generated content may contain errors. Review, edit and verify facts before you send or rely on it.
        </p>
      </div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
