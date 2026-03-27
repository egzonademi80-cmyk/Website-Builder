import express from "express";
import cors from "cors";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, serial, text, numeric, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { z } from "zod";

// ─── Database setup ───────────────────────────────────────────────
const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error("NEON_DATABASE_URL is required");

const pool = new Pool({ connectionString });
const db = drizzle(pool);

// ─── Schema (inline) ─────────────────────────────────────────────
const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  features: json("features").$type<string[]>().notNull().default([]),
  inStock: boolean("in_stock").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const contactsTable = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Validation schemas ───────────────────────────────────────────
const ProductBody = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().min(1),
  shortDescription: z.string().min(1),
  imageUrl: z.string().min(1),
  category: z.string().min(1),
  features: z.array(z.string()).default([]),
  inStock: z.boolean().default(true),
});

const ContactBody = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

const BlogBody = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  imageUrl: z.string().min(1),
  author: z.string().min(1),
  category: z.string().min(1),
  published: z.boolean().default(true),
});

const LoginBody = z.object({ username: z.string(), password: z.string() });

// ─── Admin auth ───────────────────────────────────────────────────
const ADMIN_USERNAME = "shkodran";
const ADMIN_PASSWORD = "shkodran";
const ADMIN_TOKEN = "sv_admin_token_shkodran";

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.headers["authorization"] === `Bearer ${ADMIN_TOKEN}`) return next();
  res.status(401).json({ error: "unauthorized", message: "Invalid or missing token" });
}

// ─── Express app ──────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get("/api/healthz", (_req, res) => res.json({ status: "ok" }));

// ── Products ──────────────────────────────────────────────────────
app.get("/api/products", async (_req, res) => {
  try {
    const products = await db.select().from(productsTable).orderBy(productsTable.createdAt);
    res.json(products);
  } catch { res.status(500).json({ error: "internal_error", message: "Failed to fetch products" }); }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, Number(req.params.id)));
    if (!product) { res.status(404).json({ error: "not_found", message: "Product not found" }); return; }
    res.json(product);
  } catch { res.status(500).json({ error: "internal_error", message: "Failed to fetch product" }); }
});

app.post("/api/products", requireAdmin, async (req, res) => {
  try {
    const body = ProductBody.parse(req.body);
    const [product] = await db.insert(productsTable).values({ ...body, price: String(body.price) }).returning();
    res.status(201).json(product);
  } catch { res.status(500).json({ error: "internal_error", message: "Failed to create product" }); }
});

app.put("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    const body = ProductBody.partial().parse(req.body);
    const { price, ...rest } = body;
    const update: Record<string, unknown> = { ...rest, ...(price !== undefined ? { price: String(price) } : {}) };
    const [product] = await db.update(productsTable).set(update).where(eq(productsTable.id, Number(req.params.id))).returning();
    if (!product) { res.status(404).json({ error: "not_found", message: "Product not found" }); return; }
    res.json(product);
  } catch { res.status(500).json({ error: "internal_error", message: "Failed to update product" }); }
});

app.delete("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    const [deleted] = await db.delete(productsTable).where(eq(productsTable.id, Number(req.params.id))).returning();
    if (!deleted) { res.status(404).json({ error: "not_found", message: "Product not found" }); return; }
    res.json({ message: "Product deleted successfully", success: true });
  } catch { res.status(500).json({ error: "internal_error", message: "Failed to delete product" }); }
});

// ── Contacts ──────────────────────────────────────────────────────
app.post("/api/contacts", async (req, res) => {
  try {
    const body = ContactBody.parse(req.body);
    await db.insert(contactsTable).values(body);
    res.status(201).json({ message: "Contact form submitted successfully", success: true });
  } catch { res.status(500).json({ error: "internal_error", message: "Failed to submit contact form" }); }
});

app.get("/api/contacts/list", requireAdmin, async (_req, res) => {
  try {
    const contacts = await db.select().from(contactsTable).orderBy(contactsTable.createdAt);
    res.json(contacts);
  } catch { res.status(500).json({ error: "internal_error", message: "Failed to fetch contacts" }); }
});

// ── Admin auth ────────────────────────────────────────────────────
app.post("/api/admin/login", (req, res) => {
  try {
    const body = LoginBody.parse(req.body);
    if (body.username === ADMIN_USERNAME && body.password === ADMIN_PASSWORD) {
      res.json({ token: ADMIN_TOKEN, message: "Login successful" });
    } else {
      res.status(401).json({ error: "unauthorized", message: "Invalid credentials" });
    }
  } catch { res.status(400).json({ error: "bad_request", message: "Invalid request body" }); }
});

app.get("/api/admin/verify", requireAdmin, (_req, res) => {
  res.json({ message: "Token valid", success: true });
});

// ── Blog ──────────────────────────────────────────────────────────
app.get("/api/blog", async (_req, res) => {
  try {
    const posts = await db.select().from(blogPostsTable).where(eq(blogPostsTable.published, true)).orderBy(blogPostsTable.createdAt);
    res.json(posts);
  } catch { res.status(500).json({ error: "internal_error", message: "Failed to fetch blog posts" }); }
});

app.post("/api/blog", requireAdmin, async (req, res) => {
  try {
    const body = BlogBody.parse(req.body);
    const [post] = await db.insert(blogPostsTable).values(body).returning();
    res.status(201).json(post);
  } catch { res.status(500).json({ error: "internal_error", message: "Failed to create blog post" }); }
});

app.put("/api/blog/id/:id", requireAdmin, async (req, res) => {
  try {
    const body = BlogBody.partial().parse(req.body);
    const [post] = await db.update(blogPostsTable).set(body).where(eq(blogPostsTable.id, Number(req.params.id))).returning();
    if (!post) { res.status(404).json({ error: "not_found", message: "Blog post not found" }); return; }
    res.json(post);
  } catch { res.status(500).json({ error: "internal_error", message: "Failed to update blog post" }); }
});

app.delete("/api/blog/id/:id", requireAdmin, async (req, res) => {
  try {
    const [deleted] = await db.delete(blogPostsTable).where(eq(blogPostsTable.id, Number(req.params.id))).returning();
    if (!deleted) { res.status(404).json({ error: "not_found", message: "Blog post not found" }); return; }
    res.json({ message: "Blog post deleted successfully", success: true });
  } catch { res.status(500).json({ error: "internal_error", message: "Failed to delete blog post" }); }
});

app.get("/api/blog/:slug", async (req, res) => {
  try {
    const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, req.params.slug));
    if (!post) { res.status(404).json({ error: "not_found", message: "Blog post not found" }); return; }
    res.json(post);
  } catch { res.status(500).json({ error: "internal_error", message: "Failed to fetch blog post" }); }
});

export default app;
