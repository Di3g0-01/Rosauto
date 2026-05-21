"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CarFront, Hash, Calendar, Palette, Fingerprint, Info, Activity } from "lucide-react";

export function VehiculoDetails({ 
  vehiculo, 
  isOpen, 
  onClose 
}: { 
  vehiculo: any, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  if (!vehiculo) return null;

  const details = [
    { label: "Placa", value: vehiculo.placa, icon: Hash },
    { label: "VIN", value: vehiculo.vin, icon: Fingerprint },
    { label: "Marca", value: vehiculo.linea_estilo?.marca?.nombre, icon: CarFront },
    { label: "Línea", value: vehiculo.linea_estilo?.nombre, icon: Info },
    { label: "Modelo", value: vehiculo.año_modelo || vehiculo.a_o_modelo, icon: Calendar },
    { label: "Color", value: vehiculo.color, icon: Palette },
    { label: "Motor", value: vehiculo.num_motor, icon: Hash },
    { label: "Chasis", value: vehiculo.chasis, icon: Fingerprint },
    { label: "Cilindraje (CC)", value: vehiculo.cc, icon: Activity },
    { label: "Cilindros", value: vehiculo.cilindros, icon: Hash },
    { label: "Asientos", value: vehiculo.asientos, icon: Info },
    { label: "Ejes", value: vehiculo.ejes, icon: Hash },
    { label: "Tonelaje", value: vehiculo.tonelaje, icon: Info },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl shadow-2xl overflow-hidden p-0">
        <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <CarFront className="h-6 w-6 text-white" />
            </div>
            <div className="text-white">
              <DialogTitle className="text-xl font-bold tracking-tight">
                {vehiculo.linea_estilo?.marca?.nombre} {vehiculo.linea_estilo?.nombre}
              </DialogTitle>
              <DialogDescription className="text-blue-100/70 text-xs font-medium">
                Detalles técnicos completos
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {details.map((item, idx) => (
            <div key={idx} className="space-y-1 p-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 transition-all hover:shadow-sm hover:border-indigo-500/20 group">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <item.icon className="h-3 w-3 group-hover:text-indigo-500 transition-colors" />
                <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
              </div>
              <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate" title={item.value?.toString()}>
                {item.value || "N/A"}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center">
          <Badge variant="outline" className="bg-white/50 dark:bg-zinc-950/50 rounded-lg text-[10px]">
            ID SISTEMA: {vehiculo.id_vehiculo}
          </Badge>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-[10px] font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-zinc-500/20"
          >
            Cerrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
