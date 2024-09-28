import * as dotenv from "dotenv";
import routers from "./routes/router";
import express, { Response, Request, Next } from "express";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());

app.use(
  cors({
    methods: "GET",
    allowedHeaders: ["Content-Type"],
  })
); 

app.use("/", routers);

app.use(function (req: Request, res: Response, next: Next) {
  res.status(404).json({ error: "Route not found" });
  next();
});

app.listen({ port: Number(process.env.PORT) || 3333 }, () => {
  console.clear();
  console.log(
    `Server listening at http://localhost:${process.env.PORT || 3333}`
  );
});