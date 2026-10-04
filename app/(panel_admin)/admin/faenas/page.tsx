'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, Search, Plus, Pencil, X, AlertCircle, CheckCircle2,
  Loader2, MapPin, Calendar, Hash, UserCheck
} from 'lucide-react';
import { FaenaDB, EstadoFaena } from '@/lib/supabase/types';
import { obtenerFaenas, crearFaena, actualizarFaena } from '@/services/faenas';

const ESTADOS_PERMITIDOS: { value: EstadoFaena; label: string }[] = [
  { value: 'EN_EJECUCION', label: 'En Ejecución' },
  { value: 'FINALIZADA', label: 'Finalizada' },
  { value: 'SUSPENDIDA', label: 'Suspendida' },
];

export default function GestionFaenasPage() {
  const [faenas, setFaenas] = useState<FaenaDB[]>([]);
  const [cargando, setCargando] = useState(true);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');

  // Modal y Formulario
  const [modalAbierto, setModalAbierto] = useState(false);
  const [faenaEnEdicion, setFaenaEnEdicion] = useState<FaenaDB | null>(null);

  // Campos del formulario
  const [nombreFaena, setNombreFaena] = useState('');
  const [mandante, setMandante] = useState('');
  const [codigoCentroCosto, setCodigoCentroCosto] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [estado, setEstado] = useState<EstadoFaena>('EN_EJECUCION');

  // Mensajes de Feedback
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const data = await obtenerFaenas();
      setFaenas(data);
    } catch (err: any) {
      setErrorModal('Error al conectar con la base de datos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Filtro que busca por Nombre, Mandante o Ubicación
  const faenasFiltradas = faenas.filter((f) => {
    const texto = busqueda.toLowerCase();
    const coincideNombre = f.nombre_faena.toLowerCase().includes(texto);
    const coincideMandante = f.mandante ? f.mandante.toLowerCase().includes(texto) : false;
    const coincideUbicacion = f.ubicacion.toLowerCase().includes(texto);
    
    const coincideBusqueda = coincideNombre || coincideMandante || coincideUbicacion;
    const coincideEstado = filtroEstado === 'Todos' || f.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const resetFormulario = () => {
    setNombreFaena('');
    setMandante('');
    setCodigoCentroCosto('');
    setUbicacion('');
    setFechaInicio('');
    setEstado('EN_EJECUCION');
  };

  const handleAbrirCrear = () => {
    setFaenaEnEdicion(null);
    resetFormulario();
    setErrorModal(null);
    setModalAbierto(true);
  };

  const handleAbrirEditar = (f: FaenaDB) => {
    setFaenaEnEdicion(f);
    setNombreFaena(f.nombre_faena);
    setMandante(f.mandante || '');
    setCodigoCentroCosto(f.codigo_centro_costo || '');
    setUbicacion(f.ubicacion);
    setFechaInicio(f.fecha_inicio);
    setEstado(f.estado || 'EN_EJECUCION');
    setErrorModal(null);
    setModalAbierto(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorModal(null);

    try {
      const payload = {
        nombre_faena: String(nombreFaena).trim(),
        mandante: mandante ? String(mandante).trim() : undefined,
        codigo_centro_costo: codigoCentroCosto ? String(codigoCentroCosto).trim() : undefined,
        ubicacion: String(ubicacion).trim(),
        fecha_inicio: fechaInicio,
        estado: estado,
      };

      if (faenaEnEdicion) {
        await actualizarFaena(faenaEnEdicion.id, payload);
        setMensajeExito('Faena actualizada correctamente.');
      } else {
        await crearFaena(payload);
        setMensajeExito('Faena creada exitosamente.');
      }

      setModalAbierto(false);
      await cargarDatos();
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (err: any) {
      setErrorModal(err.message || 'Error al guardar la faena.');
    }
  };

  const getEstadoBadgeClass = (estadoFaena?: string) => {
    switch (estadoFaena) {
      case 'EN_EJECUCION':
        return 'bg-green-800 text-green-100';
      case 'FINALIZADA':
        return 'bg-gray-800 text-gray-100';
      case 'SUSPENDIDA':
        return 'bg-amber-800 text-amber-100';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  return (
    <div className="space-y-6 text-gray-900">
      
      {/* Header */}
      <div className="bg-gray-900 text-white p-6 rounded-2xl flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-gray-300" />
          <span>Gestión de Faenas</span>
        </h1>
      </div>

      {mensajeExito && (
        <div className="bg-gray-800 text-white p-3.5 rounded-xl flex items-center space-x-2 text-xs shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Controles: Búsqueda, Filtro y Botón de Creación */}
      <div className="bg-gray-200 border border-gray-300 p-4 rounded-2xl flex flex-col md:flex-row justify-between gap-4 shadow-sm">
        <div className="flex gap-3 flex-1 flex-col sm:flex-row">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por Nombre, Mandante o Lugar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="EN_EJECUCION">En Ejecución</option>
            <option value="FINALIZADA">Finalizada</option>
            <option value="SUSPENDIDA">Suspendida</option>
          </select>
        </div>
        <button
          onClick={handleAbrirCrear}
          className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Faena</span>
        </button>
      </div>

      {/* Vista de Tabla */}
      {cargando ? (
        <div className="flex justify-center p-12 text-gray-600">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-900 text-white font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Faena</th>
                  <th className="p-4">Mandante</th>
                  <th className="p-4">Centro Costo</th>
                  <th className="p-4">Ubicación</th>
                  <th className="p-4">Fecha Inicio</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {faenasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500 font-medium">
                      No se encontraron faenas registradas.
                    </td>
                  </tr>
                ) : (
                  faenasFiltradas.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-900">
                        {f.nombre_faena}
                      </td>
                      <td className="p-4 text-gray-700">
                        {f.mandante || '-'}
                      </td>
                      <td className="p-4 text-gray-700 font-mono">
                        {f.codigo_centro_costo || '-'}
                      </td>
                      <td className="p-4 text-gray-700">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-500" />
                          {f.ubicacion}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          {f.fecha_inicio}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getEstadoBadgeClass(f.estado)}`}>
                          {f.estado?.replace('_', ' ') || 'SIN ESTADO'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleAbrirEditar(f)}
                          title="Editar Faena"
                          className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors inline-flex items-center"
                        >
                          <Pencil className="w-4 h-4 text-gray-800" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar Faena */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-200 border border-gray-400 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
            
            <div className="bg-gray-900 text-white p-5 flex justify-between items-center">
              <h2 className="font-bold text-sm tracking-tight">
                {faenaEnEdicion ? 'Editar Instancia de Faena' : 'Crear Nueva Faena'}
              </h2>
              <button onClick={() => setModalAbierto(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {errorModal && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-3 rounded-r-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-xs font-medium">{errorModal}</p>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Nombre Faena *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Construcción Torre Central"
                  value={nombreFaena}
                  onChange={(e) => setNombreFaena(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Mandante</label>
                  <input
                    type="text"
                    placeholder="Ej: Inmobiliaria X"
                    value={mandante}
                    onChange={(e) => setMandante(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Código Centro Costo</label>
                  <input
                    type="text"
                    placeholder="Ej: CC-104"
                    value={codigoCentroCosto}
                    onChange={(e) => setCodigoCentroCosto(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Ubicación *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Dirección o referencia del lugar"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Fecha Inicio *</label>
                  <input
                    type="date"
                    required
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Estado</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as EstadoFaena)}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                  >
                    {ESTADOS_PERMITIDOS.map((est) => (
                      <option key={est.value} value={est.value} className="text-gray-900">
                        {est.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-300 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
                >
                  {faenaEnEdicion ? 'Guardar Cambios' : 'Crear Faena'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}