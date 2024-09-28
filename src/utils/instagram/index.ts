import { api } from "../axiosInstance";
import * as cheerio from "cheerio";
import { Buffer } from "buffer";

export const fetchInstagramData = async (username: string): Promise<string> => {
  const { data } = await api.get(`/${username}/`);
  return data;
};

export const extractMetaDescription = ($: cheerio.Root): string | null => {
  return $('meta[name="description"]').attr("content") || null;
};

export const parseMetaDescription = (metaDescription: string) => {
  const countRegex =
    /(\d+[.,]?\d*[KMB]?) Followers, (\d+[.,]?\d*[KMB]?) Following, (\d+[.,]?\d*[KMB]?) Posts/;
  const countMatch = metaDescription.match(countRegex);
  const followers = countMatch ? convertToNumber(countMatch[1]) : "N/A";
  const following = countMatch ? convertToNumber(countMatch[2]) : "N/A";
  const posts = countMatch ? convertToNumber(countMatch[3]) : "N/A";

  const nameHandleRegex = /Posts - (.*?) \((@[\w.]+)\) on Instagram/;
  const nameHandleMatch = metaDescription.match(nameHandleRegex);

  const name = nameHandleMatch ? nameHandleMatch[1].trim() : "N/A";
  const handle = nameHandleMatch ? nameHandleMatch[2] : "N/A";

  const bioRegex = /on Instagram: (.+?)(?:$| -)/s;
  const bioMatch = metaDescription.match(bioRegex);

  const bio = bioMatch ? bioMatch[1].replace(/^"|"$/g, "").trim() : "N/A";

  return { followers, following, posts, name, handle, bio };
};

export const fetchAvatarBase64 = async (avatarUrl: string): Promise<string> => {
  try {
    const { data } = await api.get(avatarUrl, { responseType: "arraybuffer" });
    return Buffer.from(data).toString("base64");
  } catch {
    return "Erro ao obter avatar";
  }
};

export const fetchAvatarData = async (data: string) => {
  const $ = cheerio.load(data);
  const avatarUrl = $('meta[property="og:image"]').attr("content") || "";
  const avatarBase64 = avatarUrl ? await fetchAvatarBase64(avatarUrl) : "";

  const isVerified = $('span[title="Verified"]').length > 0;

  return { $, avatarUrl, avatarBase64, isVerified };
};

const convertToNumber = (text: string): number => {
  const numberText = text.replace(/[KMB]/, (match) => {
    switch (match) {
      case "K":
        return "000";
      case "M":
        return "000000";
      case "B":
        return "000000000";
      default:
        return "";
    }
  });
  return parseFloat(numberText.replace(/,/g, ""));
};
