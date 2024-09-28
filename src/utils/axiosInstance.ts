import axios from "axios";

export const api = axios.create({
  baseURL: "https://www.instagram.com/",
  timeout: 10000,
});
