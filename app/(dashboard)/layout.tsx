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
  Coins,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { saldoService } from "@/services/saldo.service";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";


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

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (mounted && !token) {
      router.push("/login");
    }
  }, [mounted, token, router]);

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

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <Flame className="w-8 h-8 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  const pageTitle = menuItems.find(item => pathname === item.href)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-black">
      
      {/* Fondo lobby */}
      <div className="fixed inset-0 w-full h-full bg-[url('/img/lobby.jpg')] bg-cover bg-center opacity-30 z-[-2]" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 z-[-1]" />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[linear-gradient(rgba(141,198,63,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(141,198,63,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                KICKLAST
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/20">
              <Coins className="w-3 h-3 text-green-400" />
              <span className="text-xs font-semibold text-green-400">
                {saldo.toLocaleString()} créditos
              </span>
            </div>
            <ThemeToggle />
            <NotificationBell />
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {userInitial}
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-0 left-0 z-40
            bg-black/80 backdrop-blur-md border-r border-white/10
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
          <div className={`p-4 border-b border-white/10 flex items-center justify-between ${collapsed ? "px-2" : "px-4"}`}>
            <Link href="/dashboard" className={`flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <Flame className="w-5 h-5 text-white" />
              </div>
              {!collapsed && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    KICKLAST
                  </h1>
                  <p className="text-xs text-gray-500">Predicciones deportivas</p>
                </div>
              )}
            </Link>
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* User Info Desktop */}
          {!isMobile && !collapsed && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{userName}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Saldo en Sidebar */}
          {!isMobile && !collapsed && (
            <div className="mx-4 mt-4 p-3 bg-white/5 rounded-xl border border-green-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Saldo disponible</span>
                </div>
                <span className="text-sm font-bold text-green-400">
                  {saldo.toLocaleString()} créditos
                </span>
              </div>
            </div>
          )}

          {/* Versión colapsada del saldo */}
          {!isMobile && collapsed && (
            <div className="flex justify-center mt-4">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-green-500/30">
                <Coins className="w-5 h-5 text-green-400" />
              </div>
            </div>
          )}

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
                        ? "bg-gradient-to-r from-blue-600/20 to-green-600/20 text-green-400 border-r-4 border-green-500"
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                      }
                      transition-all duration-200
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-green-400" : "text-gray-500"}`} />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </Button>
                </Link>
              );
            })}
            
            {/* Botón de recarga */}
            {!collapsed && (
              <div className="px-4 mt-2 mb-2">
                <Button
                  className="w-full justify-start gap-3 border border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300 bg-transparent rounded-lg"
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
          <div className="p-4 border-t border-white/10">
            <Button
              variant="ghost"
              className={`
                w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10
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
            className="fixed inset-0 bg-black/70 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isMobile ? "pt-16" : ""}`}>
          {/* Header Desktop */}
          {!isMobile && (
            <header className="bg-black/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
              <div className="px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-white">
                  {pageTitle}
                </h1>
                <div className="flex items-center gap-4">
                  {/* Saldo Desktop */}
                  <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                    <Coins className="w-5 h-5 text-green-400" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-400">Saldo:</span>
                      <span className="text-lg font-bold text-green-400">
                        {saldo.toLocaleString()} créditos
                      </span>
                    </div>
                  </div>
                  
                  {/* Botón recargar */}
                  <Button
                    className="border border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300 bg-transparent rounded-full"
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
                  <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {userInitial}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-white">{userName}</p>
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