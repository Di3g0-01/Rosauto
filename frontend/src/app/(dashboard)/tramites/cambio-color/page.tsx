"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Activity } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

import { CustomCombobox } from "@/components/custom-combobox";

export default function CambioColorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tarjetas, setTarjetas] = useState([]);
  const [selectedTarjeta, setSelectedTarjeta] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:3002/tarjetas-circulacion")
      .then((res) => setTarjetas(res.data))
      .catch(err => console.error("Error fetching tarjetas", err));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedTarjeta) {
      toast.error("Seleccione una tarjeta de circulación");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      await axios.post("http://127.0.0.1:3002/tramites/cambio-color", {
        numero_tarjeta: selectedTarjeta,
        nuevo_color: data.nuevo_color as string,
        descripcion: data.descripcion
      });
      toast.success("Cambio de color realizado con éxito");
      router.push("/tramites");
      router.refresh();
    } catch (error) {
      console.error("Error changing color:", error);
      toast.error("Hubo un error al realizar el cambio de color");
    } finally {
      setLoading(false);
    }
  };

  const tarjetasOptions = tarjetas
    .filter((t: any) => t.estado === 'A')
    .map((t: any) => ({
      value: t.numero_tarjeta,
      label: `${t.numero_tarjeta} - ${t.vehiculo?.placa} (Color actual: ${t.color?.nombre || 'N/A'})`
    }));

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/tramites">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cambio de Color</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Actualización del color del vehículo.</p>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 rounded-3xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tarjeta de Circulación</label>
            <CustomCombobox
              options={tarjetasOptions}
              value={selectedTarjeta}
              onChange={setSelectedTarjeta}
              placeholder="Buscar tarjeta..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nuevo Color</label>
            <input 
              name="nuevo_color" 
              required
              placeholder="Ej: Rojo Perlado"
              className="w-full h-11 px-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descripción (Opcional)</label>
            <textarea 
              name="descripcion" 
              placeholder="Notas adicionales sobre el cambio de color..."
              className="w-full p-3 min-h-[100px] rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 rounded-xl transition-all duration-300"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Activity className="mr-2 h-4 w-4" /> Registrar Cambio de Color</>}
          </Button>
        </form>
      </div>
    </div>
  );
}
