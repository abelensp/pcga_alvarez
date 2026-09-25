'use client';

import { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Pencil, 
  X, 
  AlertCircle, 
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  IdCard,
  UserCheck,
  UserX,
  Eye
} from 'lucide-react';

// Estructura de datos del Trabajador
interface Trabajador {
  id: number;
  rut: string;
  nombreCompleto: string;
  direccion: string;
  telefono: string;
  email: string;
  especialidad: string;
  estado: 'Activo' | 'Inactivo';
}

const ESPECIALIDADES_PERMITIDAS = [
  'Enfierrador',
  'Encofrador',
  'Jornal',
  'Operador de maquinaria pesada',
  'Electricista',
  'Gasfiter / Fontanero',
  'Pintor',
  'Capataz de Obra',
  'Otros',
];

// Datos iniciales de prueba
const TRABAJADORES_INICIALES: Trabajador[] = [
  {
    id: 1,
    rut: '12.345.678-9',
    nombreCompleto: 'Carlos Eduardo Mendoza Silva',
    direccion: 'Av. Las Condes 1234, Santiago',
    telefono: '987654321',
    email: 'carlos.mendoza@empresa.cl',
    especialidad: 'Operador de maquinaria pesada',
    estado: 'Activo',
  },
  {
    id: 2,
    rut: '15.678.912-K',
    nombreCompleto: 'Juan Andrés Pérez Morales',
    direccion: 'Calle Los Alerces 56, Maipú',
    telefono: '912345678',
    email: 'juan.perez@empresa.cl',
    especialidad: 'Enfierrador',
    estado: 'Activo',
  },
  {
    id: 3,
    rut: '18.234.567-8',
    nombreCompleto: 'Roberto Ignacio Gómez Tapia',
    direccion: 'Pasaje El Roble 890, Puente Alto',
    telefono: '955512345',
    email: 'roberto.gomez@empresa.cl',
    especialidad: 'Jornal',
    estado: 'Inactivo',
  },
];

// Función utilitaria para validar RUT chileno (módulo 11)
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
  let dvEsperado = '';
  if (dvEsperadoNum === 11) dvEsperado = '0';
  else if (dvEsperadoNum === 10) dvEsperado = 'K';
  else dvEsperado = dvEsperadoNum.toString();

  return dvIngresado === dvEsperado;
};

export default function RegistroTrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>(TRABAJADORES_INICIALES);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Activo' | 'Inactivo'>('Todos');

  // Modal Crear / Editar
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [trabajadorEnEdicion, setTrabajadorEnEdicion] = useState<Trabajador | null>(null);

  // Modal Ver Detalle
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState<Trabajador | null>(null);

  // Campos del Formulario
  const [rut, setRut] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [estadoOperativo, setEstadoOperativo] = useState<'Activo' | 'Inactivo'>('Activo');

  // Retroalimentación
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Filtrar trabajadores por RUT o Nombre
  const trabajadoresFiltrados = trabajadores.filter((t) => {
    const coincideTexto =
      t.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.rut.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'Todos' || t.estado === filtroEstado;
    return coincideTexto && coincideEstado;
  });

  // Abrir Modal para Crear
  const handleAbrirCrear = () => {
    setTrabajadorEnEdicion(null);
    setRut('');
    setNombreCompleto('');
    setDireccion('');
    setTelefono('');
    setEmail('');
    setEspecialidad('');
    setEstadoOperativo('Activo');
    setErrorModal(null);
    setModalFormAbierto(true);
  };

  // Abrir Modal de Detalle
  const handleVerDetalle = (t: Trabajador) => {
    setTrabajadorSeleccionado(t);
    setModalDetalleAbierto(true);
  };

  // Abrir Modal para Editar desde la tarjeta o desde el detalle
  const handleAbrirEditar = (t: Trabajador) => {
    setModalDetalleAbierto(false); // Cierra el detalle si estaba abierto
    setTrabajadorEnEdicion(t);
    setRut(t.rut);
    setNombreCompleto(t.nombreCompleto);
    setDireccion(t.direccion);
    setTelefono(t.telefono);
    setEmail(t.email);
    setEspecialidad(t.especialidad);
    setEstadoOperativo(t.estado);
    setErrorModal(null);
    setModalFormAbierto(true);
  };

  // Guardar (Crear o Editar)
  const handleSubmitTrabajador = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorModal(null);

    // 1. Validar RUT
    if (!rut.trim() || !validarRutChileno(rut)) {
      setErrorModal('El RUT o Identificador ingresado no es válido (debe incluir dígito verificador).');
      return;
    }

    // Comprobar clave única de RUT al crear
    const rutExistente = trabajadores.some(
      (t) => t.rut.replace(/[^0-9kK]/g, '').toUpperCase() === rut.replace(/[^0-9kK]/g, '').toUpperCase() &&
      (!trabajadorEnEdicion || t.id !== trabajadorEnEdicion.id)
    );

    if (rutExistente) {
      setErrorModal('Ya existe un trabajador registrado con este RUT.');
      return;
    }

    // 2. Validar Datos Personales
    if (!nombreCompleto.trim()) {
      setErrorModal('El nombre completo es obligatorio.');
      return;
    }

    if (!direccion.trim()) {
      setErrorModal('La dirección es obligatoria.');
      return;
    }

    // 3. Validar Teléfono (9 dígitos)
    const telefonoLimpio = telefono.replace(/\D/g, '');
    if (telefonoLimpio.length !== 9) {
      setErrorModal('El teléfono debe contener exactamente 9 dígitos numéricos (ej: 912345678).');
      return;
    }

    // 4. Validar Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorModal('El correo electrónico no tiene un formato válido.');
      return;
    }

    // 5. Validar Especialidad
    if (!especialidad) {
      setErrorModal('Debes seleccionar una especialidad técnica obligatoria.');
      return;
    }

    if (trabajadorEnEdicion) {
      // Modificar existente
      const trabajadorActualizado: Trabajador = {
        ...trabajadorEnEdicion,
        rut: rut.trim(),
        nombreCompleto: nombreCompleto.trim(),
        direccion: direccion.trim(),
        telefono: telefonoLimpio,
        email: email.trim(),
        especialidad,
        estado: estadoOperativo,
      };

      setTrabajadores(trabajadores.map((t) => (t.id === trabajadorEnEdicion.id ? trabajadorActualizado : t)));
      setMensajeExito('Datos del trabajador actualizados correctamente.');
    } else {
      // Crear nuevo
      const nuevoTrabajador: Trabajador = {
        id: Date.now(),
        rut: rut.trim(),
        nombreCompleto: nombreCompleto.trim(),
        direccion: direccion.trim(),
        telefono: telefonoLimpio,
        email: email.trim(),
        especialidad,
        estado: estadoOperativo,
      };

      setTrabajadores([nuevoTrabajador, ...trabajadores]);
      setMensajeExito('Nuevo trabajador registrado exitosamente.');
    }

    setModalFormAbierto(false);
    setTimeout(() => setMensajeExito(null), 3000);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <Users className="w-6 h-6 text-gray-300" />
              <span>Registro Histórico de Trabajadores</span>
            </h1>
            <p className="text-gray-400 text-xs mt-1">
              Base de datos centralizada de personal con historial y estado operativo
            </p>
          </div>
        </div>

        {/* Notificación de Éxito */}
        {mensajeExito && (
          <div className="bg-gray-800 text-white p-3.5 rounded-xl flex items-center space-x-2.5 shadow-sm text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
            <span>{mensajeExito}</span>
          </div>
        )}

        {/* BARRA SUPERIOR: BÚSQUEDA Y CREAR TRABAJADOR */}
        <div className="bg-gray-200 border border-gray-300 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
            {/* Buscador por RUT o Nombre */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por RUT o Nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            {/* Filtro por Estado Operativo */}
            <div className="w-full sm:w-48">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                <option value="Todos">Todos los Estados</option>
                <option value="Activo">Solo Activos</option>
                <option value="Inactivo">Solo Inactivos</option>
              </select>
            </div>
          </div>

          {/* Botón Nuevo Trabajador */}
          <button
            onClick={handleAbrirCrear}
            className="w-full md:w-auto px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg text-xs shadow-md transition-colors flex items-center justify-center space-x-2 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Trabajador</span>
          </button>
        </div>

        {/* RETÍCULA DE TRABAJADORES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trabajadoresFiltrados.length === 0 ? (
            <div className="col-span-full bg-gray-200 border border-gray-300 rounded-2xl p-12 text-center text-gray-500 text-xs">
              No se encontraron trabajadores que coincidan con la búsqueda.
            </div>
          ) : (
            trabajadoresFiltrados.map((t) => (
              <div
                key={t.id}
                onClick={() => handleVerDetalle(t)}
                className="bg-gray-200 border border-gray-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:border-gray-400 group"
              >
                <div className="space-y-3">
                  {/* Encabezado Card */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold font-mono bg-gray-300 text-gray-800 px-2.5 py-1 rounded-md">
                      <IdCard className="w-3 h-3 text-gray-700" />
                      <span>{t.rut}</span>
                    </span>

                    <span
                      className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        t.estado === 'Activo'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-400 text-gray-900'
                      }`}
                    >
                      {t.estado === 'Activo' ? (
                        <UserCheck className="w-3 h-3 text-gray-300" />
                      ) : (
                        <UserX className="w-3 h-3 text-gray-800" />
                      )}
                      <span>{t.estado}</span>
                    </span>
                  </div>

                  {/* Nombre */}
                  <h2 className="font-bold text-gray-900 text-sm leading-snug group-hover:underline">
                    {t.nombreCompleto}
                  </h2>

                  {/* Especialidad & Contacto */}
                  <div className="space-y-1.5 pt-1 text-xs text-gray-700">
                    <div className="flex items-center space-x-1.5 font-semibold text-gray-800">
                      <Briefcase className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
                      <span>{t.especialidad}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
                      <span>+56 {t.telefono}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-gray-600 truncate">
                      <Mail className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
                      <span className="truncate">{t.email}</span>
                    </div>
                  </div>
                </div>

                {/* Pie de tarjeta */}
                <div className="pt-3 border-t border-gray-300 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-gray-600 flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver ficha completa</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Evita abrir el modal de detalle
                      handleAbrirEditar(t);
                    }}
                    title="Editar Trabajador"
                    className="p-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* ============================================================== */}
      {/* POP-UP / MODAL DETALLE DE TRABAJADOR                          */}
      {/* ============================================================== */}
      {modalDetalleAbierto && trabajadorSeleccionado && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-200 border border-gray-400 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header Modal Detalle */}
            <div className="bg-gray-900 text-white p-5 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Ficha Histórica
                </span>
                <h2 className="font-bold text-base tracking-tight leading-none mt-1">
                  {trabajadorSeleccionado.nombreCompleto}
                </h2>
              </div>
              <button
                onClick={() => setModalDetalleAbierto(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del Perfil */}
            <div className="p-6 space-y-4">
              
              {/* Bloque Estado y RUT */}
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded-xl border border-gray-300">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">RUT / Identificador</p>
                  <p className="font-mono text-xs font-bold text-gray-900">{trabajadorSeleccionado.rut}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Estado Operativo</p>
                  <span
                    className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider mt-0.5 ${
                      trabajadorSeleccionado.estado === 'Activo'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-400 text-gray-900'
                    }`}
                  >
                    <span>{trabajadorSeleccionado.estado}</span>
                  </span>
                </div>
              </div>

              {/* Lista de Datos */}
              <div className="space-y-3 text-xs text-gray-800">
                <div className="flex items-start space-x-2">
                  <Briefcase className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Especialidad Técnica</span>
                    <span className="font-semibold">{trabajadorSeleccionado.especialidad}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Phone className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Teléfono de Contacto</span>
                    <span>+56 {trabajadorSeleccionado.telefono}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Mail className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Correo Electrónico</span>
                    <span>{trabajadorSeleccionado.email}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Dirección</span>
                    <span>{trabajadorSeleccionado.direccion}</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="pt-4 border-t border-gray-300 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalDetalleAbierto(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => handleAbrirEditar(trabajadorSeleccionado)}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Modificar Datos</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* POP-UP / MODAL FORMULARIO CREAR / EDITAR                      */}
      {/* ============================================================== */}
      {modalFormAbierto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-200 border border-gray-400 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            
            {/* Header Formulario */}
            <div className="bg-gray-900 text-white p-5 flex justify-between items-center flex-shrink-0">
              <h2 className="font-bold text-sm tracking-tight">
                {trabajadorEnEdicion ? 'Modificar Información del Trabajador' : 'Registrar Nuevo Trabajador'}
              </h2>
              <button
                onClick={() => setModalFormAbierto(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario con Scroll */}
            <form onSubmit={handleSubmitTrabajador} className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {errorModal && (
                <div className="bg-gray-300 border-l-4 border-gray-900 text-gray-900 p-3 rounded-r-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-gray-900 flex-shrink-0" />
                  <p className="text-xs font-medium">{errorModal}</p>
                </div>
              )}

              {/* RUT y Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    RUT / Identificador *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 12.345.678-9"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Estado Operativo *
                  </label>
                  <select
                    required
                    value={estadoOperativo}
                    onChange={(e) => setEstadoOperativo(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Nombre Completo */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carlos Eduardo Mendoza Silva"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>

              {/* Especialidad Técnica */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Especialidad Técnica *
                </label>
                <select
                  required
                  value={especialidad}
                  onChange={(e) => setEspecialidad(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                >
                  <option value="">-- Selecciona una especialidad --</option>
                  {ESPECIALIDADES_PERMITIDAS.map((esp, idx) => (
                    <option key={idx} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>

              {/* Teléfono y Correo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Teléfono (9 dígitos) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-gray-400 bg-gray-300 text-gray-700 text-xs font-bold">
                      +56
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={9}
                      placeholder="912345678"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded-r-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="trabajador@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Av. Las Condes 1234, Santiago"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>

              {/* Botones Acciones */}
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