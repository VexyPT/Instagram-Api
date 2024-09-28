import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const GEO_TOKEN = process.env.GEO_TOKEN;

export async function getGeoInfo(ip: string) {
  if (ip === "::1" || ip === "127.0.0.1") {
    return {
      city: "Localhost",
      region: "N/A",
      country: "N/A",
    };
  }

  try {
    const response = await axios.get(`https://ipinfo.io/${ip}?token=${GEO_TOKEN}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter geolocalização:", error);
    return {
      city: "Desconhecido",
      region: "Desconhecido",
      country: "Desconhecido",
    };
  }
}