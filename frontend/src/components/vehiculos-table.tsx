"use client";

import { useState, Fragment } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, History, CreditCard, AlertCircle, Plus, Users, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VehiculosActions } from "@/components/vehiculos-actions";
import { SatTarjetaDialog, SatCalcomaniaDialog } from "@/components/sat-document-dialogs";
import { QrCode } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { VehiculoCreate } from "@/components/vehiculo-create";

export function VehiculosTable({ vehiculos }: { vehiculos: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedVehiculoId, setExpandedVehiculoId] = useState<number | null>(null);
  const itemsPerPage = 30;
  const [selectedTarjeta, setSelectedTarjeta] = useState<any>(null);
  const [selectedCalcomania, setSelectedCalcomania] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Búsqueda progresiva en tiempo real por placa, modelo, año, marca, línea, color, tipo de uso, propietario
  const filteredVehiculos = vehiculos.filter(v => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return true;
    
    const marca = (v.linea_estilo?.marca?.nombre || "").toLowerCase();
    const linea = (v.linea_estilo?.nombre || "").toLowerCase();
    const placa = (v.placa || "").toLowerCase();
    const vin = (v.vin || "").toLowerCase();
    const color = (v.color || "").toLowerCase();
    const modelo = String(v.año_modelo || v.a_o_modelo || "").toLowerCase();
    const cui = (v.nit_cui || "").toLowerCase();
    const propNombres = (v.propietario?.nombres || "").toLowerCase();
    const propApellidos = (v.propietario?.apellidos || "").toLowerCase();
    const propCompleto = `${propNombres} ${propApellidos}`;
    const tipoUso = (v.tipo_uso?.nombre || "").toLowerCase();

    return placa.includes(s) ||
           vin.includes(s) ||
           marca.includes(s) ||
           linea.includes(s) ||
           color.includes(s) ||
           modelo.includes(s) ||
           cui.includes(s) ||
           propNombres.includes(s) ||
           propApellidos.includes(s) ||
           propCompleto.includes(s) ||
           tipoUso.includes(s);
  });

  const totalPages = Math.ceil(filteredVehiculos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVehiculos = filteredVehiculos.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Buscar por placa, marca, modelo, año, color o propietario..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-9 bg-white/50 dark:bg-zinc-950/50 border-zinc-300/50 dark:border-zinc-800/50 rounded-xl focus-visible:ring-indigo-500"
          />
        </div>
        <Button 
          onClick={() => setShowCreate(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 rounded-xl transition-all duration-300 gap-2 h-10 px-4 font-bold text-[11px]"
        >
          <Plus className="h-4 w-4" />
          Nuevo Vehículo
        </Button>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[65vh] custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/50 dark:bg-zinc-800/50 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-4 py-4 w-12 text-center"></th>
              <th className="px-6 py-4 font-medium">Placa</th>
              <th className="px-6 py-4 font-medium">Marca / Línea</th>
              <th className="px-6 py-4 font-medium">Color</th>
              <th className="px-6 py-4 font-medium">VIN</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
            {paginatedVehiculos.map((v: any) => {
              const isExpanded = expandedVehiculoId === v.id_vehiculo;
              return (
                <Fragment key={v.id_vehiculo}>
                  <tr 
                    onClick={() => setExpandedVehiculoId(isExpanded ? null : v.id_vehiculo)}
                    className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer select-none ${isExpanded ? 'bg-zinc-50/30 dark:bg-zinc-800/10' : ''}`}
                  >
                    <td className="px-4 py-4 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedVehiculoId(isExpanded ? null : v.id_vehiculo);
                        }}
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md font-mono text-xs font-bold">
                        {v.placa}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{v.linea_estilo?.marca?.nombre}</div>
                      <div className="text-xs text-zinc-500">{v.linea_estilo?.nombre} ({v.año_modelo || v.a_o_modelo})</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: v.color.toLowerCase() }}></div>
                        {v.color}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{v.vin}</td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <VehiculosActions vehiculo={v} />
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr key={`${v.id_vehiculo}-expanded`}>
                      <td colSpan={6} className="bg-zinc-50/40 dark:bg-zinc-900/10 p-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                          
                          {/* Col 1: Historial de Cambios Técnicos */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-zinc-500">
                              <History className="h-4 w-4 text-indigo-500" />
                              Bitácora de Cambios Técnicos ({v.historial_cambios?.length || 0})
                            </div>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {v.historial_cambios && v.historial_cambios.length > 0 ? (
                                v.historial_cambios.map((h: any) => (
                                  <div key={h.id_historial} className="relative pl-4 border-l border-indigo-500/30 py-1">
                                    <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-indigo-500 border border-white dark:border-zinc-900"></div>
                                    <div className="text-[9px] text-zinc-400 dark:text-zinc-500">
                                      {new Date(h.fecha_cambio).toLocaleDateString()} {new Date(h.fecha_cambio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-xs text-zinc-700 dark:text-zinc-300 mt-1 bg-white/60 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-200/30 dark:border-zinc-800/30 shadow-sm">
                                      {h.descripcion}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="flex items-center gap-2 p-4 text-xs text-zinc-500 bg-zinc-100/50 dark:bg-zinc-800/20 rounded-xl border border-zinc-200/30 dark:border-zinc-800/30">
                                  <AlertCircle className="h-4 w-4" />
                                  No hay cambios técnicos registrados aún para este vehículo.
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Col 2: Historial de Tarjetas de Circulación */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-zinc-500">
                              <CreditCard className="h-4 w-4 text-emerald-500" />
                              Tarjetas de Circulación Emitidas ({v.tarjeta_circulacion?.length || 0})
                            </div>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {v.tarjeta_circulacion && v.tarjeta_circulacion.length > 0 ? (
                                v.tarjeta_circulacion.map((tc: any) => (
                                  <div 
                                    key={tc.numero_tarjeta} 
                                    onClick={() => setSelectedTarjeta({ ...tc, vehiculo: v })}
                                    className={`p-3 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md ${
                                      tc.estado === 'A' 
                                        ? 'bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-500/5 dark:border-emerald-500/20 shadow-md shadow-emerald-500/5 hover:border-emerald-500/50' 
                                        : 'bg-zinc-100/50 border-zinc-200/50 dark:bg-zinc-900/40 dark:border-zinc-800/50 opacity-75 hover:opacity-100 hover:border-indigo-500/30'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                            Nº {tc.numero_tarjeta}
                                          </span>
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                            tc.estado === 'A' 
                                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' 
                                              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                          }`}>
                                            {tc.estado === 'A' ? 'ACTIVA' : 'INACTIVA'}
                                          </span>
                                        </div>
                                        <div className="text-[10px] text-zinc-500 mt-1 flex flex-col gap-0.5">
                                          <span>Emitida: {new Date(tc.fecha_emision).toLocaleDateString()}</span>
                                          <span>Propietario: {tc.propietario ? `${tc.propietario.nombres} ${tc.propietario.apellidos}` : 'N/A'} ({tc.nit_cui})</span>
                                          <span>Color: {tc.color?.nombre || 'N/A'} | Uso: {tc.tipo_uso?.nombre || 'N/A'}</span>
                                        </div>
                                      </div>
                                      
                                      {tc.calcomania && tc.calcomania.length > 0 ? (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-8 text-[10px] px-2 shrink-0 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 self-center"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCalcomania({ ...tc.calcomania[0], tarjeta_circulacion: { ...tc, vehiculo: v } });
                                          }}
                                        >
                                          <QrCode className="h-3 w-3 mr-1 text-emerald-500" />
                                          Ver Calcomanía
                                        </Button>
                                      ) : tc.calcomania_pagada ? (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-8 text-[10px] px-2 shrink-0 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 self-center"
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                              toast.info("Generando calcomanía...");
                                              await axios.post("http://127.0.0.1:3002/calcomanias/generar", {
                                                numero_tarjeta: tc.numero_tarjeta,
                                                anio: new Date().getFullYear(),
                                                monto_pagado: 150.00
                                              });
                                              toast.success("Calcomanía generada exitosamente");
                                              window.location.reload();
                                            } catch (err) {
                                              console.error(err);
                                              toast.error("Error al generar calcomanía");
                                            }
                                          }}
                                        >
                                          <QrCode className="h-3 w-3 mr-1" />
                                          Generar Calcomanía
                                        </Button>
                                      ) : null}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="flex items-center gap-2 p-4 text-xs text-zinc-500 bg-zinc-100/50 dark:bg-zinc-800/20 rounded-xl border border-zinc-200/30 dark:border-zinc-800/30">
                                  <AlertCircle className="h-4 w-4" />
                                  No hay tarjetas de circulación emitidas para este vehículo.
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Col 3: Historial de Propietarios */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-zinc-500">
                              <Users className="h-4 w-4 text-purple-500" />
                              Historial de Propietarios
                            </div>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {(() => {
                                // Deduplicar por nit_cui — cada propietario único que tuvo este vehículo
                                const seen = new Set<string>();
                                const propietariosHistorial: any[] = [];
                                (v.tarjeta_circulacion || []).forEach((tc: any) => {
                                  if (tc.nit_cui && !seen.has(tc.nit_cui)) {
                                    seen.add(tc.nit_cui);
                                    propietariosHistorial.push(tc);
                                  }
                                });
                                
                                if (propietariosHistorial.length === 0) {
                                  return (
                                    <div className="flex items-center gap-2 p-4 text-xs text-zinc-500 bg-zinc-100/50 dark:bg-zinc-800/20 rounded-xl border border-zinc-200/30 dark:border-zinc-800/30">
                                      <AlertCircle className="h-4 w-4" />
                                      No hay historial de propietarios registrado.
                                    </div>
                                  );
                                }

                                return propietariosHistorial.map((tc: any, idx: number) => {
                                  const esActual = tc.nit_cui === v.nit_cui;
                                  return (
                                    <div
                                      key={tc.nit_cui}
                                      className={`relative pl-4 border-l py-1 ${esActual ? 'border-purple-500/60' : 'border-zinc-300/40 dark:border-zinc-700/40'}`}
                                    >
                                      <div className={`absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border border-white dark:border-zinc-900 ${esActual ? 'bg-purple-500' : 'bg-zinc-400 dark:bg-zinc-600'}`}></div>
                                      <div className={`p-2.5 rounded-xl border text-xs shadow-sm ${
                                        esActual
                                          ? 'bg-purple-500/10 border-purple-500/30 dark:bg-purple-500/5 dark:border-purple-500/20'
                                          : 'bg-white/60 dark:bg-zinc-900/40 border-zinc-200/30 dark:border-zinc-800/30'
                                      }`}>
                                        <div className="flex items-center gap-1.5 mb-1">
                                          <User className="h-3 w-3 text-zinc-400" />
                                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                            {tc.propietario
                                              ? `${tc.propietario.nombres} ${tc.propietario.apellidos}`
                                              : tc.nit_cui}
                                          </span>
                                          {esActual && (
                                            <span className="ml-auto px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[9px] font-bold">ACTUAL</span>
                                          )}
                                        </div>
                                        <div className="text-[10px] text-zinc-500 font-mono">{tc.nit_cui}</div>
                                        <div className="text-[10px] text-zinc-400 mt-0.5">
                                          Desde: {new Date(tc.fecha_emision).toLocaleDateString()}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {paginatedVehiculos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                  No se encontraron vehículos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-900/30">
          <p className="text-xs text-zinc-500">
            Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredVehiculos.length)} de {filteredVehiculos.length} vehículos
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

      {selectedTarjeta && (
        <SatTarjetaDialog 
          tarjeta={selectedTarjeta} 
          isOpen={!!selectedTarjeta} 
          onClose={() => setSelectedTarjeta(null)}
          onDecalGenerated={() => {
            window.location.reload();
          }}
        />
      )}

      {selectedCalcomania && (
        <SatCalcomaniaDialog 
          decal={selectedCalcomania} 
          isOpen={!!selectedCalcomania} 
          onClose={() => setSelectedCalcomania(null)}
        />
      )}

      {showCreate && (
        <VehiculoCreate 
          isOpen={showCreate} 
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
