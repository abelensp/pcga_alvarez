import Image from 'next/image';
import Link from 'next/link';
import { Clock, DollarSign, ArrowRight } from 'lucide-react';

interface Proyecto {
  id: number;
  titulo: string;
  costo: string;
  tiempo: string;
  descripcion: string;
  imagenPlaceholder: string;
}

const PROYECTOS: Proyecto[] = [
  {
    id: 1,
    titulo: 'Infraestructura Vial y Puente Urbano',
    costo: '$450.000.000 CLP',
    tiempo: '18 Meses',
    descripcion: 'Diseño y ejecución de solución vial de alto impacto para la descongestión urbana. Incluye pavimentación de alta durabilidad, iluminación LED automatizada y señalización inteligente.',
    imagenPlaceholder: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    titulo: 'Edificio de Oficinas Corporativas',
    costo: '$1.200.000.000 CLP',
    tiempo: '24 Meses',
    descripcion: 'Construcción con certificación de sostenibilidad ambiental. Dispone de fachada termopanel, sistemas eficientes de climatización centralizada y planta libre para adaptación modular.',
    imagenPlaceholder: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    titulo: 'Complejo Residencial Parque Central',
    costo: '$890.000.000 CLP',
    tiempo: '12 Meses',
    descripcion: 'Desarrollo habitacional de 120 departamentos con áreas verdes integradas, aislación sísmica de última generación y espacios comunes equipados con paneles fotovoltaicos.',
    imagenPlaceholder: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    titulo: 'Planta Industrial Logística',
    costo: '$650.000.000 CLP',
    tiempo: '10 Meses',
    descripcion: 'Nave industrial de 5.000 m² con losa reforzada de alta resistencia, accesos automatizados para transporte pesado y sistema centralizado de control de stock y seguridad.',
    imagenPlaceholder: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 5,
    titulo: 'Centro de Salud y Especialidades',
    costo: '$980.000.000 CLP',
    tiempo: '15 Meses',
    descripcion: 'Recinto de salud con estrictos estándares de aislación acústica y sanitaria. Cuenta con salas de respaldo eléctrico continuo y conectividad de red redundante para equipamiento médico.',
    imagenPlaceholder: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
  },
];



export default function HomePage() {
  return (
    <div className="space-y-16 py-12 px-6 max-w-7xl mx-auto">
      
      {/* SECCIÓN 1: Card (Texto a la izquierda, Imagen a la derecha) */}
      <section className="bg-white rounded-xl shadow-md p-20 border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Lado Izquierdo: Título y Cuerpo */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Desarrolla el futuro con nosotros
          </h1>
          <p className="text-gray-600 leading-relaxed">
            La Empresa Contratista en Construcción Carlos Álvarez Villar
            fundada hace mas de 25 años tiene todo lo que necesitas, desde
            el personal necesario a la maquinaria para el trabajo
          </p>
          <br />
          <hr />
          <br />
          <p className="text-gray-600 leading-relaxed">
            ¿Estas listo para empezar a construir el futuro con nosotros?
          </p>
          <p className="text-gray-600 leading-relaxed">
            Da el primer paso con nosotros
          </p>
        </div>

        {/* Lado Derecho: Imagen con márgenes para evitar bordes */}
        <div className="p-4 bg-gray-50 rounded-lg flex justify-center">
          {/* Usamos un contenedor con aspecto de placeholder */}
          <div className="w-full h-64 bg-gray-300 rounded-md flex items-center justify-center text-gray-600 font-medium">
            Placeholder de Imagen
          </div>
        </div>
      </section>


      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="border-b border-gray-300 pb-6 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Proyectos bajo nuestro desarrollo
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Explora nuestra trayectoria en obras de infraestructura.
          </p>
        </div>

        
        {/* Bloque 1: Proyectos Destacados Grandes (2 Colores / 2 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROYECTOS.slice(0, 2).map((proyecto) => (
            <ProyectoCard key={proyecto.id} proyecto={proyecto} esDestacado />
          ))}
        </div>

        {/* Bloque 2: Proyectos Secundarios (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROYECTOS.slice(2, 5).map((proyecto) => (
            <ProyectoCard key={proyecto.id} proyecto={proyecto} />
          ))}
        </div>

      </div>

      

      {/* SECCIÓN 2: Invertida (Imagen a la izquierda, Texto + Botón a la derecha) */}
      <section className="bg-white rounded-xl shadow-md p-10 border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Lado Izquierdo: Imagen */}
        <div className="p-4 bg-gray-50 rounded-lg flex justify-center order-2 md:order-1">
          <div className="w-full h-64 bg-gray-300 rounded-md flex items-center justify-center text-gray-600 font-medium">
            Placeholder de Imagen
          </div>
        </div>

        {/* Lado Derecho: Texto + Botón "Trabaja con Nosotros" */}
        <div className="order-1 md:order-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Únete a Nuestro Equipo
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Buscamos talento para seguir expandiendo nuestros proyectos. Conoce más sobre la cultura de nuestra empresa.
          </p>
          <Link
            href="/trabaja-con-nosotros"
            className="inline-block bg-gray-700 text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Trabaja con Nosotros
          </Link>
        </div>
      </section>

      {/* SECCIÓN 3: Bloque de texto centralizado con Botón a "Sobre Nosotros" */}
      <section className="bg-gray-400 text-white rounded-xl p-10 text-center max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Nuestra Historia y Filosofía</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Diseñamos soluciones web eficientes enfocándonos en arquitectura moderna, optimización de recursos y la mejor experiencia de usuario posible.
        </p>
        <Link
          href="/sobre-nosotros"
          className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Sobre Nosotros
        </Link>
      </section>

    </div>
  );
}

{/* Componente Reutilizable de Card con Efecto  Hover */}
function ProyectoCard({ proyecto, esDestacado = false }: { proyecto: Proyecto; esDestacado?: boolean }) {
  return (
    <article
      className="
        group relative bg-gray-200 border border-gray-300 rounded-2xl overflow-hidden shadow-md 
        transition-all duration-300 ease-in-out
        
        hover:bg-gray-100 hover:border-gray-400 hover:shadow-2xl hover:-translate-y-1 
        hover:ring-2 hover:ring-gray-400 hover:ring-opacity-50
      "
    >
      {/* Contenedor de la Imagen */}
      <div className={`relative w-full overflow-hidden ${esDestacado ? 'h-72' : 'h-56'} bg-gray-400`}>
        <Image
          src={proyecto.imagenPlaceholder}
          alt={proyecto.titulo}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Superposición brillo hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
      </div>

      {/* Contenido de la Card */}
      <div className="p-6 flex flex-col justify-between space-y-4">
        
        <div>
          <h2 className={`font-bold text-gray-900 group-hover:text-black transition-colors ${esDestacado ? 'text-2xl' : 'text-xl'}`}>
            {proyecto.titulo}
          </h2>
          
          <p className="text-gray-600 text-sm mt-3 leading-relaxed line-clamp-3">
            {proyecto.descripcion}
          </p>
        </div>

        {/* Tiempo y Costo */}
        <div className="pt-4 border-t border-gray-300 flex items-center justify-between text-xs font-semibold text-gray-700">
          <div className="flex items-center space-x-1.5 bg-gray-300/60 px-3 py-1.5 rounded-md">
            <DollarSign className="w-4 h-4 text-gray-800" />
            <span>{proyecto.costo}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-gray-300/60 px-3 py-1.5 rounded-md">
            <Clock className="w-4 h-4 text-gray-800" />
            <span>{proyecto.tiempo}</span>
          </div>
        </div>

        {/* detalle */}
        <div className="pt-2">
          <Link
            href={`/proyectos/${proyecto.id}`}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-gray-400 hover:bg-gray-500 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
          >
            <span>Ver Ficha Técnica</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </article>
  );
}