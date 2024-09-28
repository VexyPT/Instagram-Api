import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config(); 

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL; 

export const sendLogToDiscord = async (message: string) => {
  if (!DISCORD_WEBHOOK_URL) {
    console.error("Webhook URL do Discord não configurado.");
    return;
  }

  try {
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: message,
    });
  } catch (error) {
    console.error("Erro ao enviar log para o Discord:", error);
  }
};
