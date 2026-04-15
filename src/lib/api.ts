import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.devxsolutions.pro",
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para obtener el token (siempre fresco)
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Interceptor para agregar token a TODAS las peticiones
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔐 [API] Token enviado a: ${config.url}`);
    } else {
      console.log(`⚠️ [API] Sin token para: ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("🔒 [API] No autorizado - Redirigiendo a login");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);