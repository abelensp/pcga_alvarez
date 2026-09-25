'use client';

import React, { useState } from 'react';

// Tipos de datos simulados
type Worker = {
  id: string;
  rut: string;
  nombre: string;
  cargo: string;
  fechaInicio: string;
  sueldoBase: number;
};

// Datos de prueba
const WORKERS_MOCK: Worker[] = [
  { id: '1', rut: '12.345.678-9', nombre: 'Juan Pérez', cargo: 'Operario de Faena', fechaInicio: '2022-03-15', sueldoBase: 650000 },
  { id: '2', rut: '98.765.432-1', nombre: 'María González', cargo: 'Supervisora de Terreno', fechaInicio: '2020-01-10', sueldoBase: 950000 },
  { id: '3', rut: '15.678.901-2', nombre: 'Carlos Rodríguez', cargo: 'Mecánico de Maquinaria', fechaInicio: '2023-08-01', sueldoBase: 780000 },
];

export default function RemuneracionesPage() {
  // Estado para la pestaña activa ('liquidacion' | 'finiquito')
  const [activeTab, setActiveTab] = useState<'liquidacion' | 'finiquito'>('liquidacion');

  // Estado de búsqueda y selección
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  // Estados Formulario Liquidación
  const [periodo, setPeriodo] = useState('2026-09');
  const [bonosImponibles, setBonosImponibles] = useState<number>(0);
  const [bonosNoImponibles, setBonosNoImponibles] = useState<number>(0);
  const [descuentosAnticipos, setDescuentosAnticipos] = useState<number>(0);

  // Estados Formulario Finiquito
  const [fechaTermino, setFechaTermino] = useState('');
  const [causalTermino, setCausalTermino] = useState('art161');
  const [diasVacaciones, setDiasVacaciones] = useState<number>(0);

  // Estado de cálculo / vista previa
  const [previewCalculo, setPreviewCalculo] = useState<any | null>(null);

  // Filtrado de trabajadores
  const filteredWorkers = WORKERS_MOCK.filter(
    (w) =>
      w.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.rut.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejo de cálculo de Liquidación
  const handleCalcularLiquidacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;

    // Lógica simulada de liquidación (Simulación RF02 + DT)
    const horasExtras = 15; // Simulación extraída de RF02
    const montoHorasExtras = Math.round((selectedWorker.sueldoBase / 180) * 1.5 * horasExtras);
    const totalImponible = selectedWorker.sueldoBase + bonosImponibles + montoHorasExtras;
    const gratificacion = Math.min(totalImponible * 0.25, 160000); // Tope mensual aprox

    const afp = Math.round((totalImponible + gratificacion) * 0.1145);
    const salud = Math.round((totalImponible + gratificacion) * 0.07);
    const totalDescuentos = afp + salud + descuentosAnticipos;

    const alcanceLiquido = totalImponible + gratificacion + bonosNoImponibles - totalDescuentos;

    setPreviewCalculo({
      tipo: 'liquidacion',
      sueldoBase: selectedWorker.sueldoBase,
      horasExtrasMonto: montoHorasExtras,
      gratificacion,
      bonosImponibles,
      bonosNoImponibles,
      afp,
      salud,
      descuentosAnticipos,
      totalLiquido: alcanceLiquido,
    });
  };

  // Manejo de cálculo de Finiquito
  const handleCalcularFiniquito = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker || !fechaTermino) return;

    // Lógica simulada de indemnización (DT)
    const indemnizacionAnios = causalTermino === 'art161' ? selectedWorker.sueldoBase * 2 : 0; // 2 años aprox
    const avisoPrevio = causalTermino === 'art161' ? selectedWorker.sueldoBase : 0;
    const valorDiaVacaciones = Math.round(selectedWorker.sueldoBase / 30);
    const montoVacaciones = diasVacaciones * valorDiaVacaciones;

    const totalFiniquito = indemnizacionAnios + avisoPrevio + montoVacaciones;

    setPreviewCalculo({
      tipo: 'finiquito',
      indemnizacionAnios,
      avisoPrevio,
      montoVacaciones,
      totalFiniquito,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      {/* Header con Selector de Módulo */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Módulo de Gestión de Personal</h1>
        
        {/* Toggle de Liquidación / Finiquito */}
        <div className="flex bg-gray-100 p-1 rounded-lg border">
          <button
            onClick={() => {
              setActiveTab('liquidacion');
              setPreviewCalculo(null);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'liquidacion'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Liquidaciones de Sueldo
          </button>
          <button
            onClick={() => {
              setActiveTab('finiquito');
              setPreviewCalculo(null);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'finiquito'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Finiquitos y Salidas
          </button>
        </div>
      </header>

      {/* Estructura Principal: 2 Divs Flexibles */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* DIV 1: Barra de Búsqueda y Lista de Trabajadores */}
        <div className="w-1/3 min-w-[320px] max-w-[420px] bg-white border-r flex flex-col p-4">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Buscar Trabajador
            </label>
            <input
              type="text"
              placeholder="Filtrar por nombre o RUT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Lista de Resultados */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredWorkers.map((worker) => {
              const isSelected = selectedWorker?.id === worker.id;
              return (
                <div
                  key={worker.id}
                  onClick={() => {
                    setSelectedWorker(worker);
                    setPreviewCalculo(null);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-semibold text-gray-900 text-sm">{worker.nombre}</p>
                  <p className="text-xs text-gray-500">RUT: {worker.rut}</p>
                  <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
                    <span>{worker.cargo}</span>
                    <span className="font-medium text-gray-600">
                      ${worker.sueldoBase.toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredWorkers.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No se encontraron trabajadores.
              </p>
            )}
          </div>
        </div>

        {/* DIV 2: Formulario de Proceso / Generación */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {!selectedWorker ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Selecciona un trabajador de la lista izquierda para continuar.
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Card Información del Trabajador Seleccionado */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-gray-800">{selectedWorker.nombre}</h2>
                  <p className="text-xs text-gray-500">RUT: {selectedWorker.rut} | Cargo: {selectedWorker.cargo}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>Inicio Contrato: <span className="font-semibold">{selectedWorker.fechaInicio}</span></p>
                  <p>Sueldo Base: <span className="font-semibold">${selectedWorker.sueldoBase.toLocaleString('es-CL')}</span></p>
                </div>
              </div>

              {/* FORMULARIO DINÁMICO */}
              {activeTab === 'liquidacion' ? (
                /* FORMULARIO LIQUIDACIÓN DE SUELDO */
                <form onSubmit={handleCalcularLiquidacion} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                  <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">
                    Procesar Liquidación Mensual (DT)
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Período a Liquidar
                      </label>
                      <input
                        type="month"
                        value={periodo}
                        onChange={(e) => setPeriodo(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Horas Extras / Asistencia (RF02)
                      </label>
                      <input
                        type="text"
                        value="15 Horas Extras detectadas"
                        disabled
                        className="w-full px-3 py-2 border rounded-md text-sm bg-gray-100 text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Haberes / Bonos Imponibles ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={bonosImponibles}
                        onChange={(e) => setBonosImponibles(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Haberes No Imponibles ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={bonosNoImponibles}
                        onChange={(e) => setBonosNoImponibles(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Descuentos o Anticipos ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={descuentosAnticipos}
                        onChange={(e) => setDescuentosAnticipos(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md text-sm transition-colors"
                  >
                    Calcular Liquidación
                  </button>
                </form>
              ) : (
                /* FORMULARIO FINIQUITO Y SALIDAS */
                <form onSubmit={handleCalcularFiniquito} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                  <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">
                    Cálculo de Finiquito e Indemnización (DT)
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fecha Inicio Contrato
                      </label>
                      <input
                        type="date"
                        value={selectedWorker.fechaInicio}
                        disabled
                        className="w-full px-3 py-2 border rounded-md text-sm bg-gray-100 text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fecha Término Contrato
                      </label>
                      <input
                        type="date"
                        min={selectedWorker.fechaInicio}
                        value={fechaTermino}
                        onChange={(e) => setFechaTermino(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Causal de Término / Desvinculación
                      </label>
                      <select
                        value={causalTermino}
                        onChange={(e) => setCausalTermino(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white"
                      >
                        <option value="art161">Art. 161 - Necesidades de la Empresa</option>
                        <option value="art159_1">Art. 159 N°1 - Mutuo Acuerdo</option>
                        <option value="art159_2">Art. 159 N°2 - Renuncia Voluntaria</option>
                        <option value="art159_4">Art. 159 N°4 - Vencimiento del Plazo</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Días de Vacaciones Pendientes (Feriado Proporcional)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={diasVacaciones}
                        onChange={(e) => setDiasVacaciones(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md text-sm transition-colors"
                  >
                    Calcular Finiquito
                  </button>
                </form>
              )}

              {/* DESGLOSE / VISTA PREVIA Y GUARDADO */}
              {previewCalculo && (
                <div className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-gray-800 text-sm border-b pb-2">
                    Vista Previa del Desglose Financiero
                  </h4>

                  {previewCalculo.tipo === 'liquidacion' ? (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span>Sueldo Base Proporcional:</span> <span>${previewCalculo.sueldoBase.toLocaleString('es-CL')}</span></div>
                      <div className="flex justify-between"><span>Horas Extras (RF02):</span> <span>${previewCalculo.horasExtrasMonto.toLocaleString('es-CL')}</span></div>
                      <div className="flex justify-between"><span>Gratificación Legal:</span> <span>${previewCalculo.gratificacion.toLocaleString('es-CL')}</span></div>
                      <div className="flex justify-between"><span>Haberes Imponibles Adicionales:</span> <span>${previewCalculo.bonosImponibles.toLocaleString('es-CL')}</span></div>
                      <div className="flex justify-between"><span>Haberes No Imponibles:</span> <span>${previewCalculo.bonosNoImponibles.toLocaleString('es-CL')}</span></div>
                      <div className="flex justify-between text-red-600"><span>Descuentos Salud / AFP:</span> <span>-${(previewCalculo.afp + previewCalculo.salud).toLocaleString('es-CL')}</span></div>
                      <div className="flex justify-between text-red-600"><span>Anticipos / Otros Descuentos:</span> <span>-${previewCalculo.descuentosAnticipos.toLocaleString('es-CL')}</span></div>
                      
                      <div className="flex justify-between font-bold text-sm text-gray-900 border-t pt-2 mt-2">
                        <span>Total Sueldo Líquido:</span>
                        <span>${previewCalculo.totalLiquido.toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span>Indemnización Años de Servicio:</span> <span>${previewCalculo.indemnizacionAnios.toLocaleString('es-CL')}</span></div>
                      <div className="flex justify-between"><span>Indemnización Sustitutiva Aviso Previo:</span> <span>${previewCalculo.avisoPrevio.toLocaleString('es-CL')}</span></div>
                      <div className="flex justify-between"><span>Vacaciones Proporcionales:</span> <span>${previewCalculo.montoVacaciones.toLocaleString('es-CL')}</span></div>
                      
                      <div className="flex justify-between font-bold text-sm text-gray-900 border-t pt-2 mt-2">
                        <span>Total Pago Finiquito:</span>
                        <span>${previewCalculo.totalFiniquito.toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => alert(previewCalculo.tipo === 'liquidacion' ? 'Liquidación emitida correctamente' : 'Finiquito guardado e impreso')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md text-sm transition-colors mt-4"
                  >
                    {previewCalculo.tipo === 'liquidacion' ? 'Generar Liquidación' : 'Guardar y Emitir Finiquito'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}