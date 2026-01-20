import axios from "axios";
import { getToken } from "../auth/token";

const client = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers?.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export default client;
