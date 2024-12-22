import { Router } from "express";
import { getAllTransactions } from "../controllers/transaction/getAllTransactions.js";
import { validateMiddleUser } from "../middleware/validateMiddleUser.js";
import { getTransactionByAuth } from "../controllers/transaction/getTransactionByAuth.js";
import adminOnly from "../middleware/adminOnly.js";

const transactionRoute = new Router();

transactionRoute.get("/api/transactions", validateMiddleUser, adminOnly , getAllTransactions);

transactionRoute.get("/api/auth-transactions", validateMiddleUser, getTransactionByAuth);

export default transactionRoute;