"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, QrCode, FileText, Calendar, User, Printer, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SatCalcomaniaDialog } from "@/components/sat-document-dialogs";

export default function CalcomaniasPage() {
  const [decals, setDecals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDecal, setSelectedDecal] = useState<any>(null);

  useEffect(() => {
    fetchDecals();
  }, []);

  const fetchDecals = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:3002/calcomanias");
      setDecals(res.data);
    } catch (err) {
      console.error("Error loading calcomanias:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDecals = decals.filter(d => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return true;

    const placa = (d.tarjeta_circulacion?.vehiculo?.placa || d.tarjeta_circulacion?.placa || "").toLowerCase();
    const propietario = d.tarjeta_circulacion?.propietario 
      ? `${d.tarjeta_circulacion.propietario.nombres} ${d.tarjeta_circulacion.propietario.apellidos}`.toLowerCase() 
      : "";
    const marca = (d.tarjeta_circulacion?.vehiculo?.linea_estilo?.marca?.nombre || "").toLowerCase();
    const linea = (d.tarjeta_circulacion?.vehiculo?.linea_estilo?.nombre || "").toLowerCase();
    const numero_tarjeta = (d.numero_tarjeta || "").toLowerCase();

    return placa.includes(s) || propietario.includes(s) || marca.includes(s) || linea.includes(s) || numero_tarjeta.includes(s);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
            Calcomanías Electrónicas
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Módulo oficial de consulta e impresión de distintivos de circulación (SAT)
          </p>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <Input 
            placeholder="Buscar por placa, propietario, marca, nº tarjeta..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 bg-white/60 dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl focus-visible:ring-emerald-500/20 backdrop-blur-md"
          />
        </div>
        <Button 
          variant="outline"
          onClick={fetchDecals}
          className="h-11 rounded-2xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md"
        >
          Refrescar
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-52 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredDecals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecals.map((decal) => {
            const tc = decal.tarjeta_circulacion || {};
            const vehiculo = tc.vehiculo || {};
            const propietario = tc.propietario || {};
            const linea = vehiculo.linea_estilo || {};
            const marca = linea.marca || {};

            return (
              <div 
                key={decal.id_calcomania}
                onClick={() => setSelectedDecal(decal)}
                className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:border-emerald-500/30 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-105 transition-all">
                      <QrCode className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                      {decal.estado}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1 font-bold">
                      <Calendar className="h-3 w-3" />
                      Circulación {decal.anio}
                    </div>
                    <div className="font-black text-2xl text-zinc-800 dark:text-white tracking-tight mt-1 flex items-center gap-2">
                      {vehiculo.placa || 'N/A'}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5 truncate font-medium">
                      {marca.nombre} {linea.nombre} ({vehiculo.a_o_modelo || vehiculo.año_modelo})
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-4 mt-4 flex items-center justify-between text-zinc-500">
                  <div className="flex items-center gap-2 truncate">
                    <User className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-[11px] truncate font-semibold dark:text-zinc-300">
                      {propietario.nombres} {propietario.apellidos}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                    Card: {decal.numero_tarjeta}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State with detailed instruction */
        <div className="flex flex-col items-center justify-center p-12 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl text-center max-w-xl mx-auto shadow-sm backdrop-blur-md">
          <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700/50 mb-4 shadow-sm">
            <QrCode className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
            No hay calcomanías electrónicas
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-2 max-w-sm leading-relaxed">
            Las calcomanías se generan al registrar el pago de impuesto de circulación. 
          </p>
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl p-3.5 text-[11px] text-left mt-6 flex items-start gap-2.5 font-medium leading-relaxed">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">¿Cómo generar una?</span> Ve al módulo de <span className="font-bold">Vehículos</span>, abre los detalles desplegables de un vehículo, haz clic en una de sus <span className="font-bold">Tarjetas de Circulación</span> y pulsa el botón verde de generación.
            </div>
          </div>
        </div>
      )}

      {/* Sat Calcomania Dialog view */}
      {selectedDecal && (
        <SatCalcomaniaDialog
          decal={selectedDecal}
          isOpen={!!selectedDecal}
          onClose={() => setSelectedDecal(null)}
        />
      )}
    </div>
  );
}
