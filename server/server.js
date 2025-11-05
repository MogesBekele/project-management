import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("server is running ");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
