"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PropietariosActions } from "@/components/propietarios-actions";

export function PropietariosTable({ propietarios }: { propietarios: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const filteredPropietarios = propietarios.filter(p => 
    p.nit_cui.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPropietarios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPropietarios = filteredPropietarios.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Buscar por NIT o nombre..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-9 bg-white/50 dark:bg-zinc-950/50 border-zinc-300/50 dark:border-zinc-800/50 rounded-xl focus-visible:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/50 dark:bg-zinc-800/50 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-6 py-4 font-medium">NIT / CUI</th>
              <th className="px-6 py-4 font-medium">Nombre Completo</th>
              <th className="px-6 py-4 font-medium">Dirección</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
            {paginatedPropietarios.map((p: any) => (
              <tr key={p.nit_cui} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {p.nit_cui}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">{p.nombres} {p.apellidos}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <MapPin className="h-3 w-3" />
                    {p.direccion}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <PropietariosActions propietario={p} />
                </td>
              </tr>
            ))}
            {paginatedPropietarios.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                  No se encontraron propietarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-900/30">
          <p className="text-xs text-zinc-500">
            Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPropietarios.length)} de {filteredPropietarios.length} propietarios
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
