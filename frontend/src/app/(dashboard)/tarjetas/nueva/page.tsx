"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

import { CustomCombobox } from "@/components/custom-combobox";

export default function NuevaTarjetaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vehiculos, setVehiculos] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState("");
  const [selectedPropietario, setSelectedPropietario] = useState("");

  useEffect(() => {
    // Fetch options
    Promise.all([
      axios.get("http://127.0.0.1:3002/vehiculos"),
      axios.get("http://127.0.0.1:3002/propietarios")
    ]).then(([resVehiculos, resPropietarios]) => {
      setVehiculos(resVehiculos.data);
      setPropietarios(resPropietarios.data);
    }).catch(err => console.error("Error fetching data", err));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedVehiculo || !selectedPropietario) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    setLoading(true);
    
    try {
      await axios.post("http://127.0.0.1:3002/tarjetas-circulacion", {
        id_vehiculo: parseInt(selectedVehiculo),
        nit_cui: selectedPropietario,
        id_tipo_uso: 1, // Defaulting for now
        id_color: 1 // Defaulting for now
      });
      toast.success("Tarjeta generada con éxito");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error creating card:", error);
      toast.error("Hubo un error al generar la tarjeta");
    } finally {
      setLoading(false);
    }
  };

  const vehiculosOptions = vehiculos.map((v: any) => ({
    value: v.id_vehiculo.toString(),
    label: `${v.placa} - ${v.vin} (${v.color})`
  }));

  const propietariosOptions = propietarios.map((p: any) => ({
    value: p.nit_cui,
    label: `${p.nit_cui} - ${p.nombres} ${p.apellidos}`
  }));

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generar Tarjeta</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Emisión de nueva tarjeta de circulación.</p>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 rounded-3xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Vehículo (VIN / Placa)</label>
            <CustomCombobox
              options={vehiculosOptions}
              value={selectedVehiculo}
              onChange={setSelectedVehiculo}
              placeholder="Buscar vehículo..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Propietario (NIT/CUI)</label>
            <CustomCombobox
              options={propietariosOptions}
              value={selectedPropietario}
              onChange={setSelectedPropietario}
              placeholder="Buscar propietario..."
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 rounded-xl transition-all duration-300"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Emitir Tarjeta de Circulación</>}
          </Button>
        </form>
      </div>
    </div>
  );
}
