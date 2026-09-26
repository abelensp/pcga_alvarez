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
      <header className="w-full bg-[#2D3A42] text-white shadow-md">
      {/* Cambiamos "container mx-auto" por "w-full" para que el flexbox empuje los elementos a los extremos */}
      <div className="w-full flex justify-between items-center h-24 px-6 lg:px-12">
        
        {/* Sección Izquierda: Logo y Títulos */}
        <div className="flex items-center space-x-4">
          {/* Contenedor del Logo circular */}
          <div className="bg-white p-1 h-20 w-20 flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-sm">
            <Link href="/"><img 
              src="/logo-alvarez.svg" 
              alt="Logo Álvarez Infraestructura" 
              className="max-h-full max-w-full object-contain rounded-lg"
            /></Link>
          </div>
          
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight leading-none mb-1">
              Carlos Alberto Álvarez Villar
            </h1>
            <span className="text-sm lg:text-base font-light">
              Contratista en Construcción E.I.R.L.
            </span>
          </div>
        </div>

        {/* Sección Derecha: Menú de navegación e Ícono pegados a la derecha */}
        <div className="flex items-center space-x-6 lg:space-x-10">
          
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-lg font-normal">
            <Link href="/sobre_nosotros" className="hover:text-gray-300 transition-colors">
              Sobre Nosotros
            </Link>
            <Link href="/trabaja_con_nosotros" className="hover:text-gray-300 transition-colors">
              Trabaja con nosotros
            </Link>
            <Link href="/contacto" className="hover:text-gray-300 transition-colors">
              Contacto
            </Link>
          </nav>

          <Link href="/login" className="hover:text-gray-300 transition-colors" aria-label="Iniciar Sesión">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 lg:h-10 lg:w-10" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                clipRule="evenodd" 
              />
            </svg>
          </Link>
        </div>

      </div>
    </header>





        {/* CUERPO DINÁMICO: Aquí se inyecta el contenido de cada página */}
        <main className="flex-grow">{children}</main>

        {/* FOOTER: Compartido en todas las páginas */}
        <footer className="bg-[#2D3A42] text-gray-300 border-t border-gray-800 py-10">
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
                <a href="mailto:ma.alvarezgonzalez@hotmail.com" className="hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  {/* <Linkedin className="w-6 h-6" /> */}
                </a>
              </div>

              {/* Listado de links en el Footer */}
              <ul className="flex flex-wrap gap-4 text-sm text-gray-400">
                <li><Link href="/sobre_nosotros" className="hover:underline">Sobre Nosotros</Link></li>
                <li><Link href="/proyectos" className="hover:underline">Proyectos</Link></li>
                <li><Link href="/trabaja_con_nosotros" className="hover:underline">Trabaja con Nosotros</Link></li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}