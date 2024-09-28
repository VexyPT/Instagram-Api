import * as dotenv from "dotenv";
import routers from "./routes/router";
import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import axios from "axios"; // Usado para enviar logs ao Discord

dotenv.config();
const app = express();
app.use(express.json());

app.use(
  cors({
    methods: "GET,POST",
    allowedHeaders: ["Content-Type"],
  })
);

// Função para enviar logs para o Discord
const sendLogToDiscord = async (message: string) => {
  try {
    await axios.post(process.env.DISCORD_WEBHOOK_URL as string, {
      content: message,
    });
  } catch (error) {
    console.error("Erro ao enviar log para o Discord:", error);
  }
};

// Middleware para capturar IP e User-Agent
app.use(async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  
  // Mensagem de log para o Discord
  const logMessage = `
    # --Nova requisição--
    **IP do Usuário:** ${ip}
    **Endpoint Acessado:** ${req.originalUrl}
    **User-Agent:** ${userAgent}
    **Método HTTP:** ${req.method}
  `;

  // Envia log para o Discord
  await sendLogToDiscord(logMessage);

  next();
});

app.use("/", routers);

app.use(function (req: Request, res: Response, next: NextFunction) {
  res.status(404).json({ error: "Rota não encontrada" });
  next();
});

app.listen({ port: Number(process.env.PORT) || 3333 }, () => {
  console.clear();
  console.log(
    `Server listening at http://localhost:${process.env.PORT || 3333}`
  );
});