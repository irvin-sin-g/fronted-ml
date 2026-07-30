import React, { useState } from "react";
import { apiService } from "../services/apiService";
import { X, ShoppingBasket, Trash2, Plus, Minus, CreditCard, Loader2 } from 'lucide-react';

export const Cart = ({
  isOpen, 
  onClose, 
  cart, 
  updateQuantity, 
  removeFromCart, 
  clearCart,
  setRenderNow, 
  setVentaActiva
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);

  const handleCheckout = async () => {
    if (!apiService.isAuthenticated()) {
      onClose();
      setRenderNow('login');
      return;
    }

    setLoading(true);
    setError('');

    const ventaPayload = {
      detalles: cart.map(item => ({
        producto: { id: item.producto.id },
        cantidad: item.cantidad
      }))
    };

    console.log("Payload enviado a /ventas/procesar:", JSON.stringify(ventaPayload, null, 2));

    try {
      const ventaRegistrada = await apiService.procesarVenta(ventaPayload);
      setVentaActiva(ventaRegistrada);
      clearCart();
      onClose();
      setRenderNow('checkout'); 
    } catch (err) {
      setError(err.message || 'Error al procesar la compra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex sm:pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col text-neutral-100">
          
          <div className="px-6 py-5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              <ShoppingBasket className="w-5 h-5 text-amber-500" /> Mi Carrito
            </h2>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 py-6 overflow-y-auto px-6 space-y-4">
            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-xs border border-red-500/20">
                {error}
              </div>
            )}

            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <ShoppingBasket className="w-16 h-16 text-neutral-700 mx-auto" />
                <h3 className="font-bold text-neutral-300 text-base">Tu carrito está vacío</h3>
                <p className="text-neutral-500 text-xs px-6">
                  Explora el catálogo y añade algunos productos para comenzar tu compra.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div 
                    key={item.producto.id} 
                    className="flex items-center gap-4 p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 relative group"
                  >
                    <img 
                      src={item.producto.imagenUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=150"} 
                      alt={item.producto.nombre} 
                      className="w-16 h-16 object-cover rounded-lg bg-neutral-800 border border-neutral-800/80" 
                    />
                    
                    <div className="flex-grow space-y-1">
                      <h4 className="font-bold text-sm text-neutral-200 line-clamp-1 pr-6">
                        {item.producto.nombre}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-medium">
                        {item.producto.categoria?.nombre}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
                          <button 
                            onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                            className="p-1 px-2 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-amber-400">
                            {item.cantidad}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                            className="p-1 px-2 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-bold text-sm text-amber-400">
                          ${(item.producto.precio * item.cantidad).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.producto.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-all cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-neutral-800 px-6 py-6 bg-neutral-900 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Envío</span>
                  <span className="text-emerald-400 font-semibold">Gratis</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white border-t border-neutral-800 pt-3">
                  <span>Total</span>
                  <span className="text-amber-400">${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-sm text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Procesando Compra...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> Proceder al Pago
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};