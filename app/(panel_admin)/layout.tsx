import type { Metadata } from 'next';
import '@/app/globals.css'; // Usamos la ruta absoluta para evitar errores de CSS

export const metadata: Metadata = {
  title: 'Panel de Administración - Login',
  description: 'Acceso privado para administradores',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* Fondo en gris medio-oscuro (bg-gray-500 a bg-gray-600) enmarcando toda la pantalla */}
      <body className="bg-gray-600 min-h-screen flex items-center justify-center align-middle p-4 text-gray-900">
        <main className="w-full flex justify-center items-center">
          {children}
        </main>
      </body>
    </html>
  );
}