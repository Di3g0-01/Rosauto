"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User, Mail, MapPin, Hash, Phone, Calendar, Info } from "lucide-react";

export function PropietarioDetails({ 
  propietario, 
  isOpen, 
  onClose 
}: { 
  propietario: any, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  if (!propietario) return null;

  const details = [
    { label: "NIT / CUI", value: propietario.nit_cui, icon: Hash },
    { label: "Nombres", value: propietario.nombres, icon: User },
    { label: "Apellidos", value: propietario.apellidos, icon: User },
    { label: "Dirección", value: propietario.direccion, icon: MapPin },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl shadow-2xl overflow-hidden p-0">
        <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-end">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="text-white">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {propietario.nombres} {propietario.apellidos}
              </DialogTitle>
              <DialogDescription className="text-indigo-100/80 font-medium">
                Información del propietario
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 gap-4">
          {details.map((item, idx) => (
            <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 transition-all hover:shadow-md hover:border-purple-500/20 group">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <item.icon className="h-3.5 w-3.5 group-hover:text-purple-500 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              </div>
              <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                {item.value || "No registrado"}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-200/50 dark:border-zinc-800/50 flex justify-end items-center">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-zinc-500/20"
          >
            Cerrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
