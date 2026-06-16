import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8080/v1",
  baseURL: "https://metro-app-fm78p.ondigitalocean.app/v1",
});

export const apiLogin = axios.create({
  baseURL: "https://metro-app-fm78p.ondigitalocean.app/",
  // baseURL: "http://localhost:8080/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
