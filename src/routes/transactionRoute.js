import { Router } from "express";
import { getAllTransactions } from "../controllers/transaction/getAllTransactions.js";
import { validateMiddleUser } from "../middleware/validateMiddleUser.js";
import { getTransactionByAuth } from "../controllers/transaction/getTransactionByAuth.js";
import adminOnly from "../middleware/adminOnly.js";

const transactionRoute = new Router();

// route get all transactions
transactionRoute.get("/api/transactions", validateMiddleUser, adminOnly , getAllTransactions);

// route get transactions by Auth
transactionRoute.get("/api/auth-transactions", validateMiddleUser, getTransactionByAuth);

export default transactionRoute;