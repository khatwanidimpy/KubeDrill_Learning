import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { blogApi } from "@/lib/blog-api";
import { CATEGORIES, type Category } from "@/lib/types";
import { ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/blog/create")({ component: Page });

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || `post-${Date.now()}`;
}

function Page() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("Kubernetes");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    const normalizedSlug = slugify(slug || title);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!excerpt.trim()) {
      setError("Excerpt is required.");
      return;
    }
    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    setSaving(true);
    try {
      await blogApi.create({
        id: `bp_${Date.now()}`,
        title: title.trim(),
        slug: normalizedSlug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        category,
        published,
      });
      navigate("/blog");
      return;
    } catch (err) {
      setError((err as Error)?.message || "Unable to save blog post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute role="ADMIN">
      <AppShell>
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="secondary" className="gap-2">
                <ArrowLeft className="h-3.5 w-3.5" />
                Blog post editor
              </Badge>
              <h1 className="mt-4 text-3xl font-bold tracking-tight">Create a new blog post</h1>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                Write a short Kubernetes exam guide or study note and publish it for the blog.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin">
                <Button variant="outline">Back to admin</Button>
              </Link>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/70 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
              {error}
            </div>
          )}

          <div className="grid gap-4 rounded-xl border border-border bg-card p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated from title"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(event) => setPublished(event.target.checked)}
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
                  />
                  Published
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button variant="outline" onClick={() => navigate("/admin")}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save post"}
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
