import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("server is running ");
});

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
