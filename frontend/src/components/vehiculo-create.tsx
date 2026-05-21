import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Plus, CarFront, ChevronDown, CheckCircle, UserPlus } from "lucide-react";

// CUSTOM SELECT REPLACEMENT: Styles option drop-downs purely with HTML overlay to avoid browser/OS defaults
function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder,
  disabled
}: { 
  value: any; 
  onChange: (val: any) => void; 
  options: { value: any; label: string }[]; 
  placeholder: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const activeOption = options.find(o => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-full rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm px-3 pr-8 flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-emerald-500 focus-visible:ring-1 text-zinc-900 dark:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <span className="truncate">{activeOption ? activeOption.label : placeholder}</span>
        <ChevronDown className="pointer-events-none h-4 w-4 text-zinc-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl py-1 shadow-xl z-[70] custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-100">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-xs text-zinc-500 italic">Sin opciones</div>
            ) : (
              options.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors flex items-center justify-between cursor-pointer ${
                    opt.value === value ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold" : "text-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function VehiculoCreate({ 
  isOpen, 
  onClose,
  onSuccess
}: { 
  isOpen: boolean, 
  onClose: () => void,
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    placa: "",
    vin: "",
    num_motor: "",
    color: "",
    cc: 1600,
    cilindros: 4,
    asientos: 5,
    ejes: 2,
    tonelaje: 1.5,
    chasis: "",
    a_o_modelo: new Date().getFullYear(),
    id_linea: "",
    id_tipo_uso: "",
    nit_cui: ""
  });
  const [metadata, setMetadata] = useState<any>({ marcas: [], tiposUso: [], propietarios: [] });
  const [selectedMarca, setSelectedMarca] = useState<number | "">("");

  // Controladores para propietario dinámico por texto
  const [propietarioExistente, setPropietarioExistente] = useState<any>(null);
  const [nuevoPropietarioNombres, setNuevoPropietarioNombres] = useState("");
  const [nuevoPropietarioApellidos, setNuevoPropietarioApellidos] = useState("");
  const [nuevoPropietarioDireccion, setNuevoPropietarioDireccion] = useState("");
  const [nuevoPropietarioFechaNacimiento, setNuevoPropietarioFechaNacimiento] = useState("");
  const [nuevoUsuarioUsername, setNuevoUsuarioUsername] = useState("");
  const [nuevoUsuarioPassword, setNuevoUsuarioPassword] = useState("");

  // Soporte para marcas y líneas libres/nuevas
  const [customMarca, setCustomMarca] = useState(false);
  const [customLinea, setCustomLinea] = useState(false);
  const [nuevoMarcaNombre, setNuevoMarcaNombre] = useState("");
  const [nuevoLineaNombre, setNuevoLineaNombre] = useState("");

  useEffect(() => {
    if (isOpen) {
      axios.get("http://127.0.0.1:3002/vehiculos/meta/datos")
        .then(res => {
          setMetadata(res.data);
        })
        .catch(err => console.error("Error loading vehicle metadata:", err));
      
      // Reset form states
      setFormData({
        placa: "",
        vin: "",
        num_motor: "",
        color: "",
        cc: 1600,
        cilindros: 4,
        asientos: 5,
        ejes: 2,
        tonelaje: 1.5,
        chasis: "",
        a_o_modelo: new Date().getFullYear(),
        id_linea: "",
        id_tipo_uso: "",
        nit_cui: ""
      });
      setSelectedMarca("");
      setCustomMarca(false);
      setCustomLinea(false);
      setNuevoMarcaNombre("");
      setNuevoLineaNombre("");
      setPropietarioExistente(null);
      setNuevoPropietarioNombres("");
      setNuevoPropietarioApellidos("");
      setNuevoPropietarioDireccion("");
      setNuevoPropietarioFechaNacimiento("");
      setNuevoUsuarioUsername("");
      setNuevoUsuarioPassword("");
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: (name === 'cc' || name === 'cilindros' || name === 'asientos' || name === 'ejes' || name === 'a_o_modelo')
        ? (value === '' ? '' : parseInt(value) || value)
        : name === 'tonelaje' 
          ? (value === '' ? '' : value) // Keep as string temporarily so decimals work smoothly, parsed on submit
          : value
    }));
  };

  const handleMarcaChange = (marcaId: number) => {
    setSelectedMarca(marcaId);
    
    const brand = metadata.marcas.find((m: any) => m.id_marca === marcaId);
    if (brand && brand.linea_estilo && brand.linea_estilo.length > 0) {
      setFormData((prev: any) => ({
        ...prev,
        id_linea: brand.linea_estilo[0].id_linea
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        id_linea: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Crear nuevo propietario en caliente si no existe
      if (!propietarioExistente) {
        if (!nuevoPropietarioNombres || !nuevoPropietarioApellidos || !nuevoPropietarioDireccion || !nuevoPropietarioFechaNacimiento || !nuevoUsuarioUsername || !nuevoUsuarioPassword) {
          toast.error("Por favor completa todos los datos obligatorios del propietario y usuario");
          setLoading(false);
          return;
        }
        await axios.post("http://127.0.0.1:3002/propietarios", {
          nit_cui: formData.nit_cui,
          nombres: nuevoPropietarioNombres,
          apellidos: nuevoPropietarioApellidos,
          direccion: nuevoPropietarioDireccion,
          fecha_nacimiento: nuevoPropietarioFechaNacimiento,
          username: nuevoUsuarioUsername,
          password: nuevoUsuarioPassword
        });
        toast.success(`Propietario creado automáticamente: ${nuevoPropietarioNombres} ${nuevoPropietarioApellidos}`);
      }

      // 2. Registrar vehículo
      const payload = {
        ...formData,
        ...(customMarca ? {
          nuevo_marca_nombre: nuevoMarcaNombre,
          nuevo_linea_nombre: nuevoLineaNombre,
          id_linea: undefined
        } : (customLinea ? {
          id_marca: selectedMarca,
          nuevo_linea_nombre: nuevoLineaNombre,
          id_linea: undefined
        } : {}))
      };

      await axios.post("http://127.0.0.1:3002/vehiculos", payload);
      toast.success("Vehículo registrado correctamente");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error creating vehicle:", error);
      toast.error(error.response?.data?.message || "Error al registrar el vehículo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl shadow-2xl overflow-hidden p-0">
        <div className="h-16 bg-gradient-to-r from-emerald-600 to-teal-600 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
              <CarFront className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white tracking-tight leading-none">
                Registrar Nuevo Vehículo
              </DialogTitle>
              <DialogDescription className="text-emerald-100/70 text-[10px] font-medium mt-1">
                Añadir un nuevo automóvil y emitir su tarjeta de circulación
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            
            {customMarca ? (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between items-center h-4">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Marca</Label>
                    <button 
                      type="button" 
                      onClick={() => {
                        setCustomMarca(false);
                        setCustomLinea(false);
                        setNuevoMarcaNombre("");
                        setNuevoLineaNombre("");
                      }}
                      className="text-[9px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      Elegir Lista
                    </button>
                  </div>
                  <Input 
                    placeholder="Escribir Marca..." 
                    value={nuevoMarcaNombre} 
                    onChange={(e) => setNuevoMarcaNombre(e.target.value)} 
                    className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm focus-visible:ring-emerald-500/20"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Línea</Label>
                  <Input 
                    placeholder="Escribir Línea..." 
                    value={nuevoLineaNombre} 
                    onChange={(e) => setNuevoLineaNombre(e.target.value)} 
                    className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm focus-visible:ring-emerald-500/20"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between items-center h-4">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Marca</Label>
                    <button 
                      type="button" 
                      onClick={() => setCustomMarca(true)}
                      className="text-[9px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      + Nueva
                    </button>
                  </div>
                  <CustomSelect
                    value={selectedMarca}
                    onChange={(val) => handleMarcaChange(val)}
                    placeholder="Seleccionar Marca"
                    options={metadata.marcas.map((m: any) => ({ value: m.id_marca, label: m.nombre }))}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center h-4">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Línea</Label>
                    {selectedMarca !== "" && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setCustomLinea(!customLinea);
                          setNuevoLineaNombre("");
                        }}
                        className="text-[9px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors uppercase tracking-wider cursor-pointer"
                      >
                        {customLinea ? "Elegir Lista" : "+ Nueva"}
                      </button>
                    )}
                  </div>
                  {customLinea ? (
                    <Input 
                      placeholder="Escribir Línea..." 
                      value={nuevoLineaNombre} 
                      onChange={(e) => setNuevoLineaNombre(e.target.value)} 
                      className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm focus-visible:ring-emerald-500/20"
                      required
                    />
                  ) : (
                    <CustomSelect
                      value={formData.id_linea}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, id_linea: val }))}
                      placeholder="Seleccionar Línea"
                      disabled={!selectedMarca}
                      options={(metadata.marcas.find((m: any) => m.id_marca === selectedMarca)?.linea_estilo || []).map((l: any) => ({ value: l.id_linea, label: l.nombre }))}
                    />
                  )}
                </div>
              </>
            )}

            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Tipo de Uso</Label>
              <CustomSelect
                value={formData.id_tipo_uso}
                onChange={(val) => setFormData((prev: any) => ({ ...prev, id_tipo_uso: val }))}
                placeholder="Seleccionar Tipo"
                options={metadata.tiposUso.map((t: any) => ({ value: t.id_tipo_uso, label: t.nombre }))}
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">NIT / CUI del Propietario</Label>
              <Input 
                name="nit_cui" 
                value={formData.nit_cui} 
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData(prev => ({ ...prev, nit_cui: val }));
                  const found = metadata.propietarios.find((p: any) => p.nit_cui === val);
                  if (found) {
                    setPropietarioExistente(found);
                  } else {
                    setPropietarioExistente(null);
                  }
                }}
                className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm focus-visible:ring-emerald-500/20"
                placeholder="Escribir NIT o CUI..."
                required
              />
            </div>

            {/* Verification and dynamically registered owner form if not existing */}
            {formData.nit_cui && (
              <div className="col-span-2 sm:col-span-4 lg:col-span-5 animate-in fade-in slide-in-from-top-1 duration-200">
                {propietarioExistente ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl p-3 text-xs flex items-center gap-2.5 font-bold shadow-sm shadow-emerald-500/5">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>Propietario verificado: {propietarioExistente.nombres} {propietarioExistente.apellidos}</span>
                  </div>
                ) : (
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl p-4 space-y-3.5 shadow-sm shadow-amber-500/5">
                    <div className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>El CUI/NIT "{formData.nit_cui}" no está registrado. Por favor, crea a la persona para continuar:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Nombres</Label>
                        <Input 
                          value={nuevoPropietarioNombres}
                          onChange={(e) => setNuevoPropietarioNombres(e.target.value)}
                          placeholder="Nombres del propietario"
                          className="h-9 rounded-xl bg-white/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-sm focus-visible:ring-amber-500/20"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Apellidos</Label>
                        <Input 
                          value={nuevoPropietarioApellidos}
                          onChange={(e) => setNuevoPropietarioApellidos(e.target.value)}
                          placeholder="Apellidos del propietario"
                          className="h-9 rounded-xl bg-white/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-sm focus-visible:ring-amber-500/20"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Dirección</Label>
                        <Input 
                          value={nuevoPropietarioDireccion}
                          onChange={(e) => setNuevoPropietarioDireccion(e.target.value)}
                          placeholder="Dirección completa"
                          className="h-9 rounded-xl bg-white/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-sm focus-visible:ring-amber-500/20"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Fecha de Nacimiento</Label>
                        <Input 
                          type="date"
                          value={nuevoPropietarioFechaNacimiento}
                          onChange={(e) => setNuevoPropietarioFechaNacimiento(e.target.value)}
                          className="h-9 rounded-xl bg-white/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-sm focus-visible:ring-amber-500/20"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Usuario (Login)</Label>
                        <Input 
                          value={nuevoUsuarioUsername}
                          onChange={(e) => setNuevoUsuarioUsername(e.target.value)}
                          placeholder="Nombre de usuario"
                          className="h-9 rounded-xl bg-white/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-sm focus-visible:ring-amber-500/20"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Contraseña</Label>
                        <Input 
                          type="password"
                          value={nuevoUsuarioPassword}
                          onChange={(e) => setNuevoUsuarioPassword(e.target.value)}
                          placeholder="Contraseña"
                          className="h-9 rounded-xl bg-white/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-sm focus-visible:ring-amber-500/20"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Technical specifications */}
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Placa</Label>
              <Input name="placa" value={formData.placa} onChange={handleChange} maxLength={7} className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm" placeholder="P123XYZ" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">VIN</Label>
              <Input name="vin" value={formData.vin} onChange={handleChange} maxLength={17} className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm" placeholder="17 Caracteres" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Modelo (Año)</Label>
              <Input type="number" name="a_o_modelo" value={formData.a_o_modelo} onChange={handleChange} className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Motor</Label>
              <Input name="num_motor" value={formData.num_motor} onChange={handleChange} maxLength={50} className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm" placeholder="Número de Motor" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Chasis</Label>
              <Input name="chasis" value={formData.chasis} onChange={handleChange} maxLength={50} className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm" placeholder="Número de Chasis" />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Color</Label>
              <Input name="color" value={formData.color} onChange={handleChange} maxLength={30} className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm" placeholder="Color" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Cilindraje (CC)</Label>
              <Input type="number" name="cc" value={formData.cc} onChange={handleChange} className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Cilindros</Label>
              <Input type="number" name="cilindros" value={formData.cilindros} onChange={handleChange} className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Asientos</Label>
              <Input type="number" name="asientos" value={formData.asientos} onChange={handleChange} className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Ejes</Label>
              <Input type="number" name="ejes" value={formData.ejes} onChange={handleChange} className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Tonelaje</Label>
              <Input type="number" step="0.01" name="tonelaje" value={formData.tonelaje} onChange={handleChange} className="h-9 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-sm" required />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-8 h-10 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold text-[10px]"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-8 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 rounded-xl transition-all duration-300 font-bold text-[10px]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Registrar Vehículo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
