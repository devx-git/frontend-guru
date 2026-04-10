"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Trophy, 
  Wallet, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";
import { saldoService } from "@/services/saldo.service";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/eventos", label: "Eventos", icon: Calendar },
  { href: "/mis-gurus", label: "Mis Gurús", icon: Trophy },
  { href: "/wallet", label: "Wallet", icon: Wallet },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cargar saldo
  useEffect(() => {
    const cargarSaldo = async () => {
      const saldoActual = await saldoService.getSaldo();
      setSaldo(saldoActual);
    };
    cargarSaldo();
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const userName = user?.nombre || user?.email || "Usuario";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && collapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-40
          bg-white border-r min-h-screen
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
          ${isMobile && !collapsed ? "translate-x-0" : isMobile && collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className={`p-4 border-b ${collapsed ? "px-2" : "px-4"} flex items-center justify-between`}>
          <Link href="/dashboard" className={`flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-md">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Gurú
              </h1>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-1 rounded-lg hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Info */}
        <div className={`p-4 border-b ${collapsed ? "text-center" : ""}`}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
              {userInitial}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Saldo en Sidebar */}
        {!collapsed && (
          <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Saldo disponible</span>
              </div>
              <span className="text-sm font-bold text-green-600">
                {saldo.toLocaleString()} créditos
              </span>
            </div>
          </div>
        )}

        {/* Versión colapsada del saldo */}
        {collapsed && (
          <div className="flex justify-center mt-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Coins className="w-5 h-5 text-green-600" />
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
                  variant={isActive ? "default" : "ghost"}
                  className={`
                    w-full justify-start gap-3 rounded-none
                    ${collapsed ? "px-2 justify-center" : "px-4"}
                    ${isActive ? "bg-gradient-to-r from-blue-50 to-green-50 text-blue-600" : ""}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
          
          {/* Botón Recargar */}
          {!collapsed && (
            <div className="px-4 mt-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-green-200 text-green-600 hover:bg-green-50"
                asChild
              >
                <Link href="/recargar">
                  <Coins className="w-4 h-4" />
                  Recargar créditos
                </Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 ${collapsed ? "px-2 justify-center" : "px-4"}`}
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Cerrar sesión</span>}
          </Button>
        </div>
      </aside>

      {/* Overlay para móvil */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}