import { api } from "@/lib/api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  pais?: string;
  moneda?: string;
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  pais?: string;
  moneda?: string;
  rol?: {
    id: string;
    nombre: string;
  };
}

export interface LoginResponse {
  access_token: string;
  user?: User;
}

export const authService = {
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const res = await api.post("/auth/login", data);
      
      if (res.data.access_token) {
        const token = res.data.access_token;
        
        // Guardar token
        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/; max-age=604800`;
        
        // Obtener el perfil real del usuario desde /auth/me
        try {
          const perfilRes = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const userData = perfilRes.data;
          const user: User = {
            id: userData.id,
            email: userData.email,
            nombre: userData.nombre,
            pais: userData.pais || "CO",
            moneda: userData.moneda || "COP",
            rol: userData.rol,
          };
          
          localStorage.setItem("user", JSON.stringify(user));
          
          return {
            access_token: token,
            user: user,
          };
        } catch (perfilError) {
          console.error("Error obteniendo perfil:", perfilError);
          // Fallback: crear usuario con email
          const fallbackUser: User = {
            id: data.email,
            email: data.email,
            nombre: data.email.split('@')[0],
            pais: "CO",
            moneda: "COP",
          };
          localStorage.setItem("user", JSON.stringify(fallbackUser));
          
          return {
            access_token: token,
            user: fallbackUser,
          };
        }
      }
      
      throw new Error("No se recibió token del servidor");
    } catch (error: any) {
      console.error("Error en login:", error);
      throw error;
    }
  },

  async register(data: RegisterData) {
    try {
      const res = await api.post("/auth/register", data);
      return res.data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    if (!user || user === "null" || user === "undefined") return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("token");
    return !!token && token !== "null" && token !== "undefined";
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") return null;
    return token;
  },
};