import { Router, type IRouter } from "express";
import { db, productsTable, insertProductSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /products - list all products
router.get("/", async (req, res) => {
  try {
    const products = await db.select().from(productsTable).orderBy(productsTable.createdAt);
    res.json(products);
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch products" });
  }
});

// GET /products/:id - get single product
router.get("/:id", async (req, res) => {
  try {
    const params = GetProductParams.parse({ id: parseInt(req.params.id) });
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, params.id));
    if (!product) {
      res.status(404).json({ error: "not_found", message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    req.log.error({ err }, "Failed to get product");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch product" });
  }
});

// POST /products - create product
router.post("/", async (req, res) => {
  try {
    const body = CreateProductBody.parse(req.body);
    const [product] = await db.insert(productsTable).values({
      name: body.name,
      price: String(body.price),
      description: body.description,
      shortDescription: body.shortDescription,
      imageUrl: body.imageUrl,
      category: body.category,
      features: body.features,
      inStock: body.inStock,
    }).returning();
    res.status(201).json(product);
  } catch (err) {
    req.log.error({ err }, "Failed to create product");
    res.status(500).json({ error: "internal_error", message: "Failed to create product" });
  }
});

// PUT /products/:id - update product
router.put("/:id", async (req, res) => {
  try {
    const params = UpdateProductParams.parse({ id: parseInt(req.params.id) });
    const body = UpdateProductBody.parse(req.body);
    const [product] = await db
      .update(productsTable)
      .set({
        name: body.name,
        price: String(body.price),
        description: body.description,
        shortDescription: body.shortDescription,
        imageUrl: body.imageUrl,
        category: body.category,
        features: body.features,
        inStock: body.inStock,
      })
      .where(eq(productsTable.id, params.id))
      .returning();
    if (!product) {
      res.status(404).json({ error: "not_found", message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    req.log.error({ err }, "Failed to update product");
    res.status(500).json({ error: "internal_error", message: "Failed to update product" });
  }
});

// DELETE /products/:id - delete product
router.delete("/:id", async (req, res) => {
  try {
    const params = DeleteProductParams.parse({ id: parseInt(req.params.id) });
    const [deleted] = await db.delete(productsTable).where(eq(productsTable.id, params.id)).returning();
    if (!deleted) {
      res.status(404).json({ error: "not_found", message: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted successfully", success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete product");
    res.status(500).json({ error: "internal_error", message: "Failed to delete product" });
  }
});

export default router;
