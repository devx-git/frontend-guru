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
  Coins,
  Flame
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
          className="fixed top-4 left-4 z-50 p-2 bg-black/80 backdrop-blur-md rounded-lg shadow-lg border border-white/10 md:hidden"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-40
          bg-black/80 backdrop-blur-md border-r border-white/10 min-h-screen
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
          ${isMobile && !collapsed ? "translate-x-0" : isMobile && collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className={`p-4 border-b border-white/10 ${collapsed ? "px-2" : "px-4"} flex items-center justify-between`}>
          <Link href="/dashboard" className={`flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-md">
              <Flame className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                KICKLAST
              </h1>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Info */}
        <div className={`p-4 border-b border-white/10 ${collapsed ? "text-center" : ""}`}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {userInitial}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{userName}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Saldo en Sidebar */}
        {!collapsed && (
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
        {collapsed && (
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
          
          {/* Botón Recargar */}
          {!collapsed && (
            <div className="px-4 mt-2">
              <Button
                className="w-full justify-start gap-3 border border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300 bg-transparent rounded-lg"
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 ${collapsed ? "px-2 justify-center" : "px-4"} transition-colors duration-200`}
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
          className="fixed inset-0 bg-black/70 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}