import express from "express";
import serverless from "serverless-http";

const app = express();
app.get("/hello", (req, res) => res.send("Hello from Netlify!"));

export const handler = serverless(app);
