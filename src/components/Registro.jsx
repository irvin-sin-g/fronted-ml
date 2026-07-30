import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { 
  UserPlus, User, Mail, Lock, Phone, MapPin,
  AlertCircle, CheckCircle, Loader2
} from 'lucide-react';

export const Registro = ({ onRegisterSuccess, onGoToLogin }) => {
  const [nombre, setNombre] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  // Rol fijo por defecto
  const rol = 'ROLE_CLIENTE';

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const payload = {
      username,
      password,
      nombre,
      rol, // siempre ROLE_CLIENTE
      telefono,
      direccion,
    };

    try {
      await apiService.registro(payload);
      setSuccess('¡Registro completado con éxito! Redirigiéndote al inicio de sesión...');
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al completar el registro. Intenta con otro correo...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-800">
        
        {/* Encabezado */}
        <div className="p-6 bg-neutral-900 border-b border-neutral-800 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Crear una Cuenta</h2>
            <p className="text-neutral-400 mt-0.5 text-xs">Únete a Megaklic hoy mismo</p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 text-neutral-200">
          
          {/* Alertas */}
          {error && (
            <div className="bg-red-500/10 text-red-400 p-3.5 rounded-xl flex items-start gap-2.5 border border-red-500/20 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 text-emerald-400 p-3.5 rounded-xl flex items-start gap-2.5 border border-emerald-500/20 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-amber-500" /> Nombre Completo
            </label>
            <input 
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan Pérez"
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-500" /> Correo Electrónico
            </label>
            <input 
              type="email"
              required
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-500" /> Contraseña
            </label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-500" /> Teléfono
            </label>
            <input 
              type="tel"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="7471234567"
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> Dirección
            </label>
            <input 
              type="text"
              required
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Av. Central #123, Col. Centro"
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 p-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-neutral-950 text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creando cuenta...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Crear cuenta</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="p-4 bg-neutral-950/50 border-t border-neutral-800 text-center text-xs text-neutral-400">
          ¿Ya tienes cuenta?{' '}
          <button 
            type="button"
            onClick={onGoToLogin}
            className="text-amber-500 font-semibold hover:underline"
          >
            Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  );
};
