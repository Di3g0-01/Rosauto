"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TramitesTable({ tramites }: { tramites: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const totalPages = Math.ceil(tramites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTramites = tramites.slice(startIndex, startIndex + itemsPerPage);

  if (tramites.length === 0) {
    return (
      <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-20 text-center flex flex-col items-center">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
            <History className="h-8 w-8 text-zinc-400" />
          </div>
          <p className="text-zinc-500">No se han realizado trámites recientemente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/50 dark:bg-zinc-800/50 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-6 py-4 font-medium">Fecha</th>
              <th className="px-6 py-4 font-medium">Tipo de Trámite</th>
              <th className="px-6 py-4 font-medium">Tarjeta</th>
              <th className="px-6 py-4 font-medium">Descripción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
            {paginatedTramites.map((tramite: any) => (
              <tr key={tramite.id_tramite} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4 text-zinc-500">
                  {format(new Date(tramite.fecha_tramite), "d MMM, yyyy HH:mm", { locale: es })}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 rounded-lg text-xs font-medium">
                    {tramite.tipo_tramite}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono font-bold">{tramite.numero_tarjeta}</td>
                <td className="px-6 py-4 text-zinc-500 max-w-xs truncate">{tramite.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-900/30">
          <p className="text-xs text-zinc-500">
            Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, tramites.length)} de {tramites.length} trámites
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 rounded-lg"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 rounded-lg"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
