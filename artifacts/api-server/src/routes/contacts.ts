import { Router, type IRouter } from "express";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

// POST /contacts - submit contact form
router.post("/", async (req, res) => {
  try {
    const body = SubmitContactBody.parse(req.body);
    await db.insert(contactsTable).values({
      name: body.name,
      phone: body.phone,
      email: body.email,
      message: body.message,
    });
    res.status(201).json({ message: "Contact form submitted successfully", success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to submit contact");
    res.status(500).json({ error: "internal_error", message: "Failed to submit contact form" });
  }
});

// GET /contacts/list - list all contacts (admin)
router.get("/list", async (req, res) => {
  try {
    const contacts = await db.select().from(contactsTable).orderBy(contactsTable.createdAt);
    res.json(contacts);
  } catch (err) {
    req.log.error({ err }, "Failed to list contacts");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch contacts" });
  }
});

export default router;
