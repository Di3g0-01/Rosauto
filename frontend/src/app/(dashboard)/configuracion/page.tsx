import { Settings2, User, Bell, Shield, Paintbrush, Moon, Monitor, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-400">
          Configuración del Sistema
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Gestiona las preferencias y ajustes de tu cuenta y del entorno de trabajo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 rounded-xl h-11">
            <User className="mr-3 h-4 w-4" /> Perfil de Usuario
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 rounded-xl h-11">
            <Paintbrush className="mr-3 h-4 w-4" /> Apariencia
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 rounded-xl h-11">
            <Bell className="mr-3 h-4 w-4" /> Notificaciones
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 rounded-xl h-11">
            <Shield className="mr-3 h-4 w-4" /> Seguridad
          </Button>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-xl overflow-hidden p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-500" /> Información Personal
            </h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                DO
              </div>
              <div className="space-y-3">
                <Button variant="outline" className="rounded-xl h-9">
                  <Upload className="mr-2 h-4 w-4" /> Cambiar Avatar
                </Button>
                <p className="text-xs text-zinc-500">JPG, GIF o PNG. Tamaño máximo 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre Completo</label>
                <input 
                  defaultValue="Diego Ovalle"
                  className="w-full h-11 px-3 rounded-xl bg-white/50 dark:bg-zinc-950/50 border border-zinc-300/50 dark:border-zinc-800/50 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Correo Electrónico</label>
                <input 
                  defaultValue="dovalle@rosautos.com"
                  type="email"
                  className="w-full h-11 px-3 rounded-xl bg-white/50 dark:bg-zinc-950/50 border border-zinc-300/50 dark:border-zinc-800/50 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rol de Usuario</label>
                <input 
                  disabled
                  defaultValue="Administrador"
                  className="w-full h-11 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 rounded-xl h-11 px-6">
                <Save className="mr-2 h-4 w-4" /> Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
