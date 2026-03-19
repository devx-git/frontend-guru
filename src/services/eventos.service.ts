import { api } from "@/lib/api"
    

export const getEventosActivos = async () => {
    const res = await api.get("/eventos/activos")
    return res.data
}



