// app/(dashboard)/dashboard/page.tsx
"use client";

import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-lg">
          Bienvenido, <span className="font-bold">{user?.nombre || user?.email}</span>
        </p>
        <p className="text-gray-600 mt-2">
          Este es tu panel de control. Aquí verás tus estadísticas y podrás gestionar tus predicciones.
        </p>
      </div>
    </div>
  );
}