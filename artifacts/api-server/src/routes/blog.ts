import { Router, type IRouter } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const CreateBlogPostBody = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  imageUrl: z.string().min(1),
  author: z.string().min(1),
  category: z.string().min(1),
  published: z.boolean().optional().default(true),
});

const UpdateBlogPostParams = z.object({ id: z.number().int().positive() });
const UpdateBlogPostBody = CreateBlogPostBody.partial();
const DeleteBlogPostParams = z.object({ id: z.number().int().positive() });

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const posts = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.published, true))
      .orderBy(blogPostsTable.createdAt);
    res.json(posts);
  } catch (err) {
    req.log.error({ err }, "Failed to list blog posts");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch blog posts" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateBlogPostBody.parse(req.body);
    const [post] = await db.insert(blogPostsTable).values(body).returning();
    res.status(201).json(post);
  } catch (err) {
    req.log.error({ err }, "Failed to create blog post");
    res.status(500).json({ error: "internal_error", message: "Failed to create blog post" });
  }
});

router.put("/id/:id", async (req, res) => {
  try {
    const params = UpdateBlogPostParams.parse({ id: parseInt(req.params.id) });
    const body = UpdateBlogPostBody.parse(req.body);
    const [post] = await db
      .update(blogPostsTable)
      .set(body)
      .where(eq(blogPostsTable.id, params.id))
      .returning();
    if (!post) {
      res.status(404).json({ error: "not_found", message: "Blog post not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    req.log.error({ err }, "Failed to update blog post");
    res.status(500).json({ error: "internal_error", message: "Failed to update blog post" });
  }
});

router.delete("/id/:id", async (req, res) => {
  try {
    const params = DeleteBlogPostParams.parse({ id: parseInt(req.params.id) });
    const [deleted] = await db
      .delete(blogPostsTable)
      .where(eq(blogPostsTable.id, params.id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "not_found", message: "Blog post not found" });
      return;
    }
    res.json({ message: "Blog post deleted successfully", success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete blog post");
    res.status(500).json({ error: "internal_error", message: "Failed to delete blog post" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const [post] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, req.params.slug));
    if (!post) {
      res.status(404).json({ error: "not_found", message: "Blog post not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    req.log.error({ err }, "Failed to get blog post");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch blog post" });
  }
});

export default router;
