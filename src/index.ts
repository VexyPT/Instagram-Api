import * as dotenv from "dotenv";
import routers from "./routes/router";
import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import { sendLogToDiscord } from "./utils/discordLogger";
import { getGeoInfo } from "./utils/geoInfo";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    methods: "GET",
    allowedHeaders: ["Content-Type"],
  })
);

app.use(async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  const geoInfo = await getGeoInfo(ip as string);

  const logMessage = `
    # -- Nova requisição --
    **IP do Usuário:** ${ip}
    **Cidade:** ${geoInfo.city}
    **Região:** ${geoInfo.region}
    **País:** ${geoInfo.country}
    **Endpoint Acessado:** ${req.originalUrl}
    **User-Agent:** ${userAgent}
    **Método HTTP:** ${req.method}
  `;

  await sendLogToDiscord(logMessage);

  next();
});

app.use("/", routers);

app.use(function (req: Request, res: Response, next: NextFunction) {
  res.status(404).json({ error: "Route not found" });
  next();
});

app.listen({ port: Number(process.env.PORT) || 3333 }, () => {
  console.clear();
  console.log(
    `Server listening at http://localhost:${process.env.PORT || 3333}`
  );
});