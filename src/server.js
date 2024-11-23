import express from "express";
import cors from "cors";
import env from "dotenv";
import path from "path";
import testRoute from "./routes/testRoute";
import authRoute from "./routes/authRoute";

// configuration
const app = express();
env.config();
const PORT = process.env.PORT;

app.use(cors());
app.use(
  express.json({
    limit: "100mb",
  })
);

app.use(
  express.urlencoded({
    extended: "true",
  })
);

// route static untuk profile dan product
app.use(
  "/profile",
  express.static(path.join(__dirname, "../public/imageProfile"))
);

// routes
app.use(testRoute);
app.use(authRoute);

app.listen(PORT, () => {
  console.log(`
    ===========================
    
    Server running on port ${PORT}
    
    ===========================
    `);
});
