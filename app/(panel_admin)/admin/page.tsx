export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido al Panel de Control</h1>
        <p className="text-sm text-gray-600 mt-1">
          Selecciona una opción del menú lateral para gestionar la información de la empresa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-lg border border-gray-300 shadow-sm">
          <h3 className="font-semibold text-gray-800">Trabajadores Activos</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">142</p>
        </div>

        <div className="p-5 bg-white rounded-lg border border-gray-300 shadow-sm">
          <h3 className="font-semibold text-gray-800">Obras en Ejecución</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
        </div>

        <div className="p-5 bg-white rounded-lg border border-gray-300 shadow-sm">
          <h3 className="font-semibold text-gray-800">Documentos Pendientes</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
        </div>
      </div>
    </div>
  );
}