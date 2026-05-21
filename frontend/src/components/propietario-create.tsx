"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserPlus, Loader2, User, Hash, MapPin, Calendar, Lock, AtSign } from "lucide-react";

interface PropietarioCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const API = "http://127.0.0.1:3002";

export function PropietarioCreate({ isOpen, onClose, onSuccess }: PropietarioCreateProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nit_cui: "",
    nombres: "",
    apellidos: "",
    direccion: "",
    fecha_nacimiento: "",
    username: "",
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nit_cui.trim()) return toast.error("El NIT/CUI es requerido");
    if (!form.nombres.trim()) return toast.error("El nombre es requerido");
    if (!form.apellidos.trim()) return toast.error("Los apellidos son requeridos");
    if (!form.direccion.trim()) return toast.error("La dirección es requerida");
    if (!form.fecha_nacimiento) return toast.error("La fecha de nacimiento es requerida");
    if (!form.username.trim()) return toast.error("El usuario es requerido");
    if (!form.password.trim()) return toast.error("La contraseña es requerida");

    setLoading(true);
    try {
      const res = await fetch(`${API}/propietarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Error al registrar propietario");
      }

      toast.success("Propietario registrado exitosamente");
      onSuccess();
      onClose();
      setForm({
        nit_cui: "",
        nombres: "",
        apellidos: "",
        direccion: "",
        fecha_nacimiento: "",
        username: "",
        password: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Error al registrar propietario");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: "nit_cui",          label: "NIT / CUI",          placeholder: "1234567890123",      icon: Hash,     type: "text" },
    { id: "nombres",          label: "Nombres",             placeholder: "Juan Carlos",        icon: User,     type: "text" },
    { id: "apellidos",        label: "Apellidos",           placeholder: "García López",       icon: User,     type: "text" },
    { id: "direccion",        label: "Dirección",           placeholder: "4a Calle 5-67 Z.1",  icon: MapPin,   type: "text" },
    { id: "fecha_nacimiento", label: "Fecha de Nacimiento", placeholder: "",                   icon: Calendar, type: "date" },
    { id: "username",         label: "Usuario (login)",     placeholder: "juan.garcia",        icon: AtSign,   type: "text" },
    { id: "password",         label: "Contraseña",          placeholder: "••••••••",           icon: Lock,     type: "password" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl shadow-2xl overflow-hidden p-0">
        {/* Header gradient */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-end">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
              <UserPlus className="h-7 w-7 text-white" />
            </div>
            <div className="text-white">
              <DialogTitle className="text-xl font-bold tracking-tight">
                Nuevo Propietario
              </DialogTitle>
              <DialogDescription className="text-blue-100/80 text-sm">
                Registrar un nuevo propietario en el sistema
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {fields.map(({ id, label, placeholder, icon: Icon, type }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                  <Icon className="h-3 w-3" />
                  {label}
                </Label>
                <Input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={form[id as keyof typeof form]}
                  onChange={(e) => handleChange(id, e.target.value)}
                  className="bg-zinc-50/80 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 rounded-xl focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
                  disabled={loading}
                />
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-200/50 dark:border-zinc-800/50 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 gap-2"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Registrando...</>
              ) : (
                <><UserPlus className="h-4 w-4" /> Registrar Propietario</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
