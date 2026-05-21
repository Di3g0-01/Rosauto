import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Printer, CheckCircle } from "lucide-react";

// Mock QR Code SVG component for authentic SAT visual replication
function SatQrCode() {
  return (
    <svg className="h-28 w-28 text-zinc-900 border border-zinc-200 p-1 bg-white rounded-md" viewBox="0 0 100 100">
      {/* Outer borders and position detection markers */}
      <rect x="0" y="0" width="20" height="20" fill="currentColor" />
      <rect x="3" y="3" width="14" height="14" fill="white" />
      <rect x="6" y="6" width="8" height="8" fill="currentColor" />

      <rect x="80" y="0" width="20" height="20" fill="currentColor" />
      <rect x="83" y="3" width="14" height="14" fill="white" />
      <rect x="86" y="6" width="8" height="8" fill="currentColor" />

      <rect x="0" y="80" width="20" height="20" fill="currentColor" />
      <rect x="3" y="83" width="14" height="14" fill="white" />
      <rect x="6" y="86" width="8" height="8" fill="currentColor" />

      {/* Internal mock data modules */}
      <rect x="30" y="5" width="10" height="5" fill="currentColor" />
      <rect x="45" y="10" width="5" height="15" fill="currentColor" />
      <rect x="60" y="2" width="15" height="5" fill="currentColor" />
      <rect x="10" y="30" width="5" height="10" fill="currentColor" />
      <rect x="25" y="35" width="20" height="5" fill="currentColor" />
      <rect x="55" y="30" width="10" height="10" fill="currentColor" />
      <rect x="75" y="25" width="5" height="15" fill="currentColor" />
      <rect x="5" y="55" width="15" height="5" fill="currentColor" />
      <rect x="25" y="50" width="5" height="20" fill="currentColor" />
      <rect x="35" y="65" width="15" height="5" fill="currentColor" />
      <rect x="60" y="55" width="20" height="5" fill="currentColor" />
      <rect x="70" y="45" width="5" height="20" fill="currentColor" />
      <rect x="35" y="80" width="25" height="5" fill="currentColor" />
      <rect x="45" y="90" width="15" height="5" fill="currentColor" />
      <rect x="75" y="80" width="10" height="10" fill="currentColor" />
    </svg>
  );
}

// 1. SAT TARJETA DE CIRCULACION DIALOG
export function SatTarjetaDialog({ 
  tarjeta, 
  isOpen, 
  onClose,
  onDecalGenerated
}: { 
  tarjeta: any; 
  isOpen: boolean; 
  onClose: () => void;
  onDecalGenerated?: () => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [showDecalOption, setShowDecalOption] = useState(false);
  const [generatedDecal, setGeneratedDecal] = useState<any>(null);

  if (!tarjeta) return null;

  const vehiculo = tarjeta.vehiculo || {};
  const propietario = tarjeta.propietario || {};
  
  // Modificado para preferir los datos de la tarjeta sobre los del vehículo
  const linea = tarjeta.linea_estilo || vehiculo.linea_estilo || {};
  const marca = linea.marca || {};
  const tipoUso = tarjeta.tipo_uso || vehiculo.tipo_uso || {};
  const color = tarjeta.color || {};

  // Variables combinadas (Fallback: Si la tarjeta no lo tiene guardado, usa el vehículo base)
  const renderPlaca = tarjeta.placa || vehiculo.placa || 'N/A';
  const renderMotor = tarjeta.num_motor || vehiculo.num_motor || 'N/A';
  const renderChasis = tarjeta.chasis || vehiculo.chasis || 'N/A';
  const renderVin = tarjeta.vin || vehiculo.vin || 'N/A';
  const renderModelo = tarjeta.a_o_modelo || tarjeta.año_modelo || vehiculo.a_o_modelo || vehiculo.año_modelo || 'N/A';
  const renderAsientos = tarjeta.asientos || vehiculo.asientos || 0;
  const renderEjes = tarjeta.ejes || vehiculo.ejes || 0;
  const renderCilindros = tarjeta.cilindros || vehiculo.cilindros || 0;
  const renderCc = tarjeta.cc || vehiculo.cc || 0;
  const renderTonelaje = tarjeta.tonelaje || vehiculo.tonelaje || 0;

  const handleGenerateDecal = async () => {
    setGenerating(true);
    try {
      const res = await axios.post("http://127.0.0.1:3002/calcomanias/generar", {
        numero_tarjeta: tarjeta.numero_tarjeta,
        anio: 2026
      });
      toast.success("¡Calcomanía Electrónica de Circulación generada con éxito!");
      
      // Consultar decal completo para ver detalles
      const detailsRes = await axios.get(`http://127.0.0.1:3002/calcomanias/${res.data.id_calcomania}`);
      setGeneratedDecal(detailsRes.data);
      setShowDecalOption(true);
      if (onDecalGenerated) onDecalGenerated();
    } catch (err: any) {
      console.error(err);
      toast.error("Error al generar la calcomanía electrónica");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] md:max-w-[1100px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-6 rounded-3xl overflow-y-auto max-h-[90vh]">
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Documento Oficial SAT de Circulación
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()} className="h-8 rounded-lg text-xs font-bold gap-2">
                <Printer className="h-3.5 w-3.5" /> Imprimir
              </Button>
            </div>
          </div>

          {/* SAT Card Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-2xl border border-zinc-200 shadow-lg text-zinc-800 font-mono text-[9px] leading-tight select-none">
            
            {/* LEFT CARD PANEL */}
            <div className="border border-zinc-300 p-4 rounded-xl flex flex-col justify-between bg-zinc-50 relative overflow-hidden">
              {/* SAT header */}
              <div className="flex justify-between items-center border-b-2 border-zinc-900 pb-2 mb-2">
                <div className="border-2 border-zinc-900 px-2 py-0.5 font-sans font-black text-sm italic tracking-tighter">
                  SAT
                </div>
                <div className="text-center font-sans font-bold text-[10px]">
                  TARJETA DE CIRCULACIÓN<br />
                  <span className="text-zinc-500">SAT - 4201</span><br />
                  <span className="text-xs text-zinc-900">No. {tarjeta.numero_tarjeta}</span>
                </div>
                {/* Mock Escudo Nacional de Guatemala */}
                <div className="h-8 w-8 rounded-full border border-zinc-400 bg-zinc-200/50 flex items-center justify-center text-[7px] text-zinc-500 font-sans text-center leading-none">
                  ESCUDO
                </div>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-12 gap-x-2 gap-y-1.5 py-2">
                <div className="col-span-4 border-b border-zinc-300 pb-0.5">
                  <span className="text-zinc-500">NIT:</span> <span className="font-bold">{propietario.nit_cui || tarjeta.nit_cui}</span>
                </div>
                <div className="col-span-8 border-b border-zinc-300 pb-0.5 truncate">
                  <span className="text-zinc-500">NOMBRE:</span> <span className="font-bold">{(propietario.nombres || 'N/A').toUpperCase()},_{(propietario.apellidos || '').toUpperCase()}</span>
                </div>

                <div className="col-span-12 border-b border-zinc-300 pb-0.5">
                  <span className="text-zinc-500">CUI:</span> <span className="font-bold">{propietario.nit_cui || tarjeta.nit_cui}</span>
                </div>

                <div className="col-span-4 border-b border-zinc-300 pb-0.5">
                  <span className="text-zinc-500">USO:</span> <span className="font-bold">{(tipoUso.nombre || 'N/A').toUpperCase()}</span>
                </div>
                <div className="col-span-4 border-b border-zinc-300 pb-0.5">
                  <span className="text-zinc-500">PLACA:</span> <span className="font-bold">{(vehiculo.placa || 'N/A').toUpperCase()}</span>
                </div>
                <div className="col-span-4 border-b border-zinc-300 pb-0.5">
                  <span className="text-zinc-500">MARCA:</span> <span className="font-bold">{(marca.nombre || 'N/A').toUpperCase()}</span>
                </div>

                <div className="col-span-4 border-b border-zinc-300 pb-0.5">
                  <span className="text-zinc-500">TIPO:</span> <span className="font-bold">{(tipoUso.nombre || 'N/A').toUpperCase()}</span>
                </div>
                <div className="col-span-4 border-b border-zinc-300 pb-0.5">
                  <span className="text-zinc-500">LINEA:</span> <span className="font-bold">{(linea.nombre || 'N/A').toUpperCase()}</span>
                </div>
                <div className="col-span-4 border-b border-zinc-300 pb-0.5">
                  <span className="text-zinc-500">MODELO:</span> <span className="font-bold">{vehiculo.a_o_modelo || vehiculo.año_modelo || 'N/A'}</span>
                </div>

                <div className="col-span-6 border-b border-zinc-300 pb-0.5 truncate">
                  <span className="text-zinc-500">CHASIS:</span> <span className="font-bold">{(vehiculo.chasis || 'N/A').toUpperCase()}</span>
                </div>
                <div className="col-span-6 border-b border-zinc-300 pb-0.5 truncate">
                  <span className="text-zinc-500">VIN:</span> <span className="font-bold">{(vehiculo.vin || 'N/A').toUpperCase()}</span>
                </div>

                <div className="col-span-6 border-b border-zinc-300 pb-0.5 truncate">
                  <span className="text-zinc-500">SERIE:</span> <span className="font-bold">{(vehiculo.chasis || 'N/A').toUpperCase()}</span>
                </div>
                <div className="col-span-6 border-b border-zinc-300 pb-0.5 truncate">
                  <span className="text-zinc-500">MOTOR:</span> <span className="font-bold">{(vehiculo.num_motor || 'N/A').toUpperCase()}</span>
                </div>

                <div className="col-span-12 grid grid-cols-5 gap-1 border-b border-zinc-300 pb-0.5">
                  <div>
                    <span className="text-zinc-500 block text-[7px]">ASIENTOS:</span>
                    <span className="font-bold">{vehiculo.asientos}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[7px]">EJES:</span>
                    <span className="font-bold">{vehiculo.ejes}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[7px]">CILINDROS:</span>
                    <span className="font-bold">{vehiculo.cilindros}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[7px]">C.C.:</span>
                    <span className="font-bold">{vehiculo.cc}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[7px]">TON.:</span>
                    <span className="font-bold">{vehiculo.tonelaje}</span>
                  </div>
                </div>

                <div className="col-span-12 border-b border-zinc-300 pb-0.5">
                  <span className="text-zinc-500">COLOR:</span> <span className="font-bold">{(color.nombre || vehiculo.color || 'N/A').toUpperCase()}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 mt-6 border-t border-zinc-200 pt-4 text-center text-[7px] text-zinc-500">
                <div className="flex flex-col items-center">
                  <span className="font-serif italic text-zinc-800 text-[10px] leading-none mb-1 font-bold">Miguel Cobet Toca</span>
                  <div className="h-0.5 w-24 bg-zinc-400 mb-1"></div>
                  <span>Jefe del Registro Fiscal de Vehículos - SAT</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-serif italic text-zinc-800 text-[10px] leading-none mb-1 font-bold">Otoniel Obdulio Sandoval</span>
                  <div className="h-0.5 w-24 bg-zinc-400 mb-1"></div>
                  <span>Jefe del Departamento de Tránsito de la PNC</span>
                </div>
              </div>
            </div>

            {/* RIGHT CARD PANEL (QR & barcode verification) */}
            <div className="border border-zinc-300 p-4 rounded-xl flex flex-col justify-between bg-zinc-50">
              <div className="text-center font-sans font-bold text-[10px] border-b-2 border-zinc-900 pb-2 mb-2">
                CÓDIGO ÚNICO IDENTIFICADOR<br />
                <span className="text-xs text-zinc-900">{propietario.nit_cui || tarjeta.nit_cui}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 py-4 justify-center">
                <SatQrCode />
                <div className="flex flex-col gap-1 text-[8px] text-zinc-500 bg-white p-3 rounded-lg border border-zinc-200 w-full sm:w-auto min-w-[150px]">
                  <div>
                    <span className="font-bold">Usuario:</span> {propietario.nit_cui || tarjeta.nit_cui}
                  </div>
                  <div>
                    <span className="font-bold">Fecha:</span> {new Date(tarjeta.fecha_emision).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-bold">Hora:</span> 12:38:5
                  </div>
                  <div>
                    <span className="font-bold">Fecha Reg:</span> {new Date(tarjeta.fecha_emision).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="text-[7px] text-zinc-500 space-y-2 border-t border-zinc-200 pt-4 font-sans text-justify">
                <p>
                  Artículo 20 del Acuerdo Gubernativo 134-2014 Reglamento de la Ley del Impuesto Sobre Circulación de Vehículos Terrestres, Marítimos y Aéreos y Artículo 10, literal a) del Acuerdo Gubernativo 273-98 Reglamento de la Ley de Tránsito.
                </p>
                <p className="break-all font-mono text-[6px] p-1 bg-zinc-200/50 rounded text-center">
                  6K2vTBHnndg=&DUSAZYJS0ndTmOM47flb2%2FBtW6JJYVgYmarQ9rlJapk%3D
                </p>
                <p className="font-bold border-t border-zinc-200 pt-2 text-center text-[7.5px] text-zinc-700">
                  Podrá verificar la autenticidad de este distintivo electrónico a través del Código QR que se consigna en la Tarjeta de Circulación.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons below the document */}
          <div className="mt-6 flex justify-end gap-3">
            {tarjeta.calcomania_pagada || showDecalOption ? (
              <Button 
                onClick={() => {
                  onClose();
                  // Si se generó en caliente, abrir modal decal directamente
                  if (generatedDecal) {
                    setGeneratedDecal(generatedDecal);
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                Tarjeta Emitida Correctamente
              </Button>
            ) : (
              <Button 
                onClick={handleGenerateDecal} 
                disabled={generating}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generando Calcomanía...
                  </>
                ) : (
                  "Generar Calcomanía Electrónica"
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Decal Viewer popup inside Card */}
      {showDecalOption && generatedDecal && (
        <SatCalcomaniaDialog 
          decal={generatedDecal} 
          isOpen={showDecalOption} 
          onClose={() => setShowDecalOption(false)} 
        />
      )}
    </>
  );
}

// 2. SAT CALCOMANIA DIALOG
export function SatCalcomaniaDialog({ 
  decal, 
  isOpen, 
  onClose 
}: { 
  decal: any; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!decal) return null;

  const tc = decal.tarjeta_circulacion || {};
  const vehiculo = tc.vehiculo || {};
  const propietario = tc.propietario || {};
  const linea = tc.linea_estilo || vehiculo.linea_estilo || {};
  const marca = linea.marca || {};
  const tipoUso = tc.tipo_uso || vehiculo.tipo_uso || {};
  const color = tc.color || {};

  const renderPlaca = tc.placa || vehiculo.placa || 'N/A';
  const renderColor = color.nombre || vehiculo.color || 'N/A';
  const renderNoTarjeta = tc.numero_tarjeta || 'N/A';
  const renderNoCertificado = tc.id_certificado || 'N/A';
  const renderTipoUso = (tipoUso.nombre || 'N/A').toUpperCase();
  const renderMarca = (marca.nombre || 'N/A').toUpperCase();
  const renderLinea = (linea.nombre || 'N/A').toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] md:max-w-[700px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-6 rounded-3xl overflow-y-auto max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-indigo-500" />
            Distintivo Calcomanía Electrónica
          </span>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="h-8 rounded-lg text-xs font-bold gap-2">
            <Printer className="h-3.5 w-3.5" /> Imprimir
          </Button>
        </div>

        {/* SAT Decal box layout */}
        <div className="bg-white p-5 rounded-2xl border-2 border-zinc-900 shadow-xl text-zinc-800 font-mono text-[9px] leading-tight select-none flex flex-col gap-4">
          
          {/* Top Panel box */}
          <div className="border-2 border-zinc-900 rounded-lg p-3 bg-zinc-50 flex flex-col divide-y-2 divide-zinc-950">
            <div className="flex justify-between items-center pb-2">
              <div className="flex flex-col">
                <div className="border border-zinc-900 px-2 py-0.5 font-sans font-black text-xs italic tracking-tighter w-fit">
                  SAT
                </div>
                <span className="text-[6px] text-zinc-500 font-sans mt-0.5">Guatemala / Centro América</span>
              </div>
              <div className="text-right font-sans font-bold text-[10px]">
                Calcomanía Electrónica<br />
                de Circulación (WEB)
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 pt-2 items-center">
              <div className="col-span-4 border-r-2 border-zinc-900 text-center py-2">
                <div className="text-[8px] text-zinc-500">Año</div>
                <div className="text-2xl font-sans font-black tracking-tight">{decal.anio}</div>
              </div>
              <div className="col-span-8 pl-3 py-2">
                <div className="text-[8px] text-zinc-500">Placa</div>
                <div className="text-2xl font-sans font-black tracking-tight">{renderPlaca}</div>
                <div className="mt-2 text-[8px]">
                  <span className="text-zinc-500 block">Nombre del propietario:</span>
                  <span className="font-bold">{(propietario.nombres || 'N/A').toUpperCase()} {(propietario.apellidos || '').toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Panel box (DATOS DEL VEHICULO) */}
          <div className="border-2 border-zinc-900 rounded-lg p-3 bg-zinc-50 grid grid-cols-12 gap-4">
            <div className="col-span-7 flex flex-col justify-between">
              <div>
                <div className="font-sans font-bold border-b border-zinc-400 pb-1 mb-2 text-[8.5px]">DATOS DEL VEHÍCULO</div>
                <div className="space-y-1 text-[8px]">
                  <div><span className="text-zinc-500">Tipo de vehículo:</span> <span className="font-bold">{renderTipoUso}</span></div>
                  <div><span className="text-zinc-500">Marca:</span> <span className="font-bold">{renderMarca}</span></div>
                  <div><span className="text-zinc-500">Línea:</span> <span className="font-bold">{renderLinea}</span></div>
                  <div><span className="text-zinc-500">Color:</span> <span className="font-bold">{renderColor}</span></div>
                  <div><span className="text-zinc-500">Número de tarjeta de circulación vigente:</span> <span className="font-bold">{renderNoTarjeta}</span></div>
                  <div><span className="text-zinc-500">Número de certificado de propiedad:</span> <span className="font-bold">{renderNoCertificado}</span></div>
                </div>
              </div>

              <div className="text-[6.5px] text-zinc-500 text-justify mt-4 leading-none">
                Portar esta calcomanía al circular con el vehículo; las autoridades competentes podrán solicitarla.
              </div>
            </div>

            <div className="col-span-5 flex flex-col justify-between items-center text-center pl-2 border-l border-zinc-200">
              <div className="w-full text-left space-y-1 text-[7.5px]">
                <div><span className="text-zinc-500">Código del vehículo:</span><br /><span className="font-bold">{vehiculo.id_vehiculo || 'N/A'} - {decal.id_calcomania}</span></div>
                <div><span className="text-zinc-500">Fecha de Impresión:</span><br /><span className="font-bold">{new Date(decal.fecha_pago).toLocaleDateString()}</span></div>
              </div>

              <div className="mt-4">
                <SatQrCode />
              </div>
            </div>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}
