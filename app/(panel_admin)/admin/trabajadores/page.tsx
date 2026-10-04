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
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');

  // Modales
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [trabajadorEnEdicion, setTrabajadorEnEdicion] = useState<TrabajadorDB | null>(null);

  // Estados del Formulario
  const [rut, setRut] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [cargo, setCargo] = useState('Jornal');
  const [tipoContrato, setTipoContrato] = useState('INDEFINIDO');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [sueldoBase, setSueldoBase] = useState('');
  const [afp, setAfp] = useState('');
  const [sistemaSalud, setSistemaSalud] = useState('');
  const [tramoSalud, setTramoSalud] = useState('');
  const [banco, setBanco] = useState('');
  const [tipoCuenta, setTipoCuenta] = useState('')
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [emergenciaNombre, setEmergenciaNombre] = useState('');
  const [emergenciaParentesco, setEmergenciaParentesco] = useState('');
  const [emergenciaTelefono, setEmergenciaTelefono] = useState('');
  const [estado, setEstado] = useState('ACTIVO');

  const CARGOS_PERMITIDOS = [
  'Supervisor de Obra',
  'Maestro Primera',
  'Maestro Segunda',
  'Maestro Enfierrador',
  'Administrativo / RRHH',
  'Contadora',
  'Jornal',
  'Otro'
];

const TIPOS_CUENTA_PERMITIDOS = [
  'Cuenta Corriente',
  'Cuenta Vista',
  'Cuenta RUT'
];

  // Feedback
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

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

  const trabajadoresFiltrados = trabajadores.filter((t) => {
    const nombreCompleto = `${t.nombres} ${t.apellidos}`.toLowerCase();
    const coincideTexto = nombreCompleto.includes(busqueda.toLowerCase()) || t.rut.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'Todos' || t.estado === filtroEstado;
    return coincideTexto && coincideEstado;
  });

  const resetFormulario = () => {
    setRut('');
    setNombres('');
    setApellidos('');
    setFechaNacimiento('');
    setNacionalidad('');
    setEstadoCivil('');
    setTelefono('');
    setEmail('');
    setDireccion('');
    setCargo('Jornal');
    setTipoContrato('INDEFINIDO');
    setFechaIngreso('');
    setSueldoBase('');
    setAfp('');
    setSistemaSalud('');
    setTramoSalud('');
    setBanco('');
    setTipoCuenta('');
    setNumeroCuenta('');
    setEmergenciaNombre('');
    setEmergenciaParentesco('');
    setEmergenciaTelefono('');
    setEstado('ACTIVO');
  };

  const handleAbrirCrear = () => {
    setTrabajadorEnEdicion(null);
    resetFormulario();
    setErrorModal(null);
    setModalFormAbierto(true);
  };

  const handleAbrirEditar = (t: TrabajadorDB) => {
    setTrabajadorEnEdicion(t);
    setRut(t.rut);
    setNombres(t.nombres);
    setApellidos(t.apellidos);
    setFechaNacimiento(t.fecha_nacimiento);
    setNacionalidad(t.nacionalidad || '');
    setEstadoCivil(t.estado_civil || '');
    setTelefono(t.telefono);
    setEmail(t.email || '');
    setDireccion(t.direccion);
    setCargo(CARGOS_PERMITIDOS.includes(t.cargo) ? t.cargo : 'Otro');
    setTipoContrato(t.tipo_contrato ? t.tipo_contrato.toUpperCase() : 'INDEFINIDO');
    setFechaIngreso(t.fecha_ingreso);
    setSueldoBase(t.sueldo_base != null ? String(t.sueldo_base) : '');
    setAfp(t.afp);
    setSistemaSalud(t.sistema_salud);
    setTramoSalud(t.tramo_salud || '');
    setBanco(t.banco || '');
    setTipoCuenta(t.tipo_cuenta || '');
    setNumeroCuenta(t.numero_cuenta || '');
    setEmergenciaNombre(t.contacto_emergencia_nombre || '');
    setEmergenciaParentesco(t.contacto_emergencia_parentesco || '');
    setEmergenciaTelefono(t.contacto_emergencia_telefono || '');
    setEstado(t.estado ? t.estado.toUpperCase() : 'ACTIVO');
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
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        fecha_nacimiento: fechaNacimiento,
        nacionalidad: nacionalidad.trim() || undefined,
        estado_civil: estadoCivil.trim() || undefined,
        telefono: telefono.trim(),
        email: email.trim() || undefined,
        direccion: direccion.trim(),
        cargo: cargo.trim(),
        tipo_contrato: tipoContrato.trim(),
        fecha_ingreso: fechaIngreso,
        sueldo_base: String(sueldoBase).trim(),
        afp: afp.trim(),
        sistema_salud: sistemaSalud.trim(),
        tramo_salud: tramoSalud.trim() || undefined,
        banco: banco.trim() || undefined,
        tipo_cuenta: tipoCuenta.trim() || undefined,
        numero_cuenta: numeroCuenta.trim() || undefined,
        contacto_emergencia_nombre: emergenciaNombre.trim() || undefined,
        contacto_emergencia_parentesco: emergenciaParentesco.trim() || undefined,
        contacto_emergencia_telefono: emergenciaTelefono.trim() || undefined,
        estado: estado,
      };

      if (trabajadorEnEdicion) {
        await actualizarTrabajador(trabajadorEnEdicion.id, payload);
        setMensajeExito('Trabajador actualizado correctamente.');
      } else {
        await crearTrabajador(payload);
        setMensajeExito('Trabajador registrado en Supabase exitosamente.');
      }

      setModalFormAbierto(false);
      await cargarDatos();
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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-gray-300" />
            <span>Gestión de Fichas de Trabajadores</span>
          </h1>
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
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
              >
                <option value="Todos" className="text-gray-900">Todos los Estados</option>
                <option value="ACTIVO" className="text-gray-900">Activos</option>
                <option value="INACTIVO" className="text-gray-900">Inactivos</option>
                <option value="FINIQUITADO" className="text-gray-900">Finiquitados</option>
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

        {/* Grid de Cards */}
        {cargando ? (
          <div className="flex justify-center p-12 text-gray-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trabajadoresFiltrados.length === 0 ? (
              <div className="col-span-full bg-gray-200 border border-gray-300 rounded-2xl p-12 text-center text-gray-600 text-xs font-medium">
                No se encontraron registros de trabajadores.
              </div>
            ) : (
              trabajadoresFiltrados.map((t) => (
                <div key={t.id} className="bg-gray-200 border border-gray-300 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold bg-gray-300 text-gray-900 px-2.5 py-1 rounded-md font-mono">{t.rut}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${t.estado === 'Activo' ? 'bg-gray-900 text-white' : 'bg-gray-400 text-gray-900'}`}>
                        {t.estado || 'Activo'}
                      </span>
                    </div>
                    <h2 className="font-bold text-gray-900 text-sm leading-snug">
                      {t.nombres} {t.apellidos}
                    </h2>
                    <div className="text-xs space-y-1 text-gray-700">
                      <p className="flex items-center gap-1.5 font-semibold text-gray-800"><Briefcase className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />{t.cargo}</p>
                      <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />{t.telefono}</p>
                      {t.email && <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />{t.email}</p>}
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

      {/* Modal Formulario Extendido */}
      {modalFormAbierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-200 border border-gray-400 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="bg-gray-900 text-white p-5 flex justify-between items-center flex-shrink-0">
              <h2 className="font-bold text-sm tracking-tight">
                {trabajadorEnEdicion ? 'Editar Registro de Trabajador' : 'Ficha Completa de Nuevo Trabajador'}
              </h2>
              <button onClick={() => setModalFormAbierto(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTrabajador} className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {errorModal && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-3 rounded-r-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-xs font-medium">{errorModal}</p>
                </div>
              )}

              {/* Seccion 1: Identificación y Datos Personales */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-400 pb-1">
                  1. Datos Personales
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">RUT *</label>
                    <input
                      type="text"
                      required
                      placeholder="12.345.678-9"
                      value={rut}
                      onChange={(e) => setRut(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Nombres *</label>
                    <input
                      type="text"
                      required
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Apellidos *</label>
                    <input
                      type="text"
                      required
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Fecha Nacimiento *</label>
                    <input
                      type="date"
                      required
                      value={fechaNacimiento}
                      onChange={(e) => setFechaNacimiento(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Nacionalidad</label>
                    <input
                      type="text"
                      placeholder="Chilena"
                      value={nacionalidad}
                      onChange={(e) => setNacionalidad(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Estado Civil</label>
                    <input
                      type="text"
                      placeholder="Soltero/a"
                      value={estadoCivil}
                      onChange={(e) => setEstadoCivil(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Teléfono *</label>
                    <input
                      type="text"
                      required
                      placeholder="+56912345678"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Dirección *</label>
                  <input
                    type="text"
                    required
                    placeholder="Calle, Número, Comuna"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                  />
                </div>
              </div>

              {/* Seccion 2: Datos Laborales y Previsionales */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-400 pb-1">
                  2. Datos Laborales y Previsionales
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Cargo *</label>
                    <select
                      required
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    >
                      {CARGOS_PERMITIDOS.map((opcion) => (
                        <option key={opcion} value={opcion} className="text-gray-900">
                          {opcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Tipo Contrato *</label>
                    <select
                      required
                      value={tipoContrato}
                      onChange={(e) => setTipoContrato(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    >
                      <option value="INDEFINIDO" className="text-gray-900">Indefinido</option>
                      <option value="DEFINIDO" className="text-gray-900">Plazo Fijo / Definido</option>
                      <option value="POR_OBRA" className="text-gray-900">Por Obra / Faena</option>
                      <option value="HONORARIOS" className="text-gray-900">Honorarios</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Fecha Ingreso *</label>
                    <input
                      type="date"
                      required
                      value={fechaIngreso}
                      onChange={(e) => setFechaIngreso(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Sueldo Base *</label>
                    <input
                      type="text"
                      required
                      placeholder="500000"
                      value={sueldoBase}
                      onChange={(e) => setSueldoBase(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">AFP *</label>
                    <input
                      type="text"
                      required
                      placeholder="Habitat / Provida"
                      value={afp}
                      onChange={(e) => setAfp(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Sistema Salud *</label>
                    <input
                      type="text"
                      required
                      placeholder="Fonasa / Isapre"
                      value={sistemaSalud}
                      onChange={(e) => setSistemaSalud(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Tramo Salud</label>
                    <input
                      type="text"
                      placeholder="A / B / C / D"
                      value={tramoSalud}
                      onChange={(e) => setTramoSalud(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Seccion 3: Datos Bancarios y Estado */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-400 pb-1">
                  3. Datos Bancarios y Estado
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Banco</label>
                    <input
                      type="text"
                      placeholder="Banco Estado"
                      value={banco}
                      onChange={(e) => setBanco(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Tipo Cuenta</label>
                      <select
                        value={tipoCuenta}
                        onChange={(e) => setTipoCuenta(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                      >
                        <option value="" className="text-gray-900">-- Seleccionar (Opcional) --</option>
                        {TIPOS_CUENTA_PERMITIDOS.map((opcion) => (
                          <option key={opcion} value={opcion} className="text-gray-900">
                            {opcion}
                          </option>
                        ))}
                      </select>
                    </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">N° Cuenta</label>
                    <input
                      type="text"
                      value={numeroCuenta}
                      onChange={(e) => setNumeroCuenta(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Estado</label>
                    <select
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    >
                      <option value="ACTIVO" className="text-gray-900">Activo</option>
                      <option value="INACTIVO" className="text-gray-900">Inactivo</option>
                      <option value="FINIQUITADO" className="text-gray-900">Finiquitado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Seccion 4: Contacto de Emergencia */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-400 pb-1">
                  4. Contacto de Emergencia
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Nombre Contacto</label>
                    <input
                      type="text"
                      value={emergenciaNombre}
                      onChange={(e) => setEmergenciaNombre(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Parentesco</label>
                    <input
                      type="text"
                      placeholder="Cónyuge / Padre / Hijo"
                      value={emergenciaParentesco}
                      onChange={(e) => setEmergenciaParentesco(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Teléfono Contacto</label>
                    <input
                      type="text"
                      value={emergenciaTelefono}
                      onChange={(e) => setEmergenciaTelefono(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="pt-4 border-t border-gray-300 flex justify-end space-x-2">
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