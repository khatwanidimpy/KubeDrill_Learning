import { api } from "./api";
import type { BlogPost } from "./types";

export type BlogPostInput = Omit<BlogPost, "createdAt" | "updatedAt" | "authorName" | "publishedAt">;

export const blogApi = {
  async list(): Promise<BlogPost[]> {
    const { data } = await api.get("/blog-posts");
    return data.posts ?? data;
  },

  async create(post: BlogPostInput): Promise<BlogPost> {
    const { data } = await api.post("/blog-posts", post);
    return data.post ?? data;
  },
};
