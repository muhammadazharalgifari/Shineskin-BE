import { Router } from "express";
import { getAllTransactions } from "../controllers/transaction/getAllTransactions.js";
import { validateMiddleUser } from "../middleware/validateMiddleUser.js";
import { getTransactionByAuth } from "../controllers/transaction/getTransactionByAuth.js";
import adminOnly from "../middleware/adminOnly.js";
import {
  updateTransaction,
  uploadUpdate,
} from "../controllers/transaction/updateTransaction.js";
import { statusTransaction } from "../controllers/transaction/statusTransaction.js";
import { getDailySales } from "../controllers/salesSummary/getDailySales.js";
import { getMonthlySales } from "../controllers/salesSummary/getMonthlySales.js";

const transactionRoute = new Router();

// route get all transactions
transactionRoute.get(
  "/api/transactions",
  validateMiddleUser,
  adminOnly,
  getAllTransactions
);

// route get transactions by Auth
transactionRoute.get(
  "/api/auth-transactions",
  validateMiddleUser,
  getTransactionByAuth
);

// route update transaction by Auth
transactionRoute.put(
  "/api/update-transaction/:id",
  validateMiddleUser,
  uploadUpdate.single("imageTransaction"),
  updateTransaction
);

// route update Status transaction CMS
transactionRoute.put(
  "/api/set-success/:id",
  validateMiddleUser,
  adminOnly,
  statusTransaction
);

export default transactionRoute;
