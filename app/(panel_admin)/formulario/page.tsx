'use client'; // Necesario para gestionar interacción y estados de formulario

import { useState } from 'react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para autenticación de administrador
    console.log('Login intent:', { email, password });
  };

  return (
    /* CARD PRINCIPAL: Usando tonalidades gray-300 a gray-500 para bordes, sombras y estructura */
    <div className="w-full max-w-md bg-gray-300 rounded-xl shadow-2xl border border-gray-400 p-8 space-y-6">
      
      {/* Encabezado de la Card */}
      <div className="text-center space-y-2">
        <div className="inline-block p-3 bg-gray-400 text-gray-800 rounded-full mb-2">
          {/* Icono vectorial de candado */}
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          Acceso Administrativo
        </h1>
        <p className="text-sm text-gray-600">
          Ingresa tus credenciales para administrar la plataforma
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Campo: Correo Electrónico */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@empresa.com"
            className="w-full px-4 py-3 bg-gray-100 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Campo: Contraseña */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-gray-100 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Recordar datos / Recuperar */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <label className="flex items-center space-x-2 cursor-pointer">
          </label>
          <a href="#" className="hover:underline hover:text-gray-800 font-medium">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {/* Botón de Enviar (Gris 500/600 a 700 en Hover) */}
        <button
          type="submit"
          className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Iniciar Sesión
        </button>
      </form>

      {/* Pie de la Card */}
      <div className="text-center pt-2 border-t border-gray-400">
        <a href="/" className="text-xs text-gray-600 hover:text-gray-900 font-medium transition-colors">
          ← Volver al sitio público
        </a>
      </div>

    </div>
  );
}