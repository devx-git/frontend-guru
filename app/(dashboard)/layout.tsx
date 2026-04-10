"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  Trophy, 
  Wallet, 
  LogOut,
  Menu,
  Bell,
  ChevronRight,
  ChevronLeft,
  Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { saldoService } from "@/services/saldo.service";
import { NotificationBell } from "@/components/layout/NotificationBell";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/eventos", label: "Eventos", icon: Calendar },
  { href: "/mis-gurus", label: "Mis Gurús", icon: Trophy },
  { href: "/wallet", label: "Wallet", icon: Wallet },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [saldo, setSaldo] = useState(0);

  // Marcar cuando el componente está montado en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Detectar si es móvil (solo en cliente)
  useEffect(() => {
    if (!mounted) return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mounted]);

  // Verificar autenticación
  useEffect(() => {
    if (mounted && !token) {
      router.push("/login");
    }
  }, [mounted, token, router]);

  // Cargar saldo
    useEffect(() => {
    if (!mounted || !token) return;
    
    const cargarSaldo = async () => {
      const saldoActual = await saldoService.getSaldo();
      setSaldo(saldoActual);
    };
    cargarSaldo();
  }, [mounted, token]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const userName = user?.nombre || user?.email || "Usuario";
  const userInitial = userName.charAt(0).toUpperCase();

  // Mostrar loader solo en cliente, y solo si no hay token
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header - Solo renderizar en cliente */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Gurú
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-green-50 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
              <Coins className="w-3 h-3 text-green-600" />
              <span className="text-xs font-semibold text-green-600">{saldo.toLocaleString()} créditos</span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {userInitial}
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar - Solo renderizar en cliente */}
        <aside
          className={`
            fixed md:sticky top-0 left-0 z-40
            bg-white border-r shadow-xl
            transition-all duration-300 ease-in-out
            ${isMobile 
              ? sidebarOpen 
                ? "translate-x-0" 
                : "-translate-x-full"
              : collapsed 
                ? "w-20" 
                : "w-64"
            }
            ${isMobile ? "w-64" : ""}
            h-screen overflow-y-auto flex flex-col
          `}
        >
          {/* Logo */}
          <div className={`p-4 border-b flex items-center justify-between ${collapsed ? "px-2" : "px-4"}`}>
            <Link href="/dashboard" className={`flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              {!collapsed && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Gurú
                  </h1>
                  <p className="text-xs text-gray-400">Predicciones deportivas</p>
                </div>
              )}
            </Link>
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Menu */}
          <nav className="flex-1 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`
                      w-full justify-start gap-3 rounded-none py-3
                      ${collapsed ? "px-2 justify-center" : "px-4"}
                      ${isActive 
                        ? "bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 border-r-4 border-blue-600" 
                        : "hover:bg-gray-50 text-gray-600"
                      }
                      transition-all duration-200
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </Button>
                </Link>
              );
            })}
            
            {/* Botón de recarga */}
            {!collapsed && (
              <div className="px-4 mt-2 mb-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                  asChild
                >
                  <Link href="/recargar">
                    <Coins className="w-5 h-5" />
                    Recargar créditos
                  </Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Footer Sidebar */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className={`
                w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50
                ${collapsed ? "px-2 justify-center" : "px-4"}
                transition-colors duration-200
              `}
              onClick={() => {
                logout();
                if (isMobile) setSidebarOpen(false);
              }}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span>Cerrar sesión</span>}
            </Button>
          </div>
        </aside>

        {/* Overlay móvil */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isMobile ? "pt-16" : ""}`}>
          {/* Header Desktop */}
          {!isMobile && (
            <header className="bg-white border-b shadow-sm sticky top-0 z-30">
              <div className="px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-800">
                  {menuItems.find(item => pathname === item.href)?.label || "Dashboard"}
                </h1>
                <div className="flex items-center gap-4">
                  {/* Saldo */}
                  <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full shadow-sm border border-green-100">
                    <Coins className="w-5 h-5 text-green-600" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Saldo:</span>
                      <span className="text-lg font-bold text-green-600">{saldo.toLocaleString()} créditos</span>
                    </div>
                  </div>
                  
                  {/* Botón recargar */}
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                    asChild
                  >
                    <Link href="/recargar">
                      <Coins className="w-4 h-4 mr-2" />
                      Recargar
                    </Link>
                  </Button>
                  
                  {/* Notificaciones */}
                  <NotificationBell />
                  
                  {/* Perfil */}
                  <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {userInitial}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-gray-700">{userName}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Page Content */}
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}