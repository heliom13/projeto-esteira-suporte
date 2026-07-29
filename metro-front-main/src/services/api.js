import axios from "axios";
import { notification } from "antd";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_BASE}/v1`,
});

export const apiLogin = axios.create({
  baseURL: `${API_BASE}/`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let offlineNotified = false;
let offlineTimer = null;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Erro de rede (sem internet, servidor fora, timeout)
      if (!offlineNotified) {
        offlineNotified = true;
        notification.warning({
          message: "Sem conexão",
          description: "Verifique sua internet. As informações serão atualizadas automaticamente ao reconectar.",
          duration: 5,
          key: "network-error",
        });
      }
      // Zera o flag após 10s para não suprimir indefinidamente
      clearTimeout(offlineTimer);
      offlineTimer = setTimeout(() => { offlineNotified = false; }, 10000);

      return Promise.reject(Object.assign(error, { isNetworkError: true }));
    }

    if (error.response?.status === 401) {
      // Token expirado ou inválido — redireciona para login
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
