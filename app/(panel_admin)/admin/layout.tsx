import Link from 'next/link';
import { 
  BookOpen, 
  Calculator, 
  FileText, 
  FolderArchive, 
  Users, 
  TrendingUp, 
  LogOut, 
  Bell 
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-200 overflow-hidden">
      
      {/* 1. SIDEBAR LATERAL IZQUIERDO (Se mantiene fijo en todas las vistas de /admin) */}
      <aside className="w-72 bg-gray-900 text-gray-200 flex flex-col justify-between border-r border-gray-800 flex-shrink-0">
        <div>
          {/* Header del Sidebar */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold tracking-wider text-white uppercase">
              Panel Admin
            </h1>
            <p className="text-xs text-gray-400 mt-1">Gestión de Obras y Personal</p>
          </div>

          {/* Menú de Navegación con las 6 Opciones */}
          <nav className="p-4 space-y-1">
            <Link
              href="/admin/asistencia"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <BookOpen className="w-5 h-5 text-gray-400" />
              <span>Libro de Asistencias</span>
            </Link>

            <Link
              href="/admin/liquidaciones"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <Calculator className="w-5 h-5 text-gray-400" />
              <span>Cálculo de Liquidaciones</span>
            </Link>

            <Link
              href="/admin/finiquito"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <FileText className="w-5 h-5 text-gray-400" />
              <span>Cálculo de Finiquito</span>
            </Link>

            <Link
              href="/admin/documentacion"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <FolderArchive className="w-5 h-5 text-gray-400" />
              <span>Repositorio y Mandatos</span>
            </Link>

            <Link
              href="/admin/trabajadores"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <Users className="w-5 h-5 text-gray-400" />
              <span>Registro Histórico</span>
            </Link>

            <Link
              href="/admin/motor-predictivo"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-gray-400" />
              <span>Motor Predictivo de Obras</span>
            </Link>
          </nav>
        </div>

        {/* Footer del Sidebar (Cerrar Sesión) */}
        <div className="p-4 border-t border-gray-800">
          <Link
            href="/formulario"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-800 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </Link>
        </div>
      </aside>

      {/* 2. ÁREA DE CONTENIDO DERECHO */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Superior Delgado */}
        <header className="h-16 bg-gray-300 border-b border-gray-400 flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">
            Módulo de Control
          </h2>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold text-sm">
              AD
            </div>
            <span className="text-sm font-medium text-gray-700">Administrador</span>
          </div>
        </header>

        {/* Cuerpo Principal: Dividido en Vista Principal + Notificaciones */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6">
          
          {/* Vista Dinámica de cada Opción del Menú */}
          <main className="flex-1 bg-gray-100 rounded-xl shadow-sm border border-gray-300 p-6 overflow-y-auto">
            {children}
          </main>

          {/* 3. LISTADO LATERAL DERECHO DE NOTIFICACIONES */}
          <aside className="w-80 bg-gray-300 rounded-xl shadow-sm border border-gray-400 p-5 flex flex-col flex-shrink-0 overflow-y-auto">
            <div className="flex items-center space-x-2 pb-4 border-b border-gray-400 mb-4">
              <Bell className="w-5 h-5 text-gray-700" />
              <h3 className="font-bold text-gray-800">Notificaciones</h3>
            </div>

            <div className="space-y-3 flex-1">
              {/* Notificación 1 */}
              <div className="p-3 bg-gray-100 rounded-lg border border-gray-400 shadow-sm">
                <p className="text-xs font-semibold text-gray-800">Cálculo de Finiquito</p>
                <p className="text-xs text-gray-600 mt-1">Solicitud enviada para la Obra Norte #402.</p>
                <span className="text-[10px] text-gray-500 mt-2 block">Hace 15 mins</span>
              </div>

              {/* Notificación 2 */}
              <div className="p-3 bg-gray-100 rounded-lg border border-gray-400 shadow-sm">
                <p className="text-xs font-semibold text-gray-800">Libro de Asistencias</p>
                <p className="text-xs text-gray-600 mt-1">Alerta: 3 marcas pendientes de firma digital.</p>
                <span className="text-[10px] text-gray-500 mt-2 block">Hace 1 hora</span>
              </div>

              {/* Notificación 3 */}
              <div className="p-3 bg-gray-100 rounded-lg border border-gray-400 shadow-sm">
                <p className="text-xs font-semibold text-gray-800">Motor Predictivo</p>
                <p className="text-xs text-gray-600 mt-1">Reporte de desviación de costos disponible.</p>
                <span className="text-[10px] text-gray-500 mt-2 block">Hace 3 horas</span>
              </div>
            </div>
          </aside>

        </div>
      </div>

    </div>
  );
}