import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-store";
import { blogApi } from "@/lib/blog-api";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpenCheck, CheckCircle2, Clock, FileText, Terminal, Wrench } from "lucide-react";

export const Route = createFileRoute("/blog")({ component: Blog });

function Blog() {
  const { user } = useAuth();
  const { data: posts, isLoading, error } = useQuery(["blog-posts"], blogApi.list);

  return (
    <AppShell>
      <div className="space-y-10">
        <section className="max-w-4xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="secondary" className="gap-2">
                <FileText className="h-3.5 w-3.5" />
                KubeDrill blog
              </Badge>
              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                CKA and CKAD Exam Preparation Blog
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                Practical Kubernetes exam notes written in the same direct question-and-answer style
                you should practice before the real terminal exam.
              </p>
            </div>
            {user?.role === "ADMIN" && (
              <Link to="/blog/create">
                <Button variant="outline">Create blog post</Button>
              </Link>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#blog-posts">
              <Button>
                Jump to posts <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <Link to="/">
              <Button variant="outline">Back to questions</Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Hands-on",
              text: "Every article is written for terminal practice, not memorization.",
              icon: Terminal,
            },
            {
              title: "Exam focused",
              text: "Topics stay close to CKA and CKAD task patterns.",
              icon: BookOpenCheck,
            },
            {
              title: "Verification first",
              text: "Each habit ends with a way to prove the answer is correct.",
              icon: CheckCircle2,
            },
          ].map(({ title, text, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <h2 className="mt-3 font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>

        <section id="blog-posts" className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">Latest posts</h2>
            {user?.role === "ADMIN" && (
              <Link to="/blog/create">
                <Button variant="secondary">New post</Button>
              </Link>
            )}
          </div>

          {isLoading && (
            <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Loading blog posts…
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-destructive bg-destructive/10 p-6 text-sm text-destructive-foreground">
              Could not load blog posts. Please try again.
            </div>
          )}

          {posts?.length === 0 && !isLoading && (
            <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
              No published blog posts yet.
            </div>
          )}

          <div className="grid gap-4">
            {posts?.map((post) => (
              <Card key={post.id} className="border border-border bg-card p-6">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft"}</span>
                </div>
                <h3 className="mt-3 text-2xl font-semibold">{post.title}</h3>
                <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-primary">
                  <span>{post.authorName}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
