"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, CarFront, Users, FileText, Settings, LogOut, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const navigation = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Vehículos", href: "/vehiculos", icon: CarFront },
  { name: "Propietarios", href: "/propietarios", icon: Users },
  { name: "Trámites", href: "/tramites", icon: FileText },
  { name: "Calcomanías", href: "/calcomanias", icon: QrCode },
  { name: "Configuración", href: "/configuracion", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="hidden border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black md:flex md:flex-col md:w-64 md:shrink-0 h-screen sticky top-0 z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] dark:shadow-none">
      <div className="flex h-16 items-center px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3 font-semibold text-lg group w-full">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-indigo-500/20 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <CarFront className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-400">Rosautos</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid items-start px-3 text-sm font-medium space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 relative overflow-hidden group",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 hover:text-zinc-900 dark:hover:text-zinc-50"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/5 dark:from-indigo-500/20 dark:to-blue-500/10 border-l-4 border-indigo-500" />
                )}
                <item.icon className={cn("h-5 w-5 relative z-10 transition-transform group-hover:scale-110 duration-300", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400")} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors gap-3 rounded-xl py-6"
          onClick={() => router.push('/login')}
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );
}
