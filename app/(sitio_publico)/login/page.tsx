'use client';

import { useState } from 'react';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Por favor, ingresa tus credenciales completas.');
      return;
    }

    setCargando(true);
    
    // Aquí irá la futura integración con el endpoint de autenticación (JWT)
    setTimeout(() => {
      setCargando(false);
      // Para efectos de maquetación, simularemos un error por ahora
      setError('Credenciales incorrectas. Verifique su acceso administrativo.');
    }, 1200);
  };

  const inputEstilo = "w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all text-sm";

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo Circular (Reutilizado del Header) */}
        <div className="mx-auto bg-white p-2 h-40 w-40 flex items-center justify-center rounded-full shadow-md mb-6">
          <img 
            src="/logo-alvarez.svg" 
            alt="Logo Álvarez Infraestructura" 
            className="max-h-full max-w-full object-contain rounded-full"
          />
        </div>
        
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Carlos Alberto Álvarez Villar
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-gray-200 rounded-2xl sm:px-10">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-md flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className={inputEstilo}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputEstilo}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={cargando}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-colors"
              >
                {cargando ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </div>
            
          </form>

        </div>
      </div>
    </div>
  );
}