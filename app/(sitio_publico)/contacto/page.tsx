'use client';

import { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function ContactoPage() {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipoPartida, setTipoPartida] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [archivoAdjunto, setArchivoAdjunto] = useState<File | null>(null);

  // Estados de control de la UI
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Manejo de la selección del archivo (Planos o Especificaciones)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];

    if (file) {
      const maxTamanoBytes = 10 * 1024 * 1024; // 10MB
      const regexFormatosPermitidos = /\.(pdf|dwg|cad|zip|jpg|jpeg|png)$/i;

      // Validación de formato
      if (!regexFormatosPermitidos.test(file.name)) {
        setError('Formato no permitido. Solo se aceptan archivos PDF, DWG, CAD, ZIP o imágenes.');
        setArchivoAdjunto(null);
        e.target.value = '';
        return;
      }

      // Validación de tamaño
      if (file.size > maxTamanoBytes) {
        setError('El archivo supera el límite máximo permitido de 10MB.');
        setArchivoAdjunto(null);
        e.target.value = '';
        return;
      }

      setArchivoAdjunto(file);
    }
  };

  // Validación y envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación de campos obligatorios básicos
    if (!email.trim() || !tipoPartida) {
      setError('Por favor, completa los campos obligatorios: Correo electrónico y Tipo de Partida.');
      return;
    }

    setCargando(true);
    
    // Simulación de envío a la API
    setTimeout(() => {
      setCargando(false);
      setEnviado(true);
    }, 1200);
  };

  // Estilos compartidos
  const inputEstilo = "w-full px-4 py-3 bg-gray-100 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all text-sm";
  const labelEstilo = "block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2";

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Encabezado */}
        <div className="bg-gray-900 text-white rounded-t-2xl p-8 shadow-md">
          <h1 className="text-3xl font-extrabold tracking-tight">Contacto y Presupuestos</h1>
          <p className="text-gray-300 mt-2 text-sm">
            Cotiza partidas de enfierradura, excavación u otras especialidades de forma directa. Nuestro equipo técnico revisará tu solicitud y te contactará a la brevedad.
          </p>
        </div>

        {/* Contenedor del Formulario */}
        <div className="bg-gray-200 border-x border-b border-gray-300 rounded-b-2xl p-8 shadow-lg">
          
          {enviado ? (
            <div className="bg-gray-100 border border-gray-400 rounded-xl p-8 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-gray-800 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">¡Solicitud Enviada!</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                Hemos recibido tu solicitud de presupuesto. Un administrador se pondrá en contacto contigo pronto.
              </p>
              <button
                onClick={() => {
                  setEnviado(false);
                  setNombre(''); setEmail(''); setTelefono(''); setTipoPartida(''); setMensaje(''); setArchivoAdjunto(null);
                }}
                className="mt-4 px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Enviar nueva solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="bg-gray-300 border-l-4 border-gray-800 text-gray-900 p-4 rounded-r-lg flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-gray-800" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Fila 1: Nombre y Teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelEstilo}>Nombre o Empresa</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Constructora Sur" className={inputEstilo} />
                </div>
                <div>
                  <label className={labelEstilo}>Teléfono</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-sm text-gray-500 font-medium">+56</span>
                    <input type="tel" maxLength={9} value={telefono} onChange={(e) => setTelefono(e.target.value.replace(/[^0-9]/g, ''))} placeholder="912345678" className={`${inputEstilo} pl-14`} />
                  </div>
                </div>
              </div>

              {/* Fila 2: Email y Tipo de Partida */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelEstilo}>Correo Electrónico *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contacto@empresa.com" className={inputEstilo} />
                </div>
                <div>
                  <label className={labelEstilo}>Tipo de Partida a Cotizar *</label>
                  <select required value={tipoPartida} onChange={(e) => setTipoPartida(e.target.value)} className={inputEstilo}>
                    <option value="">-- Selecciona una opción --</option>
                    <option value="Enfierradura">Enfierradura</option>
                    <option value="Excavación">Excavación</option>
                    <option value="Obras Civiles">Obras Civiles</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              {/* Detalle / Mensaje */}
              <div>
                <label className={labelEstilo}>Detalles del Proyecto</label>
                <textarea 
                  rows={4}
                  value={mensaje} 
                  onChange={(e) => setMensaje(e.target.value)} 
                  placeholder="Describe brevemente los requerimientos, ubicación de la obra y plazos esperados..." 
                  className={`${inputEstilo} resize-none`}
                />
              </div>

              {/* Carga de Archivos */}
              <div>
                <label className={labelEstilo}>Adjuntar Planos o Especificaciones (Opcional)</label>
                <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 bg-gray-100 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                  <input 
                    type="file" 
                    accept=".pdf,.dwg,.cad,.zip,.jpg,.jpeg,.png" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="w-8 h-8 text-gray-600" />
                    {archivoAdjunto ? (
                      <div className="flex items-center space-x-2 text-gray-900 font-medium">
                        <FileText className="w-5 h-5 text-gray-700" />
                        <span>{archivoAdjunto.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(archivoAdjunto.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-gray-800">Haz clic para adjuntar o arrastra tu archivo aquí</p>
                        <p className="text-xs text-gray-500">Formatos admitidos: PDF, DWG, CAD, ZIP, Imágenes (Máx. 10MB)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón de Enviar */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {cargando ? <span>Procesando envío...</span> : <span>Enviar Solicitud</span>}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}