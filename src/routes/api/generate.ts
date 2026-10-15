import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SYSTEM_PROMPTS, buildUserPrompt, type GenerateInput } from "@/lib/prompts";

const s = (max: number) => z.string().trim().max(max);
const schema = z.discriminatedUnion("tool", [
  z.object({ tool: z.literal("email"), purpose: s(500).min(3), recipient: s(120), tone: s(40), details: s(3000), sender: s(120) }),
  z.object({ tool: z.literal("planner"), tasks: s(4000).min(3), hours: s(60), goals: s(500) }),
  z.object({ tool: z.literal("research"), topic: s(500).min(3), source: s(12000), depth: s(40) }),
]);

const json = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), { status, headers: { "Content-Type": "application/json" } });

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return json(500, "AI is not configured on the server.");

        let input: GenerateInput;
        try {
          const parsed = schema.safeParse(await request.json());
          if (!parsed.success) return json(400, "Please fill in the required fields (inputs may be too short or too long).");
          input = parsed.data as GenerateInput;
        } catch {
          return json(400, "Invalid request.");
        }

        // Pre-flight a streaming request directly so gateway errors surface with their status.
        const { createOpenAI } = await import("@ai-sdk/openai");
        const { streamText } = await import("ai");
        let upstreamError: { status: number; message: string } | null = null;
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: async (url, init) => {
            const res = await fetch(url, init);
            if (!res.ok) {
              let message = "The AI service returned an error.";
              try {
                const body = await res.clone().json();
                message = body?.error?.message || body?.message || message;
              } catch {}
              if (res.status === 429) message = "Too many requests right now — please wait a moment and try again.";
              if (res.status === 402) message = "AI credits are exhausted for this workspace. Please add credits and try again.";
              upstreamError = { status: res.status, message };
            }
            return res;
          },
        });

        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: SYSTEM_PROMPTS[input.tool],
          prompt: buildUserPrompt(input),
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              store: false,
              forceReasoning: true,
              reasoningEffort: "low",
              include: ["reasoning.encrypted_content"],
            },
          },
        });

        // Wait for first text chunk (or failure) before committing to a 200 stream.
        const reader = result.textStream[Symbol.asyncIterator]();
        let first: IteratorResult<string>;
        try {
          first = await reader.next();
        } catch (e) {
          const err = upstreamError as { status: number; message: string } | null;
          if (err) return json(err.status, err.message);
          if (request.signal.aborted) return json(499, "Request cancelled.");
          console.error(e);
          return json(502, "The AI service could not be reached. Please try again.");
        }
        if (first.done) {
          const err = upstreamError as { status: number; message: string } | null;
          return json(err?.status ?? 502, err?.message ?? "The AI returned an empty response. Try rephrasing your input.");
        }

        const enc = new TextEncoder();
        const body = new ReadableStream({
          async start(controller) {
            controller.enqueue(enc.encode(first.value));
            try {
              while (true) {
                const n = await reader.next();
                if (n.done) break;
                controller.enqueue(enc.encode(n.value));
              }
            } catch {
              controller.enqueue(enc.encode("\n\n[Generation interrupted — please try again.]"));
            }
            controller.close();
          },
        });
        return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
      },
    },
  },
});
