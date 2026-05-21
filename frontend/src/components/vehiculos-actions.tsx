"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { VehiculoDetails } from "./vehiculo-details";
import { useRouter } from "next/navigation";

export function VehiculosActions({ vehiculo }: { vehiculo: any }) {
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  const handleAction = (action: string) => {
    toast.info(`${action}`, {
      description: `Vehículo con placa: ${vehiculo.placa}`,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors outline-none focus:ring-2 focus:ring-indigo-500/20">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-zinc-500">Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 border-zinc-100 dark:border-zinc-800" />
            <DropdownMenuItem 
              onClick={() => setShowDetails(true)}
              className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer outline-none"
            >
              <Eye className="h-4 w-4 text-zinc-500" /> Ver Detalles
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-1 border-zinc-100 dark:border-zinc-800" />
          <DropdownMenuItem 
            onClick={() => handleAction('Eliminando registro')}
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer outline-none"
          >
            <Trash2 className="h-4 w-4" /> Eliminar Registro
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <VehiculoDetails 
        vehiculo={vehiculo} 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
      />
    </>
  );
}
