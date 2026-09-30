import Image from 'next/image';
import { 
  Building2, 
  Award, 
  ShieldCheck, 
  Truck, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Briefcase,
  History
} from 'lucide-react';

export default function SobreNosotrosPage() {
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ENCABEZADO Y HERO DE TRAYECTORIA */}
        <section className="bg-gray-900 text-white rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-300">
              <History className="w-4 h-4" />
              <span>25 Años de Trayectoria (1999 - 2024)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Líderes en Infraestructura y Edificación de Alta Complejidad
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Durante más de dos décadas hemos construido las bases del desarrollo urbano e industrial, destacándonos por la calidad técnica, el cumplimiento riguroso de plazos y un estándar de seguridad de nivel superior.
            </p>
          </div>
        </section>

        {/* DIRECCIÓN Y PRESENCIA CORPORATIVA */}
        <section className="bg-gray-200 border border-gray-300 rounded-2xl p-8 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-900 font-bold text-xl">
                <MapPin className="w-6 h-6 text-gray-700 flex-shrink-0" />
                <h2>Dirección Corporativa y Casas Matrices</h2>
              </div>
              <p className="text-gray-700 text-sm">
                Av. Andrés Bello #2450, Piso 12, Providencia, Santiago de Chile.
              </p>
              <p className="text-gray-600 text-xs">
                Base Operativa y Patio de Maquinarias: Panamericana Norte Km 18, Lampa.
              </p>
            </div>
            <div className="bg-gray-300 px-6 py-4 rounded-xl border border-gray-400 text-center min-w-[200px]">
              <span className="block text-3xl font-extrabold text-gray-900">+350</span>
              <span className="text-xs font-semibold text-gray-700 uppercase">Proyectos Ejecutados</span>
            </div>
          </div>
        </section>

        {/* LOGROS Y NÚMEROS CLAVE */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { titulo: '25 Años', sub: 'Experiencia en el rubro', icono: History },
            { titulo: '+1.2M m²', sub: 'Construidos en todo el país', icono: Building2 },
            { titulo: '0 Incidentes', sub: 'Tasa de siniestralidad destacada', icono: ShieldCheck },
            { titulo: '100%', sub: 'Cumplimiento de plazos', icono: Award },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-200 border border-gray-300 rounded-xl p-6 text-center space-y-2 shadow-sm hover:bg-gray-150 transition-colors">
              <item.icono className="w-8 h-8 text-gray-800 mx-auto" />
              <h3 className="text-2xl font-bold text-gray-900">{item.titulo}</h3>
              <p className="text-xs text-gray-600 font-medium">{item.sub}</p>
            </div>
          ))}
        </section>

        {/* INFRAESTRUCTURA Y MAQUINARIA ESPECIALIZADA */}
        <section className="space-y-6">
          <div className="border-b border-gray-300 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Truck className="w-6 h-6 text-gray-800" />
              <span>Infraestructura y Parque de Maquinaria</span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Equipamiento propio de última tecnología para garantizar autonomía operativa en cualquier punto del país.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                titulo: 'Maquinaria Pesada de Movimiento de Tierra',
                detalles: ['Excavadoras CAT 336 y 320', 'Retroexcavadoras y Motoniveladoras', 'Bulldozers D6T de alta capacidad'],
                imagen: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800&auto=format&fit=crop'
              },
              {
                titulo: 'Equipos de Hormigonado y Elevación',
                detalles: ['Grúas Torre Potain de 12 y 16 toneladas', 'Bombas de Hormigón telescópicas', 'Plantas móviles de dosificación'],
                imagen: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=800&auto=format&fit=crop'
              },
              {
                titulo: 'Instalaciones de Faena Móviles',
                detalles: ['Módulos habitacionales equipados', 'Laboratorio de autocontrol de hormigones', 'Talleres mecánicos móviles de respuesta rápida'],
                imagen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop'
              }
            ].map((infra, idx) => (
              <div key={idx} className="bg-gray-200 border border-gray-300 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="relative h-48 w-full bg-gray-400">
                  <Image src={infra.imagen} alt={infra.titulo} fill className="object-cover" />
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-gray-900 text-base">{infra.titulo}</h3>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {infra.detalles.map((det, dIdx) => (
                      <li key={dIdx} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gray-800 flex-shrink-0" />
                        <span>{det}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EQUIPO DE TRABAJO */}
        <section className="bg-gray-200 border border-gray-300 rounded-2xl p-8 space-y-6 shadow-md">
          <div className="flex items-center space-x-3 border-b border-gray-300 pb-4">
            <Users className="w-6 h-6 text-gray-800" />
            <h2 className="text-2xl font-bold text-gray-900">Capital Humano y Equipo Técnico</h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            Contamos con un equipo multidisciplinario permanente compuesto por más de 120 profesionales de planta, incluyendo Ingenieros Civiles, Constructores Civiles, Prevencionistas de Riesgos y un cuerpo especializado de operadores técnicos de maquinaria y especialistas de obra fina.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-300/80 p-4 rounded-lg">
              <span className="block font-extrabold text-xl text-gray-900">45+</span>
              <span className="text-xs text-gray-700 font-medium">Ingenieros y Profesionales Senior</span>
            </div>
            <div className="bg-gray-300/80 p-4 rounded-lg">
              <span className="block font-extrabold text-xl text-gray-900">18+</span>
              <span className="text-xs text-gray-700 font-medium">Expertos en Prevención (SNA)</span>
            </div>
            <div className="bg-gray-300/80 p-4 rounded-lg">
              <span className="block font-extrabold text-xl text-gray-900">500+</span>
              <span className="text-xs text-gray-700 font-medium">Trabajadores de Especialidad en Obra</span>
            </div>
          </div>
        </section>

        {/* OBRAS DESTACADAS */}
        <section className="space-y-6">
          <div className="border-b border-gray-300 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-gray-800" />
              <span>Obras Emblemáticas</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                nombre: 'Avenida de Conexión Expresa Norte',
                cliente: 'Ministerio de Obras Públicas (MOP)',
                descripcion: 'Construcción de 14 km de calzada doble con 3 pasos superior e inferior e iluminación fotovoltaica.',
                ano: '2021 - 2023'
              },
              {
                nombre: 'Centro Logístico Portuario Valparaíso',
                cliente: 'Grupo Operador Logístico S.A.',
                descripcion: 'Nave de almacenamiento industrial de 18.000 m² con losa de alta resistencia y aislación térmica.',
                ano: '2019 - 2020'
              }
            ].map((obra, idx) => (
              <div key={idx} className="bg-gray-200 border border-gray-300 p-6 rounded-xl space-y-3 shadow-sm hover:bg-gray-150 transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 text-lg">{obra.nombre}</h3>
                  <span className="text-xs font-bold bg-gray-300 px-2.5 py-1 rounded text-gray-800">{obra.ano}</span>
                </div>
                <p className="text-xs font-semibold text-gray-700">Cliente: {obra.cliente}</p>
                <p className="text-sm text-gray-600">{obra.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CERTIFICACIONES Y MUTUALES ASOCIADAS */}
        <section className="bg-gray-300 border border-gray-400 rounded-2xl p-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <ShieldCheck className="w-10 h-10 text-gray-900 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Certificaciones y Respaldo Institucional</h2>
            <p className="text-xs text-gray-700">
              Mantenemos los más altos estándares de calidad, gestión ambiental y protección de nuestros trabajadores.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-gray-100 p-4 rounded-xl border border-gray-400 text-center space-y-1">
              <span className="block font-bold text-gray-900 text-sm">ISO 9001:2015</span>
              <span className="text-xs text-gray-600">Sistema de Gestión de Calidad</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl border border-gray-400 text-center space-y-1">
              <span className="block font-bold text-gray-900 text-sm">ISO 45001:2018</span>
              <span className="text-xs text-gray-600">Seguridad y Salud en el Trabajo</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl border border-gray-400 text-center space-y-1">
              <span className="block font-bold text-gray-900 text-sm">ISO 14001:2015</span>
              <span className="text-xs text-gray-600">Gestión Ambiental Operativa</span>
            </div>
          </div>

          <div className="border-t border-gray-400 pt-6 text-center space-y-2">
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Mutual de Seguridad Asociada</p>
            <p className="text-sm font-semibold text-gray-900">
              Adheridos a la **Mutual de Seguridad CChC** con Distinción de Excelencia en Prevención de Riesgos Operacionales.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}