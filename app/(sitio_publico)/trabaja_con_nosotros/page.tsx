'use client';

import { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function TrabajaConNosotrosPage() {
  // 1. ESTADOS - Datos Personales Originales
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [archivoCV, setArchivoCV] = useState<File | null>(null);

  // 2. ESTADOS - Nuevos campos (Ficha de Ingreso hasta Sección 3)
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudadComuna, setCiudadComuna] = useState('');
  const [contactoEmergencia, setContactoEmergencia] = useState('');
  
  const [afp, setAfp] = useState('');
  const [cotizaActualmente, setCotizaActualmente] = useState('');
  const [sistemaSalud, setSistemaSalud] = useState('');

  // Estados de control de la UI
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Helper para formatear y validar el RUT Chileno
  const formatearRut = (valor: string) => {
    const limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length <= 1) return limpio;
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpoFormateado}-${dv}`;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRut(formatearRut(e.target.value));
  };

  // Manejo de la selección del archivo CV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];

    if (file) {
      const extensionesPermitidas = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      const maxTamanoBytes = 5 * 1024 * 1024; // 5MB

      if (!extensionesPermitidas.includes(file.type) && !file.name.match(/\.(pdf|docx|doc)$/i)) {
        setError('El archivo adjunto debe estar estrictamente en formato PDF o DOCX.');
        setArchivoCV(null);
        e.target.value = '';
        return;
      }

      if (file.size > maxTamanoBytes) {
        setError('El archivo supera el límite máximo permitido de 5MB.');
        setArchivoCV(null);
        e.target.value = '';
        return;
      }
      setArchivoCV(file);
    }
  };

  // Envió y validación general del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexNombre.test(nombre.trim())) {
      setError('El nombre completo solo debe contener caracteres alfabéticos.');
      return;
    }

    const rutLimpio = rut.replace(/\./g, '');
    if (rutLimpio.length < 8 || !rutLimpio.includes('-')) {
      setError('Por favor, ingresa un RUT válido con su dígito verificador.');
      return;
    }

    const regexTelefono = /^[0-9]{9}$/;
    if (!regexTelefono.test(telefono)) {
      setError('El teléfono de contacto debe contener exactamente 9 dígitos numéricos.');
      return;
    }

    if (!archivoCV) {
      setError('Es obligatorio adjuntar tu Currículum Vitae en formato PDF o DOCX.');
      return;
    }

    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      setEnviado(true);
    }, 1200);
  };

  // Input compartidos para reutilizar estilos
  const inputEstilo = "w-full px-4 py-3 bg-gray-100 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all text-sm";
  const labelEstilo = "block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2";

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado */}
        <div className="bg-[#606E77] text-white rounded-t-2xl p-8 shadow-md">
          <h1 className="text-3xl font-extrabold tracking-tight">Trabaja con Nosotros</h1>
          <p className="text-gray-300 mt-2 text-sm">
            Únete a nuestro equipo de trabajo en obra. Completa el siguiente formulario para ingresar tus antecedentes a nuestra base.
          </p>
        </div>

        {/* Contenedor del Formulario */}
        <div className="bg-gray-200 border-x border-b border-gray-300 rounded-b-2xl p-8 shadow-lg">
          
          {enviado ? (
            <div className="bg-gray-100 border border-gray-400 rounded-xl p-8 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-gray-800 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">¡Postulación Recibida!</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                Tus datos y currículum han sido registrados correctamente. Nuestro departamento de Selección revisará tus antecedentes para los proyectos activos.
              </p>
              <button
                onClick={() => {
                  setEnviado(false);
                  setNombre(''); setRut(''); setEmail(''); setTelefono(''); setEspecialidad('');
                  setFechaNacimiento(''); setNacionalidad(''); setEstadoCivil(''); setDireccion('');
                  setCiudadComuna(''); setContactoEmergencia(''); setAfp(''); setCotizaActualmente('');
                  setSistemaSalud(''); setArchivoCV(null);
                }}
                className="mt-4 px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Enviar otra postulación
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {error && (
                <div className="bg-gray-300 border-l-4 border-gray-800 text-gray-900 p-4 rounded-r-lg flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-gray-800" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* === SECCIÓN 1: DATOS PERSONALES === */}
              <div>
                <h3 className="text-lg font-bold border-b border-gray-400 pb-2 mb-4 text-gray-800">1. Datos Personales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelEstilo}>Nombre Completo *</label>
                    <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Juan Pérez González" className={inputEstilo} />
                  </div>
                  <div>
                    <label className={labelEstilo}>RUT del Trabajador *</label>
                    <input type="text" required maxLength={12} value={rut} onChange={handleRutChange} placeholder="12.345.678-K" className={inputEstilo} />
                  </div>
                  <div>
                    <label className={labelEstilo}>Fecha de Nacimiento *</label>
                    <input type="date" required value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} className={inputEstilo} />
                  </div>
                  <div>
                    <label className={labelEstilo}>Nacionalidad *</label>
                    <input type="text" required value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} placeholder="Chilena" className={inputEstilo} />
                  </div>
                  <div>
                    <label className={labelEstilo}>Estado Civil *</label>
                    <select required value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)} className={inputEstilo}>
                      <option value="">-- Seleccionar --</option>
                      <option value="Soltero/a">Soltero/a</option>
                      <option value="Casado/a">Casado/a</option>
                      <option value="Divorciado/a">Divorciado/a</option>
                      <option value="Viudo/a">Viudo/a</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelEstilo}>Teléfono de Contacto *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-sm text-gray-500 font-medium">+56</span>
                      <input type="tel" required maxLength={9} value={telefono} onChange={(e) => setTelefono(e.target.value.replace(/[^0-9]/g, ''))} placeholder="912345678" className={`${inputEstilo} pl-14`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelEstilo}>Correo Electrónico *</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@dominio.com" className={inputEstilo} />
                  </div>
                  <div>
                    <label className={labelEstilo}>Contacto Emergencia (Nombre y Parentesco) *</label>
                    <input type="text" required value={contactoEmergencia} onChange={(e) => setContactoEmergencia(e.target.value)} placeholder="María Pérez (Madre) - +56912345678" className={inputEstilo} />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelEstilo}>Dirección Completa *</label>
                      <input type="text" required value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Calle Ejemplo 123, Depto 4" className={inputEstilo} />
                    </div>
                    <div>
                      <label className={labelEstilo}>Ciudad / Comuna *</label>
                      <input type="text" required value={ciudadComuna} onChange={(e) => setCiudadComuna(e.target.value)} placeholder="Viña del Mar" className={inputEstilo} />
                    </div>
                  </div>
                </div>
              </div>

              {/* === SECCIÓN 2 y 3: PREVISIÓN Y SALUD === */}
              <div>
                <h3 className="text-lg font-bold border-b border-gray-400 pb-2 mb-4 text-gray-800">2. Previsión y Salud</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelEstilo}>Sistema Previsional AFP *</label>
                    <select required value={afp} onChange={(e) => setAfp(e.target.value)} className={inputEstilo}>
                      <option value="">-- Seleccionar AFP --</option>
                      <option value="Capital">Capital</option>
                      <option value="Cuprum">Cuprum</option>
                      <option value="Habitat">Habitat</option>
                      <option value="PlanVital">PlanVital</option>
                      <option value="ProVida">ProVida</option>
                      <option value="Modelo">Modelo</option>
                      <option value="Uno">Uno (AFP Uno)</option>
                      <option value="No afiliado">No afiliado aún</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelEstilo}>¿Cotiza Actualmente? *</label>
                    <select required value={cotizaActualmente} onChange={(e) => setCotizaActualmente(e.target.value)} className={inputEstilo}>
                      <option value="">-- Seleccionar --</option>
                      <option value="Si">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelEstilo}>Sistema de Salud *</label>
                    <select required value={sistemaSalud} onChange={(e) => setSistemaSalud(e.target.value)} className={inputEstilo}>
                      <option value="">-- Seleccionar Sistema de Salud --</option>
                      <option value="FONASA Tramo A">FONASA Tramo A</option>
                      <option value="FONASA Tramo B">FONASA Tramo B</option>
                      <option value="FONASA Tramo C">FONASA Tramo C</option>
                      <option value="FONASA Tramo D">FONASA Tramo D</option>
                      <option value="Banmédica">Banmédica</option>
                      <option value="Colmena">Colmena</option>
                      <option value="Cruz Blanca">Cruz Blanca</option>
                      <option value="Consalud">Consalud</option>
                      <option value="Esencial">Esencial</option>
                      <option value="MásVida">MásVida</option>
                      <option value="Vida Tres">Vida Tres</option>
                      <option value="Otra ISAPRE">Otra ISAPRE</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* === SECCIÓN 4: ESPECIALIDAD Y CV === */}
              <div>
                <h3 className="text-lg font-bold border-b border-gray-400 pb-2 mb-4 text-gray-800">3. Especialidad y Currículum</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className={labelEstilo}>Especialidad Técnica *</label>
                    <select required value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} className={inputEstilo}>
                      <option value="">-- Selecciona una especialidad --</option>
                      <option value="Enfierrador">Enfierrador</option>
                      <option value="Encofrador">Encofrador</option>
                      <option value="Jornal">Jornal</option>
                      <option value="Concretero">Concretero</option>
                      <option value="Operador de maquinaria">Operador de maquinaria</option>
                    </select>
                  </div>

                  {/* Adjuntar Currículum Vitae (PDF / DOCX Max 5MB) */}
                  <div className="md:col-span-2">
                    <label className={labelEstilo}>Currículum Vitae (PDF / DOCX máx. 5MB) *</label>
                    <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 bg-gray-100 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                      <input type="file" required accept=".pdf,.docx,.doc" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="w-8 h-8 text-gray-600" />
                        {archivoCV ? (
                          <div className="flex items-center space-x-2 text-gray-900 font-medium">
                            <FileText className="w-5 h-5 text-gray-700" />
                            <span>{archivoCV.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(archivoCV.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-gray-800">Haz clic para adjuntar o arrastra tu archivo aquí</p>
                            <p className="text-xs text-gray-500">Formatos admitidos: .pdf, .docx (Máximo 5MB)</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de Enviar Postulación */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {cargando ? <span>Validando y procesando...</span> : <span>Enviar Postulación</span>}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}