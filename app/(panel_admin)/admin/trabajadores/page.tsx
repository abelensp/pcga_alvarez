'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Plus, Pencil, X, AlertCircle, CheckCircle2,
        Mail, Phone, Briefcase, IdCard, UserCheck, UserX, Eye, Loader2 } from 'lucide-react';
import { TrabajadorDB } from '../../../../lib/supabase/types';
import {
  obtenerTrabajadores,
  crearTrabajador,
  actualizarTrabajador,
} from '../../../../services/trabajadores';

const ESPECIALIDADES_PERMITIDAS = [
  'Enfierrador', 'Encofrador', 'Jornal', 
  'Operador de maquinaria pesada', 'Electricista', 
  'Gasfiter / Fontanero', 'Pintor', 'Capataz de Obra', 'Otros'
];

const validarRutChileno = (rutCompleto: string): boolean => {
  const limpio = rutCompleto.replace(/[^0-9kK]/g, '');
  if (limpio.length < 8 || limpio.length > 9) return false;
  const cuerpo = limpio.slice(0, -1);
  let dvIngresado = limpio.slice(-1).toUpperCase();
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const dvEsperadoNum = 11 - (suma % 11);
  let dvEsperado = dvEsperadoNum === 11 ? '0' : dvEsperadoNum === 10 ? 'K' : dvEsperadoNum.toString();
  return dvIngresado === dvEsperado;
};

export default function RegistroTrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState<TrabajadorDB[]>([]);
  const [cargando, setCargando] = useState(true);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Activo' | 'Inactivo'>('Todos');

  // Modales
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [trabajadorEnEdicion, setTrabajadorEnEdicion] = useState<TrabajadorDB | null>(null);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState<TrabajadorDB | null>(null);

  // Campos desglosados del formulario
  const [rut, setRut] = useState('');
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [celular, setCelular] = useState('');
  const [correo, setCorreo] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [estadoOperativo, setEstadoOperativo] = useState<'Activo' | 'Inactivo'>('Activo');

  // Feedback
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Cargar datos reales al montar
  const cargarDatos = async () => {
    try {
      setCargando(true);
      const data = await obtenerTrabajadores();
      setTrabajadores(data);
    } catch (err: any) {
      setErrorModal('Error al conectar con la base de datos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Filtrado local
  const trabajadoresFiltrados = trabajadores.filter((t) => {
    const nombreCompleto = `${t.primer_nombre} ${t.segundo_nombre || ''} ${t.primer_apellido} ${t.segundo_apellido || ''}`.toLowerCase();
    const coincideTexto = nombreCompleto.includes(busqueda.toLowerCase()) || t.rut.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'Todos' || t.estado_operativo === filtroEstado;
    return coincideTexto && coincideEstado;
  });

  const handleAbrirCrear = () => {
    setTrabajadorEnEdicion(null);
    setRut('');
    setPrimerNombre('');
    setSegundoNombre('');
    setPrimerApellido('');
    setSegundoApellido('');
    setCelular('');
    setCorreo('');
    setEspecialidad('');
    setEstadoOperativo('Activo');
    setErrorModal(null);
    setModalFormAbierto(true);
  };

  const handleAbrirEditar = (t: TrabajadorDB) => {
    setModalDetalleAbierto(false);
    setTrabajadorEnEdicion(t);
    setRut(t.rut);
    setPrimerNombre(t.primer_nombre);
    setSegundoNombre(t.segundo_nombre || '');
    setPrimerApellido(t.primer_apellido);
    setSegundoApellido(t.segundo_apellido || '');
    setCelular(t.celular);
    setCorreo(t.correo);
    setEspecialidad(t.especialidad_tecnica);
    setEstadoOperativo(t.estado_operativo);
    setErrorModal(null);
    setModalFormAbierto(true);
  };

  const handleSubmitTrabajador = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorModal(null);

    if (!validarRutChileno(rut)) {
      setErrorModal('RUT chileno no válido.');
      return;
    }

    try {
      const payload = {
        rut: rut.trim(),
        primer_nombre: primerNombre.trim(),
        segundo_nombre: segundoNombre.trim() || undefined,
        primer_apellido: primerApellido.trim(),
        segundo_apellido: segundoApellido.trim() || undefined,
        celular: celular.replace(/\D/g, ''),
        correo: correo.trim(),
        especialidad_tecnica: especialidad,
        estado_operativo: estadoOperativo,
      };

      if (trabajadorEnEdicion) {
        await actualizarTrabajador(trabajadorEnEdicion.id, payload);
        setMensajeExito('Trabajador actualizado correctamente.');
      } else {
        await crearTrabajador(payload);
        setMensajeExito('Trabajador registrado en Supabase exitosamente.');
      }

      setModalFormAbierto(false);
      await cargarDatos(); // Recargar datos desde Supabase
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (err: any) {
      setErrorModal(err.message || 'Ocurrió un error al guardar los datos.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 text-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl flex justify-between items-center shadow-md">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-gray-300" />
              <span>Registro de Trabajadores (Supabase)</span>
            </h1>
          </div>
        </div>

        {mensajeExito && (
          <div className="bg-gray-800 text-white p-3.5 rounded-xl flex items-center space-x-2 text-xs shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span>{mensajeExito}</span>
          </div>
        )}

        {/* Buscador */}
        <div className="bg-gray-200 border border-gray-300 p-4 rounded-2xl flex flex-col md:flex-row justify-between gap-4 shadow-sm">
          <div className="flex gap-3 flex-1 flex-col sm:flex-row">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por RUT o Nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
              />
            </div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as any)}
              className="px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
            >
              <option value="Todos" className="text-gray-900">Todos los Estados</option>
              <option value="Activo" className="text-gray-900">Activos</option>
              <option value="Inactivo" className="text-gray-900">Inactivos</option>
            </select>
          </div>
          <button
            onClick={handleAbrirCrear}
            className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Trabajador</span>
          </button>
        </div>

        {/* Grid de Trabajadores */}
        {cargando ? (
          <div className="flex justify-center p-12 text-gray-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trabajadoresFiltrados.length === 0 ? (
              <div className="col-span-full bg-gray-200 border border-gray-300 rounded-2xl p-12 text-center text-gray-600 text-xs font-medium">
                No se encontraron trabajadores.
              </div>
            ) : (
              trabajadoresFiltrados.map((t) => (
                <div key={t.id} className="bg-gray-200 border border-gray-300 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold bg-gray-300 text-gray-900 px-2.5 py-1 rounded-md font-mono">{t.rut}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${t.estado_operativo === 'Activo' ? 'bg-gray-900 text-white' : 'bg-gray-400 text-gray-900'}`}>
                        {t.estado_operativo}
                      </span>
                    </div>
                    <h2 className="font-bold text-gray-900 text-sm leading-snug">
                      {t.primer_nombre} {t.segundo_nombre} {t.primer_apellido} {t.segundo_apellido}
                    </h2>
                    <div className="text-xs space-y-1.5 text-gray-700">
                      <p className="flex items-center gap-1.5 font-semibold text-gray-800"><Briefcase className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />{t.especialidad_tecnica}</p>
                      <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />+56 {t.celular}</p>
                      <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />{t.correo}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-300 flex justify-end">
                    <button onClick={() => handleAbrirEditar(t)} title="Editar datos" className="p-1.5 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4 text-gray-800" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Modal Formulario Crear / Editar */}
      {modalFormAbierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-200 border border-gray-400 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="bg-gray-900 text-white p-5 flex justify-between items-center flex-shrink-0">
              <h2 className="font-bold text-sm tracking-tight">
                {trabajadorEnEdicion ? 'Modificar Información del Trabajador' : 'Registrar Nuevo Trabajador'}
              </h2>
              <button onClick={() => setModalFormAbierto(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTrabajador} className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {errorModal && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-3 rounded-r-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-xs font-medium">{errorModal}</p>
                </div>
              )}

              {/* RUT y Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">RUT / Identificador *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 12.345.678-9"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Estado Operativo *</label>
                  <select
                    value={estadoOperativo}
                    onChange={(e) => setEstadoOperativo(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                  >
                    <option value="Activo" className="text-gray-900">Activo</option>
                    <option value="Inactivo" className="text-gray-900">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Nombres */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Primer Nombre *</label>
                  <input
                    type="text"
                    required
                    placeholder="Carlos"
                    value={primerNombre}
                    onChange={(e) => setPrimerNombre(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Segundo Nombre</label>
                  <input
                    type="text"
                    placeholder="Eduardo"
                    value={segundoNombre}
                    onChange={(e) => setSegundoNombre(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                  />
                </div>
              </div>

              {/* Apellidos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Primer Apellido *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mendoza"
                    value={primerApellido}
                    onChange={(e) => setPrimerApellido(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Segundo Apellido</label>
                  <input
                    type="text"
                    placeholder="Silva"
                    value={segundoApellido}
                    onChange={(e) => setSegundoApellido(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                  />
                </div>
              </div>

              {/* Celular y Correo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Celular (9 dígitos) *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-gray-400 bg-gray-300 text-gray-800 text-xs font-bold">
                      +56
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={9}
                      placeholder="912345678"
                      value={celular}
                      onChange={(e) => setCelular(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-r-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="trabajador@correo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                  />
                </div>
              </div>

              {/* Especialidad */}
              <div>
                <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Especialidad Técnica *</label>
                <select
                  required
                  value={especialidad}
                  onChange={(e) => setEspecialidad(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                >
                  <option value="" className="text-gray-900">-- Selecciona una especialidad --</option>
                  {ESPECIALIDADES_PERMITIDAS.map((esp, idx) => (
                    <option key={idx} value={esp} className="text-gray-900">{esp}</option>
                  ))}
                </select>
              </div>

              {/* Acciones */}
              <div className="pt-3 border-t border-gray-300 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalFormAbierto(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
                >
                  {trabajadorEnEdicion ? 'Guardar Cambios' : 'Registrar Trabajador'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}