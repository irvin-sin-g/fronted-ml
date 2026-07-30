import React from 'react';
import { apiService } from '../services/apiService';
import { ShoppingCart, LogOut, User, ListOrdered, ShoppingBag, LayoutDashboard } from 'lucide-react';

export const Navbar = ({
  renderNow,
  setRenderNow,
  user,
  onLogout,
  cartCount,
  openCart
}) => {
  const handleLogout = () => {
    apiService.logout();
    onLogout();
    setRenderNow('catalogo');
  };

  const userRole = user?.role || user?.rol;
  const isClient = userRole === 'ROLE_CLIENTE';
  const isAdmin = userRole === 'ROLE_ADMIN';

  return (
    <nav className="sticky top-0 z-50 bg-neutral-900 text-neutral-100 border-b border-neutral-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer select-none group" 
            onClick={() => setRenderNow('catalogo')}
          >
            <ShoppingBag className="h-7 w-7 text-amber-500 group-hover:text-amber-400 transition-colors" />
            <span className="font-bold text-xl tracking-tight text-white">
              Megaklic<span className="text-amber-500">.</span>
            </span>
          </div>

          {/* Links de navegación */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button 
              type="button"
              onClick={() => setRenderNow('catalogo')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                renderNow === 'catalogo' 
                  ? 'bg-neutral-800 text-amber-400 font-semibold border-b-2 border-amber-500 rounded-b-none' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              Catálogo
            </button>

            {/* Mis Compras (Cliente) */}
            {isClient && (
              <button 
                type="button"
                onClick={() => setRenderNow('miscompras')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  renderNow === 'miscompras' 
                    ? 'bg-neutral-800 text-amber-400 font-semibold border-b-2 border-amber-500 rounded-b-none' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <ListOrdered className="w-4 h-4 text-amber-500" />
                <span>Mis Compras</span>
              </button>
            )}

            {/* Admin Panel (Admin) */}
            {isAdmin && (
              <button 
                type="button"
                onClick={() => setRenderNow('admin-panel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  renderNow === 'admin-panel' 
                    ? 'bg-neutral-800 text-amber-400 font-semibold border-b-2 border-amber-500 rounded-b-none' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* Área de Usuario / Auth */}
            {user ? (
              <div className="flex items-center gap-3 pl-2">
                {/* Chip con Nombre */}
                <div className="flex items-center text-xs font-medium bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-full border border-neutral-700/60 gap-1.5 max-w-[150px] sm:max-w-[200px] truncate">
                  <User className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{user.nombre}</span>      
                </div>

                {/* Carrito (Solo Clientes) */}
                {isClient && (
                  <button 
                    type="button"
                    onClick={openCart}
                    className="relative p-2 text-neutral-300 hover:text-amber-400 hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
                    title="Ver Carrito"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-neutral-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </button>
                )} 

                {/* Cerrar Sesión */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2">
                <button 
                  type="button"
                  onClick={() => setRenderNow('login')}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button 
                  type="button"
                  onClick={() => setRenderNow('register')}
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold px-3.5 py-1.5 rounded-md text-sm transition-colors shadow-sm"
                >
                  Registrarse
                </button>
              </div>
            )}

          </div>    

        </div>
      </div>
    </nav>
  );
};