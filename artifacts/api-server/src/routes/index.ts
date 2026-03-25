import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import contactsRouter from "./contacts";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/products", productsRouter);
router.use("/contacts", contactsRouter);
router.use("/admin", adminRouter);

export default router;
