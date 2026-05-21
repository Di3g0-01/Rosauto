"use client";

import { useState, useEffect, useCallback } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropietariosTable } from "@/components/propietarios-table";
import { PropietarioCreate } from "@/components/propietario-create";

export default function PropietariosPage() {
  const [propietarios, setPropietarios] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const fetchPropietarios = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:3002/propietarios", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPropietarios(data);
    } catch (error) {
      console.error("Error fetching propietarios:", error);
    }
  }, []);

  useEffect(() => {
    fetchPropietarios();
  }, [fetchPropietarios]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-400">
            Gestión de Propietarios
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Listado de personas registradas como dueños de vehículos.
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 gap-2 rounded-xl h-11 px-6"
        >
          <UserPlus className="h-4 w-4" />
          Nuevo Propietario
        </Button>
      </div>

      <PropietariosTable propietarios={propietarios} />

      <PropietarioCreate
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={() => {
          setShowCreate(false);
          fetchPropietarios();
        }}
      />
    </div>
  );
}
