import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { interviewsApi } from "@/lib/interviews-api";
import {
  CATEGORIES, type Category, type Difficulty, type Interview, type Question,
} from "@/lib/types";
import { Plus, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: Page });

function Page() {
  return (
    <ProtectedRoute role="ADMIN">
      <AppShell><Admin /></AppShell>
    </ProtectedRoute>
  );
}

function blankInterview(): Interview {
  return {
    id: `iv_${Date.now()}`,
    title: "",
    description: "",
    difficulty: "EASY",
    durationMinutes: 15,
    category: "Kubernetes",
    published: false,
    questions: [],
  };
}

function blankQuestion(category: Category): Question {
  return {
    id: `q_${Date.now()}`,
    type: "MCQ",
    category,
    prompt: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  };
}

function Admin() {
  const [list, setList] = useState<Interview[] | null>(null);
  const [editing, setEditing] = useState<Interview | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const data = await interviewsApi.list();
    setList(data);
  }
  useEffect(() => { refresh(); }, []);

  async function save(i: Interview) {
    setSaving(true);
    try {
      const existing = (list ?? []).some((x) => x.id === i.id);
      if (existing) await interviewsApi.update(i);
      else await interviewsApi.create(i);
      setEditing(null);
      await refresh();
    } finally { setSaving(false); }
  }

  async function togglePublish(i: Interview) {
    await interviewsApi.update({ ...i, published: !i.published });
    await refresh();
  }

  async function remove(i: Interview) {
    if (!confirm(`Delete "${i.title}"?`)) return;
    await interviewsApi.remove(i.id);
    await refresh();
  }

  if (!list) return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;

  if (editing) {
    return <Editor interview={editing} onCancel={() => setEditing(null)} onSave={save} saving={saving} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-sm text-muted-foreground">Create and manage interview sets.</p>
        </div>
        <Button onClick={() => setEditing(blankInterview())}>
          <Plus className="mr-1 h-4 w-4" /> New interview
        </Button>
      </div>

      {list.length === 0 ? (
        <p className="rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
          No interviews yet.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {list.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{i.title || "(untitled)"}</span>
                  <Badge variant="secondary">{i.category}</Badge>
                  <Badge variant="outline">{i.difficulty}</Badge>
                  {i.published
                    ? <Badge className="bg-success text-success-foreground">Published</Badge>
                    : <Badge variant="outline">Draft</Badge>}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {i.questions.length} questions · {i.durationMinutes} min
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => togglePublish(i)}>
                  {i.published ? <><EyeOff className="mr-1 h-4 w-4" /> Unpublish</> : <><Eye className="mr-1 h-4 w-4" /> Publish</>}
                </Button>
                <Button size="sm" onClick={() => setEditing(i)}>Edit</Button>
                <Button variant="outline" size="sm" onClick={() => remove(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Editor({
  interview, onCancel, onSave, saving,
}: {
  interview: Interview;
  onCancel: () => void;
  onSave: (i: Interview) => void;
  saving: boolean;
}) {
  const [draft, setDraft] = useState<Interview>(interview);

  function update<K extends keyof Interview>(k: K, v: Interview[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function addQuestion() {
    setDraft((d) => ({ ...d, questions: [...d.questions, blankQuestion(d.category)] }));
  }

  function updateQuestion(qid: string, patch: Partial<Question>) {
    setDraft((d) => ({
      ...d,
      questions: d.questions.map((q) => (q.id === qid ? { ...q, ...patch } : q)),
    }));
  }

  function removeQuestion(qid: string) {
    setDraft((d) => ({ ...d, questions: d.questions.filter((q) => q.id !== qid) }));
  }

  function valid() {
    if (!draft.title.trim()) return "Title required";
    if (draft.durationMinutes < 1) return "Duration must be ≥ 1";
    if (draft.questions.length === 0) return "Add at least one question";
    for (const q of draft.questions) {
      if (!q.prompt.trim()) return "Every question needs a prompt";
      if (q.type === "MCQ" && (!q.options || q.options.some((o) => !o.trim())))
        return "Every MCQ option must be filled";
    }
    return null;
  }
  const err = valid();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {interview.title ? "Edit interview" : "New interview"}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(draft)} disabled={!!err || saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      {err && (
        <div className="rounded-md border border-warning/50 bg-warning/10 px-3 py-2 text-sm text-warning-foreground">
          {err}
        </div>
      )}

      <div className="grid gap-4 rounded-xl border border-border bg-card p-5 md:grid-cols-2">
        <div className="space-y-1.5 md:col-span-2">
          <Label>Title</Label>
          <Input value={draft.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label>Description</Label>
          <Textarea value={draft.description} onChange={(e) => update("description", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={draft.category} onValueChange={(v) => update("category", v as Category)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Difficulty</Label>
          <Select value={draft.difficulty} onValueChange={(v) => update("difficulty", v as Difficulty)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Duration (minutes)</Label>
          <Input type="number" min={1} value={draft.durationMinutes}
            onChange={(e) => update("durationMinutes", parseInt(e.target.value || "0", 10))} />
        </div>
        <div className="flex items-end gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.published}
              onChange={(e) => update("published", e.target.checked)} />
            Published
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Questions ({draft.questions.length})</h2>
          <Button size="sm" onClick={addQuestion}>
            <Plus className="mr-1 h-4 w-4" /> Add question
          </Button>
        </div>

        {draft.questions.map((q, qi) => (
          <div key={q.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-medium">Question {qi + 1}</div>
              <div className="flex items-center gap-2">
                <Select value={q.type} onValueChange={(v) =>
                  updateQuestion(q.id, { type: v as "MCQ" | "CODE" })}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MCQ">MCQ</SelectItem>
                    <SelectItem value="CODE">Code</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={q.category} onValueChange={(v) =>
                  updateQuestion(q.id, { category: v as Category })}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={() => removeQuestion(q.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <div className="space-y-1.5">
                <Label>Prompt</Label>
                <Textarea value={q.prompt}
                  onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })} />
              </div>

              {q.type === "MCQ" ? (
                <div className="space-y-2">
                  <Label>Options (select the correct one)</Label>
                  {(q.options ?? []).map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctIndex === oi}
                        onChange={() => updateQuestion(q.id, { correctIndex: oi })}
                      />
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const next = [...(q.options ?? [])];
                          next[oi] = e.target.value;
                          updateQuestion(q.id, { options: next });
                        }}
                        placeholder={`Option ${oi + 1}`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label>Starter code</Label>
                    <Textarea className="mono" value={q.starterCode ?? ""}
                      onChange={(e) => updateQuestion(q.id, { starterCode: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Expected answer (exact match)</Label>
                    <Textarea className="mono" value={q.expectedAnswer ?? ""}
                      onChange={(e) => updateQuestion(q.id, { expectedAnswer: e.target.value })} />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
