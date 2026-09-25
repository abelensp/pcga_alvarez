'use client';

import { useState } from 'react';
import { 
  Folder, 
  Search, 
  Plus, 
  FileText, 
  Download, 
  Pencil, 
  Trash2, 
  X, 
  Upload, 
  AlertCircle, 
  Calendar,
  Tag,
  CheckCircle2
} from 'lucide-react';

// Estructura de datos para Documento / Mandato
interface Documento {
  id: number;
  titulo: string;
  categoria: string;
  fechaEmision: string;
  fechaVencimiento?: string; // Opcional (puede no tener)
  nombreArchivo: string;
  tamanoMB: number;
}

// Datos de prueba iniciales
const DOCUMENTOS_INICIALES: Documento[] = [
  {
    id: 1,
    titulo: 'Certificado de Antecedentes Laborales F30-1 - Periodo Mayo',
    categoria: 'Certificado F30/F30-1',
    fechaEmision: '2026-05-01',
    fechaVencimiento: '2026-05-30',
    nombreArchivo: 'Certificado_F30_1_Mayo2026.pdf',
    tamanoMB: 2.4,
  },
  {
    id: 2,
    titulo: 'Contrato de Trabajo Tipo Operadores de Maquinaria',
    categoria: 'Contrato',
    fechaEmision: '2026-01-15',
    // Indefinido (sin fecha de vencimiento)
    nombreArchivo: 'Contrato_Tipo_Maquinaria.pdf',
    tamanoMB: 1.8,
  },
  {
    id: 3,
    titulo: 'Mandato Especial de Representación en Obra',
    categoria: 'Mandato',
    fechaEmision: '2026-01-02',
    fechaVencimiento: '2026-12-31',
    nombreArchivo: 'Mandato_Especial_Obra_2026.pdf',
    tamanoMB: 3.1,
  },
  {
    id: 4,
    titulo: 'Reglamento Interno de Orden, Higiene y Seguridad',
    categoria: 'Normativa Interna',
    fechaEmision: '2025-10-10',
    // Sin fecha de vencimiento
    nombreArchivo: 'Reglamento_Interno_2025.pdf',
    tamanoMB: 5.6,
  },
];

const CATEGORIAS_PERMITIDAS = [
  'Certificado F30/F30-1',
  'Contrato',
  'Finiquito',
  'Mandato',
  'Normativa Interna',
  'Otros',
];

export default function DocumentacionPage() {
  // Estado local de documentos
  const [documentos, setDocumentos] = useState<Documento[]>(DOCUMENTOS_INICIALES);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');

  // Pop-Up (Modal)
  const [modalAbierto, setModalAbierto] = useState(false);
  const [documentoEnEdicion, setDocumentoEnEdicion] = useState<Documento | null>(null);

  // Campos del Formulario
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fechaEmision, setFechaEmision] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  
  // Feedback
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Filtrado de documentos
  const documentosFiltrados = documentos.filter((doc) => {
    const coincideTexto = doc.titulo.toLowerCase().includes(busqueda.toLowerCase()) || doc.nombreArchivo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === 'Todas' || doc.categoria === categoriaFiltro;
    return coincideTexto && coincideCategoria;
  });

  // Abrir Modal para Crear
  const handleAbrirCrear = () => {
    setDocumentoEnEdicion(null);
    setTitulo('');
    setCategoria('');
    setFechaEmision('');
    setFechaVencimiento('');
    setArchivo(null);
    setErrorModal(null);
    setModalAbierto(true);
  };

  // Abrir Modal para Editar
  const handleAbrirEditar = (doc: Documento) => {
    setDocumentoEnEdicion(doc);
    setTitulo(doc.titulo);
    setCategoria(doc.categoria);
    setFechaEmision(doc.fechaEmision);
    setFechaVencimiento(doc.fechaVencimiento || '');
    setArchivo(null);
    setErrorModal(null);
    setModalAbierto(true);
  };

  // Eliminar Documento
  const handleEliminar = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      setDocumentos(documentos.filter((d) => d.id !== id));
      setMensajeExito('Documento eliminado correctamente.');
      setTimeout(() => setMensajeExito(null), 3000);
    }
  };

  // Descargar Documento
  const handleDescargar = (nombreArchivo: string) => {
    alert(`Iniciando descarga segura de: ${nombreArchivo}`);
  };

  // Validar Archivo Adjunto (PDF, máx. 10MB)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorModal(null);
    const file = e.target.files?.[0];

    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setErrorModal('El archivo debe estar estrictamente en formato PDF.');
        setArchivo(null);
        e.target.value = '';
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorModal('El archivo supera el límite de 10 MB.');
        setArchivo(null);
        e.target.value = '';
        return;
      }

      setArchivo(file);
    }
  };

  // Guardar (Crear o Editar)
  const handleSubmitDocumento = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorModal(null);

    // Validaciones
    if (!titulo.trim() || titulo.length > 150) {
      setErrorModal('El título es obligatorio (máx. 150 caracteres).');
      return;
    }

    if (!categoria) {
      setErrorModal('La categoría es obligatoria.');
      return;
    }

    if (!fechaEmision) {
      setErrorModal('La fecha de emisión es obligatoria.');
      return;
    }

    if (!documentoEnEdicion && !archivo) {
      setErrorModal('Es obligatorio adjuntar un archivo PDF (máx. 10 MB).');
      return;
    }

    if (documentoEnEdicion) {
      // Editar
      setDocumentos(
        documentos.map((doc) =>
          doc.id === documentoEnEdicion.id
            ? {
                ...doc,
                titulo: titulo.trim(),
                categoria,
                fechaEmision,
                fechaVencimiento: fechaVencimiento || undefined,
                nombreArchivo: archivo ? archivo.name : doc.nombreArchivo,
                tamanoMB: archivo ? parseFloat((archivo.size / (1024 * 1024)).toFixed(1)) : doc.tamanoMB,
              }
            : doc
        )
      );
      setMensajeExito('Documento actualizado exitosamente.');
    } else {
      // Crear
      const nuevoDoc: Documento = {
        id: Date.now(),
        titulo: titulo.trim(),
        categoria,
        fechaEmision,
        fechaVencimiento: fechaVencimiento || undefined,
        nombreArchivo: archivo ? archivo.name : 'documento.pdf',
        tamanoMB: archivo ? parseFloat((archivo.size / (1024 * 1024)).toFixed(1)) : 1.5,
      };
      setDocumentos([nuevoDoc, ...documentos]);
      setMensajeExito('Documento guardado exitosamente.');
    }

    setModalAbierto(false);
    setTimeout(() => setMensajeExito(null), 3000);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <Folder className="w-6 h-6 text-gray-300" />
              <span>Gestor de Documentación y Mandatos</span>
            </h1>
            <p className="text-gray-400 text-xs mt-1">
              Repositorio de acreditación de contratos, certificados y normativas
            </p>
          </div>
        </div>

        {/* Notificación Exito */}
        {mensajeExito && (
          <div className="bg-gray-800 text-white p-3.5 rounded-xl flex items-center space-x-2.5 shadow-sm text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
            <span>{mensajeExito}</span>
          </div>
        )}

        {/* BARRA SUPERIOR DE BÚSQUEDA, FILTRO Y BOTÓN NUEVO */}
        <div className="bg-gray-200 border border-gray-300 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por título o archivo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            <div className="w-full sm:w-60">
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                <option value="Todas">Todas las Categorías</option>
                {CATEGORIAS_PERMITIDAS.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAbrirCrear}
            className="w-full md:w-auto px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg text-xs shadow-md transition-colors flex items-center justify-center space-x-2 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Documento</span>
          </button>
        </div>

        {/* CARDS DE DOCUMENTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentosFiltrados.length === 0 ? (
            <div className="col-span-full bg-gray-200 border border-gray-300 rounded-2xl p-12 text-center text-gray-500 text-xs">
              No hay documentos registrados o no coinciden con la búsqueda.
            </div>
          ) : (
            documentosFiltrados.map((doc) => (
              <div
                key={doc.id}
                className="bg-gray-200 border border-gray-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-gray-400"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-gray-300 text-gray-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      <Tag className="w-3 h-3 text-gray-700" />
                      <span>{doc.categoria}</span>
                    </span>
                    <span className="text-[10px] font-mono text-gray-600 bg-gray-300 px-2 py-0.5 rounded">
                      {doc.tamanoMB} MB
                    </span>
                  </div>

                  <h2 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                    {doc.titulo}
                  </h2>

                  <div className="space-y-1.5 pt-1 text-xs text-gray-700">
                    <div className="flex items-center space-x-1.5 text-gray-600">
                      <Calendar className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
                      <span>F. Emisión: <strong className="text-gray-900">{doc.fechaEmision}</strong></span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-gray-600">
                      <Calendar className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
                      <span>
                        F. Vencimiento:{' '}
                        {doc.fechaVencimiento ? (
                          <strong className="text-gray-900">{doc.fechaVencimiento}</strong>
                        ) : (
                          <span className="text-gray-500 italic">No aplica</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-gray-600 truncate pt-1">
                      <FileText className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
                      <span className="truncate">{doc.nombreArchivo}</span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="pt-3 border-t border-gray-300 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleDescargar(doc.nombreArchivo)}
                    className="flex-1 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </button>

                  <button
                    onClick={() => handleAbrirEditar(doc)}
                    title="Editar Documento"
                    className="p-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleEliminar(doc.id)}
                    title="Eliminar Documento"
                    className="p-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* POP-UP / MODAL DE CREACIÓN / EDICIÓN */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-200 border border-gray-400 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="bg-gray-900 text-white p-5 flex justify-between items-center">
              <h2 className="font-bold text-sm tracking-tight">
                {documentoEnEdicion ? 'Editar Documento Existente' : 'Agregar Nuevo Documento / Mandato'}
              </h2>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDocumento} className="p-6 space-y-4">
              
              {errorModal && (
                <div className="bg-gray-300 border-l-4 border-gray-900 text-gray-900 p-3 rounded-r-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-gray-900 flex-shrink-0" />
                  <p className="text-xs font-medium">{errorModal}</p>
                </div>
              )}

              {/* Título */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Título del Documento/Mandato * (máx. 150 caracteres)
                </label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Certificado F30 Periodo Actual"
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
                <span className="text-[10px] text-gray-500 float-right mt-0.5">{titulo.length}/150</span>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Categoría *
                </label>
                <select
                  required
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 font-medium"
                >
                  <option value="">-- Selecciona una categoría --</option>
                  {CATEGORIAS_PERMITIDAS.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Dosp Campos de Fechas: Emisión y Vencimiento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Fecha de Emisión *
                  </label>
                  <input
                    type="date"
                    required
                    value={fechaEmision}
                    onChange={(e) => setFechaEmision(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Fecha Vencimiento <span className="text-gray-500 font-normal">(Opcional)</span>
                  </label>
                  <input
                    type="date"
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  />
                </div>
              </div>

              {/* Archivo Adjunto */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Archivo Adjunto PDF (máx. 10MB) *
                </label>
                <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 bg-gray-100 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center space-y-1">
                    <Upload className="w-6 h-6 text-gray-600" />
                    {archivo ? (
                      <p className="text-xs font-bold text-gray-900">{archivo.name}</p>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-gray-800">
                          {documentoEnEdicion ? 'Haz clic para reemplazar el PDF' : 'Haz clic o arrastra tu PDF aquí'}
                        </p>
                        <p className="text-[10px] text-gray-500">Solo formato PDF (máx. 10MB)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="pt-3 border-t border-gray-300 flex justify-end space-x-2">
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
                  {documentoEnEdicion ? 'Guardar Cambios' : 'Registrar Documento'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}