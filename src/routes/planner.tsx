import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Field, ToolWorkspace } from "@/components/ToolWorkspace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Techbaby AI Assistance" },
      { name: "description", content: "Prioritise your tasks and get a realistic, time-blocked daily schedule." },
      { property: "og:title", content: "AI Task Planner — Techbaby AI" },
      { property: "og:description", content: "Prioritise your tasks and get a realistic, time-blocked daily schedule." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("08:00–17:00");
  const [goals, setGoals] = useState("");
  return (
    <>
      <PageHeader icon={ListChecks} title="AI Task Planner" subtitle="Dump your to-do list. Get clear priorities and a schedule that fits your day." />
      <ToolWorkspace
        outputLabel="Your plan"
        canSubmit={tasks.trim().length >= 3}
        getInput={() => ({ tool: "planner", tasks, hours, goals })}
        form={
          <>
            <Field label="Tasks *" hint="One per line. Add deadlines or durations if you know them.">
              <Textarea value={tasks} onChange={(e) => setTasks(e.target.value)} maxLength={4000} rows={9}
                placeholder={"Reply to supplier quotes\nPrepare payroll (due today)\nPost on Instagram\nCall landlord about lease\nUpdate stock sheet (1h)"} />
            </Field>
            <Field label="Working hours">
              <Input value={hours} onChange={(e) => setHours(e.target.value)} maxLength={60} />
            </Field>
            <Field label="Main goal for today">
              <Input value={goals} onChange={(e) => setGoals(e.target.value)} maxLength={500} placeholder="e.g. Close the month-end books" />
            </Field>
          </>
        }
      />
    </>
  );
}
