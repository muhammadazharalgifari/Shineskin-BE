import { Router } from "express";
import { test } from "../controllers/test/test";

const testRoute = new Router();

testRoute.get("/api/test", test);

export default testRoute;
