"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Power, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export function ActivateButton({ numeroTarjeta }: { numeroTarjeta: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleActivate = async () => {
    setLoading(true);
    try {
      await axios.patch(`http://127.0.0.1:3002/tarjetas-circulacion/${numeroTarjeta}/activar`);
      toast.success("Tarjeta activada correctamente");
      router.refresh();
    } catch (error) {
      console.error("Error activating:", error);
      toast.error("Error al activar la tarjeta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-zinc-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors rounded-lg"
      onClick={handleActivate}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
    </Button>
  );
}
