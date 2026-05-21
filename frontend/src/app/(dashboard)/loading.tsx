import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center shadow-inner">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        </div>
        <p className="text-zinc-500 font-medium animate-pulse">Cargando datos del sistema...</p>
      </div>
    </div>
  );
}
