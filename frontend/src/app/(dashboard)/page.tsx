import Link from "next/link";
import { CarFront, FileText, Activity, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardTable } from "@/components/dashboard-table";

async function getTarjetas() {
  try {
    const res = await fetch("http://127.0.0.1:3002/tarjetas-circulacion", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch (error) {
    console.error("Error fetching tarjetas:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const tarjetas = await getTarjetas();

  const activas = tarjetas.filter((t: any) => t.estado === 'A').length;
  const inactivas = tarjetas.filter((t: any) => t.estado === 'I').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-400">
            Panel de Control
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Resumen general de Tarjetas de Circulación de Rosautos.
          </p>
        </div>
        <Link href="/tarjetas/nueva">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 gap-2 rounded-xl h-11 px-6">
            <Plus className="h-4 w-4" />
            Generar Tarjeta
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-lg flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><FileText className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Total Tarjetas</p>
            <h3 className="text-2xl font-bold">{tarjetas.length}</h3>
          </div>
        </div>
        <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-lg flex items-center gap-4">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><Activity className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Activas</p>
            <h3 className="text-2xl font-bold">{activas}</h3>
          </div>
        </div>
        <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-lg flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl"><CarFront className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Inactivas</p>
            <h3 className="text-2xl font-bold">{inactivas}</h3>
          </div>
        </div>
      </div>

      <DashboardTable tarjetas={tarjetas} />
    </div>
  );
}
