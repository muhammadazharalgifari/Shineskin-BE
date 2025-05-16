import { Router } from "express";
import { validateMiddleUser } from "../middleware/validateMiddleUser";
import adminOnly from "../middleware/adminOnly";
import { getDailySales } from "../controllers/salesSummary/getDailySales";
import { getMonthlySales } from "../controllers/salesSummary/getMonthlySales";

const salesRoute = new Router();

salesRoute.get(
  "/api/sales/daily",
  validateMiddleUser,
  adminOnly,
  getDailySales
);

salesRoute.get(
  "/api/sales/monthly",
  validateMiddleUser,
  adminOnly,
  getMonthlySales
);

export default salesRoute;
