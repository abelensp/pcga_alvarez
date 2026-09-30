'use client';

import { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  Building2, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Filter,
  Save
} from 'lucide-react';

// Estructura de datos para la nómina de trabajadores
interface Trabajador {
  id: number;
  rut: string;
  nombre: string;
  cargo: string;
  faenaAsignada: string;
}

// Datos de prueba simulando la nómina existente
const NOMINA_TRABAJADORES: Trabajador[] = [
  { id: 1, rut: '15.432.890-1', nombre: 'Carlos Mendoza Silva', cargo: 'Enfierrador', faenaAsignada: 'Puente Urbano' },
  { id: 2, rut: '18.765.432-K', nombre: 'Juan Pablo Morales', cargo: 'Operador de Maquinaria', faenaAsignada: 'Edificio Oficinas' },
  { id: 3, rut: '12.987.654-3', nombre: 'Roberto Gómez Tapia', cargo: 'Concretero', faenaAsignada: 'Puente Urbano' },
  { id: 4, rut: '16.543.210-9', nombre: 'Esteban Paredes Soto', cargo: 'Encofrador', faenaAsignada: 'Planta Logística' },
  { id: 5, rut: '19.876.543-2', nombre: 'Héctor Tapia Godoy', cargo: 'Jornal', faenaAsignada: 'Complejo Residencial' },
];

export default function LibroAsistenciaPage() {
  // Estado para el panel de trabajadores (Div 1)
  const [busqueda, setBusqueda] = useState('');
  const [faenaFiltroListado, setFaenaFiltroListado] = useState('Todas');
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState<Trabajador | null>(NOMINA_TRABAJADORES[0]);

  // Estado para el formulario de asistencia (Div 2)
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Fecha actual por defecto YYYY-MM-DD
  const [faena, setFaena] = useState(NOMINA_TRABAJADORES[0].faenaAsignada);
  const [horaEntrada, setHoraEntrada] = useState('08:00');
  const [horaSalida, setHoraSalida] = useState('18:00');
  const [estadoAsistencia, setEstadoAsistencia] = useState<'Presente' | 'Atraso' | 'Inasistencia'>('Presente');

  // Estados de retroalimentación
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  // Filtrado de la nómina en tiempo real por Nombre/RUT y Faena
  const trabajadoresFiltrados = NOMINA_TRABAJADORES.filter((t) => {
    const coincideTexto = t.nombre.toLowerCase().includes(busqueda.toLowerCase()) || t.rut.includes(busqueda);
    const coincideFaena = faenaFiltroListado === 'Todas' || t.faenaAsignada === faenaFiltroListado;
    return coincideTexto && coincideFaena;
  });

  // Manejo del cambio de trabajador seleccionado
  const handleSeleccionarTrabajador = (trabajador: Trabajador) => {
    setTrabajadorSeleccionado(trabajador);
    setFaena(trabajador.faenaAsignada);
    setError(null);
    setExito(false);
  };

  // Validaciones del Formulario de Registro de Asistencia
  const handleSubmitRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setExito(false);

    if (!trabajadorSeleccionado) {
      setError('Debes seleccionar un trabajador de la nómina.');
      return;
    }

    // 1. Validar Fecha: No posterior a la fecha actual
    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const fechaHoy = new Date();
    fechaHoy.setHours(23, 59, 59, 999);

    if (fechaSeleccionada > fechaHoy) {
      setError('La fecha de la jornada no puede ser posterior a la fecha actual.');
      return;
    }

    // 2. Validar Horas (solo si el estado no es Inasistencia)
    if (estadoAsistencia !== 'Inasistencia') {
      if (!horaEntrada || !horaSalida) {
        setError('Las horas de entrada y salida son obligatorias.');
        return;
      }

      const [entHH, entMM] = horaEntrada.split(':').map(Number);
      const [salHH, salMM] = horaSalida.split(':').map(Number);

      const minutosEntrada = entHH * 60 + entMM;
      const minutosSalida = salHH * 60 + salMM;

      if (minutosSalida <= minutosEntrada) {
        setError('La hora de salida debe ser mayor a la hora de entrada.');
        return;
      }
    }

    // Registro exitoso en Frontend
    setExito(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Encabezado Módulo Administrativo */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <UserCheck className="w-6 h-6 text-gray-300" />
              <span>Libro Digital de Asistencias</span>
            </h1>
            <p className="text-gray-400 text-xs mt-1">
              Módulo de Control de Jornadas Laborales y Registro de Asistencia por Faena
            </p>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg text-xs font-mono text-gray-300 border border-gray-700">
            Estado Normativo: Ord. N° 2927/58 DT
          </div>
        </div>

        {/* ESTRUCTURA PRINCIPAL EN 2 DIVS / PANELES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================== */}
          {/* DIV 1: LISTADO Y FILTRO DE TRABAJADORES   */}
          {/* ========================================== */}
          <div className="lg:col-span-5 bg-gray-200 border border-gray-300 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-gray-300 pb-3">
              <h2 className="font-bold text-gray-900 text-base flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-700" />
                <span>Nómina de Trabajadores</span>
              </h2>
              <span className="text-xs font-semibold bg-gray-300 text-gray-800 px-2.5 py-1 rounded-full">
                {trabajadoresFiltrados.length} Registros
              </span>
            </div>

            {/* Controles de Búsqueda y Filtro */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o RUT..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={faenaFiltroListado}
                  onChange={(e) => setFaenaFiltroListado(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
                >
                  <option value="Todas">Todas las Faenas</option>
                  <option value="Puente Urbano">Puente Urbano</option>
                  <option value="Edificio Oficinas">Edificio Oficinas</option>
                  <option value="Planta Logística">Planta Logística</option>
                  <option value="Complejo Residencial">Complejo Residencial</option>
                </select>
              </div>
            </div>

            {/* Listado de Trabajadores */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {trabajadoresFiltrados.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-8">No se encontraron trabajadores con el criterio ingresado.</p>
              ) : (
                trabajadoresFiltrados.map((trabajador) => {
                  const estaSeleccionado = trabajadorSeleccionado?.id === trabajador.id;
                  return (
                    <div
                      key={trabajador.id}
                      onClick={() => handleSeleccionarTrabajador(trabajador)}
                      className={`
                        p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center
                        ${estaSeleccionado 
                          ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                          : 'bg-gray-100 hover:bg-gray-150 border-gray-300 text-gray-900'}
                      `}
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-bold leading-none">{trabajador.nombre}</p>
                        <p className={`text-[11px] font-mono ${estaSeleccionado ? 'text-gray-300' : 'text-gray-600'}`}>
                          RUT: {trabajador.rut}
                        </p>
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                          estaSeleccionado ? 'bg-gray-800 text-gray-200' : 'bg-gray-300 text-gray-800'
                        }`}>
                          {trabajador.cargo}
                        </span>
                      </div>
                      <span className={`text-[10px] font-medium ${estaSeleccionado ? 'text-gray-300' : 'text-gray-500'}`}>
                        {trabajador.faenaAsignada}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* DIV 2: REGISTRO Y CONSULTA DE JORNADA (TRABAJADOR SELECCIONADO) */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 bg-gray-200 border border-gray-300 rounded-2xl p-6 shadow-md space-y-6">
            
            <div className="border-b border-gray-300 pb-4 flex justify-between items-start">
              <div>
                <h2 className="font-bold text-gray-900 text-base flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-700" />
                  <span>Registro de Jornada Laboral</span>
                </h2>
                <p className="text-gray-600 text-xs mt-0.5">Ingreso diario de marcajes de asistencia y cumplimiento horaria</p>
              </div>
              
              {trabajadorSeleccionado && (
                <div className="text-right">
                  <span className="block text-xs font-bold text-gray-900">{trabajadorSeleccionado.nombre}</span>
                  <span className="text-[11px] font-mono text-gray-600">RUT: {trabajadorSeleccionado.rut}</span>
                </div>
              )}
            </div>

            {/* Alert de Error / Éxito */}
            {error && (
              <div className="bg-gray-300 border-l-4 border-gray-900 text-gray-900 p-3.5 rounded-r-lg flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 text-gray-900 flex-shrink-0" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}

            {exito && (
              <div className="bg-gray-800 text-white p-3.5 rounded-lg flex items-center space-x-2.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <p className="text-xs font-medium">Jornada registrada correctamente en el libro digital de asistencia.</p>
              </div>
            )}

            {/* FORMULARIO DE ASISTENCIA */}
            <form onSubmit={handleSubmitRegistro} className="space-y-5">
              
              {/* Fila 1: RUT (Solo Lectura / Validado) y Faena */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    RUT del Trabajador *
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={trabajadorSeleccionado ? trabajadorSeleccionado.rut : ''}
                    className="w-full px-3.5 py-2.5 bg-gray-300 border border-gray-400 rounded-lg text-gray-900 font-mono text-xs font-bold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Faena u Obra *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                    <select
                      required
                      value={faena}
                      onChange={(e) => setFaena(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
                    >
                      <option value="Puente Urbano">Puente Urbano</option>
                      <option value="Edificio Oficinas">Edificio Oficinas</option>
                      <option value="Planta Logística">Planta Logística</option>
                      <option value="Complejo Residencial">Complejo Residencial</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fila 2: Fecha y Estado de Asistencia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Fecha de Jornada *
                  </label>
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]} // Impide seleccionar fechas futuras
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Estado de Asistencia *
                  </label>
                  <select
                    required
                    value={estadoAsistencia}
                    onChange={(e) => setEstadoAsistencia(e.target.value as 'Presente' | 'Atraso' | 'Inasistencia')}
                    className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-semibold"
                  >
                    <option value="Presente">Presente</option>
                    <option value="Atraso">Atraso</option>
                    <option value="Inasistencia">Inasistencia</option>
                  </select>
                </div>
              </div>

              {/* Fila 3: Horas de Entrada y Salida (Inhabilitadas si es Inasistencia) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-300">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-gray-700" />
                    <span>Hora de Entrada (24 hrs) *</span>
                  </label>
                  <input
                    type="time"
                    required={estadoAsistencia !== 'Inasistencia'}
                    disabled={estadoAsistencia === 'Inasistencia'}
                    value={horaEntrada}
                    onChange={(e) => setHoraEntrada(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 disabled:opacity-50 disabled:bg-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-gray-700" />
                    <span>Hora de Salida (24 hrs) *</span>
                  </label>
                  <input
                    type="time"
                    required={estadoAsistencia !== 'Inasistencia'}
                    disabled={estadoAsistencia === 'Inasistencia'}
                    value={horaSalida}
                    onChange={(e) => setHoraSalida(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 disabled:opacity-50 disabled:bg-gray-300"
                  />
                </div>
              </div>

              {/* Botón Guardar Asistencia */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg text-xs shadow-md transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Registro de Asistencia</span>
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}