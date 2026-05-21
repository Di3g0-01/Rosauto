import { CarFront, Plus, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehiculosTable } from "@/components/vehiculos-table";

async function getVehiculos() {
  try {
    const res = await fetch("http://127.0.0.1:3002/vehiculos", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch (error) {
    console.error("Error fetching vehiculos:", error);
    return [];
  }
}

export default async function VehiculosPage() {
  const vehiculos = await getVehiculos();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-400">
            Inventario de Vehículos
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Gestiona los automóviles registrados en el sistema.
          </p>
        </div>
      </div>

      <VehiculosTable vehiculos={vehiculos} />
    </div>
  );
}
