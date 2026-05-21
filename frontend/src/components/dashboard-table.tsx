"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeactivateButton } from "@/components/deactivate-button";
import { ActivateButton } from "@/components/activate-button";

export function DashboardTable({ tarjetas }: { tarjetas: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const totalPages = Math.ceil(tarjetas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTarjetas = tarjetas.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="p-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <h2 className="text-xl font-semibold">Tarjetas de Circulación</h2>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/50 dark:bg-zinc-800/50 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-6 py-4 font-medium">No. Tarjeta</th>
              <th className="px-6 py-4 font-medium">Placa</th>
              <th className="px-6 py-4 font-medium">Propietario</th>
              <th className="px-6 py-4 font-medium">Emisión</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
            {paginatedTarjetas.map((tarjeta: any) => (
              <tr key={tarjeta.numero_tarjeta} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4 font-medium">{tarjeta.numero_tarjeta}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md font-mono text-xs">
                    {tarjeta.vehiculo?.placa}
                  </span>
                </td>
                <td className="px-6 py-4">{tarjeta.propietario?.nombres} {tarjeta.propietario?.apellidos}</td>
                <td className="px-6 py-4 text-zinc-500">
                  {format(new Date(tarjeta.fecha_emision), "d MMM, yyyy", { locale: es })}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    tarjeta.estado === 'A' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                  }`}>
                    {tarjeta.estado === 'A' ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {tarjeta.estado === 'A' ? (
                    <DeactivateButton numeroTarjeta={tarjeta.numero_tarjeta} />
                  ) : (
                    <ActivateButton numeroTarjeta={tarjeta.numero_tarjeta} />
                  )}
                </td>
              </tr>
            ))}
            {paginatedTarjetas.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                  No hay tarjetas de circulación registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-900/30">
          <p className="text-xs text-zinc-500">
            Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, tarjetas.length)} de {tarjetas.length} tarjetas
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
