import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { Mail, Lock, LogIn, AlertCircle, Loader2 } from 'lucide-react';

export const Login = ({ onLoginSuccess, onGoToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiService.login(username, password);
      onLoginSuccess(data);
    } catch (err) {
      setError(
        err.message || 'Credenciales inválidas. Verifica tu correo o contraseña'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-800">
        
        {/* Encabezado */}
        <div className="p-6 bg-neutral-900 border-b border-neutral-800 text-center">
          <div className="mx-auto w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">¡Bienvenido de nuevo!</h2>
          <p className="text-neutral-400 mt-1 text-xs">
            Inicia sesión en tu cuenta de MercaditoLibre
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 text-neutral-200">
          
          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-500/10 text-red-400 p-3.5 rounded-xl flex items-start gap-2.5 border border-red-500/20 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Campo Correo */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pl-10 w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                placeholder="nombre@correo.com"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Botón Entrar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 p-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-neutral-950 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Iniciando Sesión...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </>
            )}
          </button>
        </form>

        {/* Footer para ir al Registro */}
        <div className="p-4 bg-neutral-950/50 border-t border-neutral-800 text-center text-xs text-neutral-400">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onGoToRegister}
            className="text-amber-500 font-semibold hover:underline cursor-pointer"
          >
            Regístrate ahora
          </button>
        </div>

      </div>
    </div>
  );
};