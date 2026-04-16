import axios from "axios";

// A shared API helper keeps all frontend requests pointed at the same backend URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
});

export default api;
