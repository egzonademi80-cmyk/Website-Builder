import { Router, type IRouter } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "securevision2024";
const ADMIN_TOKEN = "sv_admin_token_securevision2024";

// POST /admin/login - admin login
router.post("/login", (req, res) => {
  try {
    const body = AdminLoginBody.parse(req.body);
    if (body.username === ADMIN_USERNAME && body.password === ADMIN_PASSWORD) {
      res.json({ token: ADMIN_TOKEN, message: "Login successful" });
    } else {
      res.status(401).json({ error: "unauthorized", message: "Invalid credentials" });
    }
  } catch (err) {
    req.log.error({ err }, "Admin login failed");
    res.status(400).json({ error: "bad_request", message: "Invalid request body" });
  }
});

// GET /admin/verify - verify admin token
router.get("/verify", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    res.json({ message: "Token valid", success: true });
  } else {
    res.status(401).json({ error: "unauthorized", message: "Invalid or missing token" });
  }
});

export default router;
