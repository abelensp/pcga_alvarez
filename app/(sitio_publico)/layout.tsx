import type { Metadata } from 'next';
import Link from 'next/link';
import {  Mail  } from 'lucide-react'; // Iconos de Lucide
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Mi Sitio Web',
  description: 'Página principal creada con Next.js y React',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-00 flex flex-col min-h-screen">
        {/* HEADER: Se mantiene en todas las páginas asociadas a este layout */}
        <header className="bg-gray-500 text-gray-100 border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Alineación a la izquierda: Logo + Opciones */}
            <div className="flex items-center space-x-8">
              {/* Logo (Placeholder) */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center font-bold text-gray-200">
                  LOGO
                </div>
              </Link>

              {/* Menú de Navegación */}
              <nav className="flex space-x-6">
                <Link href="/sobre_nosotros" className="hover:text-gray-400 transition-colors">
                  Sobre Nosotros
                </Link>
                <Link href="/proyectos" className="hover:text-gray-400 transition-colors">
                  Proyectos
                </Link>
                <Link href="/trabaja_con_nosotros" className="hover:text-gray-400 transition-colors">
                  Trabaja con Nosotros
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* CUERPO DINÁMICO: Aquí se inyecta el contenido de cada página */}
        <main className="flex-grow">{children}</main>

        {/* FOOTER: Compartido en todas las páginas */}
        <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 py-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna Izquierda: Título Placeholder */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">NOMBRE DE LA PÁGINA</h2>
              <p className="text-gray-400 text-sm">
                Descripción breve o eslogan de la empresa.
              </p>
            </div>

            {/* Columna Derecha: Iconos de contacto y enlaces */}
            <div className="flex flex-col items-start md:items-end">
              {/* Iconos de Redes Sociales */}
              <div className="flex space-x-4 mb-4">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  {/* <Instagram className="w-6 h-6" /> */}
                </a>
                <a href="mailto:contacto@ejemplo.com" className="hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  {/* <Linkedin className="w-6 h-6" /> */}
                </a>
              </div>

              {/* Listado de links en el Footer */}
              <ul className="flex flex-wrap gap-4 text-sm text-gray-400">
                <li><Link href="/sobre-nosotros" className="hover:underline">Sobre Nosotros</Link></li>
                <li><Link href="/proyectos" className="hover:underline">Proyectos</Link></li>
                <li><Link href="/trabaja-con-nosotros" className="hover:underline">Trabaja con Nosotros</Link></li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}