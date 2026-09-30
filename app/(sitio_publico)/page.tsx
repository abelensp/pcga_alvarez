import Link from 'next/link';
import Image from 'next/image';

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

      {/* DIV DE 5 CASILLAS: Información Rápida */}

        <div className='bg-gray-400 text-white rounded-xl p-15 text-center mx-auto'>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="bg-gray-200 p-6 rounded-lg text-center border border-gray-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Dato #{num}</h3>
              <p className="text-sm text-gray-600">Métrica o info rápida de la página.</p>
            </div>
            ))}
            </section>
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