import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import workspaceRouter from "./routes/workspaceRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const PORT = 5000;
// test endpoint
app.get("/", (req, res) => {
  res.send("server is running ");
});

// inngest endpoint
app.use("/api/inngest", serve({ client: inngest, functions }));

//Routes
app.use('/api/workspaces', protect, workspaceRouter)

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
// backend url https://project-mgt-server-ten.vercel.app/