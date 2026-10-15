// Structured prompt templates. Shared by the server (to build prompts) and the
// client (for form options). Pure data + pure functions only.

export const EMAIL_TONES = ["Professional", "Friendly", "Persuasive", "Apologetic", "Formal", "Concise"] as const;
export const RESEARCH_DEPTHS = ["Quick overview", "Detailed analysis", "Executive briefing"] as const;

export type ToolKind = "email" | "planner" | "research";

const GUARDRAILS = `
Responsible AI rules:
- Never invent facts, statistics, names, prices, dates or quotes. If information is missing, use clearly marked placeholders like [Client name].
- Do not request or repeat sensitive personal data (ID numbers, passwords, banking details).
- Refuse harmful, deceptive, discriminatory or illegal requests politely.
- Write in clear, plain business English using markdown-free plain text unless a structure is requested.`;

export const SYSTEM_PROMPTS: Record<ToolKind, string> = {
  email: `You are Techbaby's Smart Email Generator, an expert business communication writer for small businesses.
Task: write ONE ready-to-send email.
Output format (exactly):
Subject: <subject line>

<greeting>,

<body in short paragraphs>

<sign-off>,
<sender name or [Your name]>
${GUARDRAILS}`,
  planner: `You are Techbaby's AI Task Planner, a productivity coach using the Eisenhower matrix and time-blocking.
Task: prioritise the user's tasks and build a realistic schedule within their working hours.
Output format (plain text with these sections):
PRIORITIES
1. <task> — <Urgent/Important label> — <est. time> — <one-line reason>
...
SCHEDULE
<HH:MM–HH:MM>  <task or break>
...
TIPS
- <2–3 practical tips>
Include short breaks. If tasks exceed available time, say which to defer.
${GUARDRAILS}`,
  research: `You are Techbaby's AI Research Assistant, a business analyst.
Task: summarise the provided text or topic and extract useful, actionable insights for a small business.
Output format (plain text with these sections):
SUMMARY
<concise summary>
KEY INSIGHTS
- <insight>
RECOMMENDED ACTIONS
- <action>
THINGS TO VERIFY
- <claims or assumptions the user should fact-check>
If the user gives only a topic (no source text), state that the answer is based on general knowledge and may be outdated.
${GUARDRAILS}`,
};

export type GenerateInput =
  | { tool: "email"; purpose: string; recipient: string; tone: string; details: string; sender: string }
  | { tool: "planner"; tasks: string; hours: string; goals: string }
  | { tool: "research"; topic: string; source: string; depth: string };

export function buildUserPrompt(input: GenerateInput): string {
  switch (input.tool) {
    case "email":
      return `Write an email.
Purpose: ${input.purpose}
Recipient: ${input.recipient || "[Recipient]"}
Tone: ${input.tone}
Key details to include: ${input.details || "none provided"}
Sender: ${input.sender || "[Your name]"}`;
    case "planner":
      return `Plan my day.
Working hours: ${input.hours || "08:00–17:00"}
Main goal today: ${input.goals || "not specified"}
Tasks (one per line, may include deadlines):
${input.tasks}`;
    case "research":
      return `Research request.
Topic / question: ${input.topic}
Depth: ${input.depth}
Source text to analyse:
${input.source || "(none — use general knowledge)"}`;
  }
}
