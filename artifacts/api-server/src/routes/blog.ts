import { Router, type IRouter } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateBlogPostBody,
  GetBlogPostParams,
  UpdateBlogPostParams,
  UpdateBlogPostBody,
  DeleteBlogPostParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /blog - list all published posts
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

// POST /blog - create a post (admin)
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

// PUT /blog/id/:id - update a post (admin) — must be BEFORE the slug route
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

// DELETE /blog/id/:id - delete a post (admin)
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

// GET /blog/:slug - get single post by slug
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
