import { FileText, Plus, History, ArrowRightLeft, CarFront, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TramitesTable } from "@/components/tramites-table";

async function getTramites() {
  try {
    const res = await fetch("http://127.0.0.1:3002/tramites", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch (error) {
    console.error("Error fetching tramites:", error);
    return [];
  }
}

export default async function TramitesPage() {
  const tramites = await getTramites();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-400">
            Historial de Trámites
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Registro de todas las gestiones y cambios realizados.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/tramites/traspaso">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 gap-2 rounded-xl h-11 px-6">
              <ArrowRightLeft className="h-4 w-4" />
              Nuevo Traspaso
            </Button>
          </Link>
          <Link href="/tramites/cambio-motor">
            <Button variant="outline" className="border-zinc-300 dark:border-zinc-800 transition-all duration-300 gap-2 rounded-xl h-11 px-6">
              <CarFront className="h-4 w-4" />
              Cambio de Motor
            </Button>
          </Link>
          <Link href="/tramites/cambio-color">
            <Button variant="outline" className="border-zinc-300 dark:border-zinc-800 transition-all duration-300 gap-2 rounded-xl h-11 px-6">
              <Activity className="h-4 w-4" />
              Cambio de Color
            </Button>
          </Link>
          <Link href="/tramites/cambio-chasis">
            <Button variant="outline" className="border-zinc-300 dark:border-zinc-800 transition-all duration-300 gap-2 rounded-xl h-11 px-6">
              <ShieldCheck className="h-4 w-4" />
              Cambio de Chasis
            </Button>
          </Link>
        </div>
      </div>

      <TramitesTable tramites={tramites} />
    </div>
  );
}
