"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CarFront, Lock, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular petición
    setTimeout(() => {
      setIsLoading(false);
      router.push("/"); // Redirigir al dashboard
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Fondo Premium */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-zinc-50 to-zinc-50 dark:from-indigo-900/40 dark:via-zinc-950 dark:to-zinc-950"></div>
      
      {/* Elemento de diseño difuminado */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Botón de tema */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Tarjeta Glassmorphism */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 mx-4 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <CarFront className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-400">
            Rosautos
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2 relative">
            <div className="absolute left-3 top-2.5 text-zinc-500 dark:text-zinc-400">
              <User className="h-5 w-5" />
            </div>
            <Input 
              type="text" 
              placeholder="Usuario" 
              className="pl-10 h-11 bg-white/50 dark:bg-zinc-950/50 border-zinc-300 dark:border-zinc-800 focus-visible:ring-indigo-500"
              required 
            />
          </div>
          <div className="space-y-2 relative">
            <div className="absolute left-3 top-2.5 text-zinc-500 dark:text-zinc-400">
              <Lock className="h-5 w-5" />
            </div>
            <Input 
              type="password" 
              placeholder="Contraseña" 
              className="pl-10 h-11 bg-white/50 dark:bg-zinc-950/50 border-zinc-300 dark:border-zinc-800 focus-visible:ring-indigo-500"
              required 
            />
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-indigo-500/25 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Proyecto Universitario - Bases de Datos I
        </div>
      </div>
    </div>
  );
}
