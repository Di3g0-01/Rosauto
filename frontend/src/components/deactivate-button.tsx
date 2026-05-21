"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { PowerOff, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export function DeactivateButton({ numeroTarjeta }: { numeroTarjeta: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await axios.patch(`http://127.0.0.1:3002/tarjetas-circulacion/${numeroTarjeta}/desactivar`, {
        reason: "Impago o Vencimiento (Desactivación Manual)"
      });
      toast.success("Tarjeta desactivada correctamente");
      router.refresh();
    } catch (error) {
      console.error("Error deactivating:", error);
      toast.error("Error al desactivar la tarjeta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors rounded-lg"
      onClick={handleDeactivate}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PowerOff className="h-4 w-4" />}
    </Button>
  );
}
