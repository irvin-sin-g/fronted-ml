import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiService } from '../services/apiService';
import { CreditCard, CheckCircle2, ShieldAlert, Loader2, Play, ShoppingBag, ArrowRight } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ venta, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [clientSecret, setClientSecret] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
  const getSecret = async () => {
    try {
      const res = await apiService.crearIntencionPago(venta.id);
      if (res && res.clientSecret) {
        setClientSecret(res.clientSecret);
      }
    } catch (err) {
      console.warn("No se pudo inicializar Stripe. Se usará el simulador de pago.", err);
    }
  };
  if (venta && venta.id) {
    getSecret();
  }
}, [venta]);

const handleSimulatePayment = async () => {
  setSimulating(true);
  setError('');
  try {
    await apiService.confirmarPagoVenta(venta.id);
    onPaymentSuccess();
  } catch (err) {
    setError('Error al conectar con la API local para simular el pago.');
  } finally {
    setSimulating(false);
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements || !clientSecret) {
    setError("Stripe no está inicializado o la clave es incorrecta. Usa el Simulador de Pago abajo.");
    return;
  }

  setProcesando(true);
  setError("");

  try {
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setError(result.error.message);
      setProcesando(false);
    } else if (result.paymentIntent.status === "succeeded") {
      await apiService.confirmarPagoVenta(venta.id);
      onPaymentSuccess();
    }
  } catch (err) {
    setError(err.message || "Error de conexión durante el pago.");
    setProcesando(false);
  }
};


  const totalFormateado = venta?.total ? Number(venta.total).toFixed(2) : '0.00';

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-500/10 text-red-400 p-3.5 rounded-xl flex items-start gap-2.5 border border-red-500/20 text-xs">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
        <label className="block text-xs font-semibold text-neutral-300">
          Tarjeta de Crédito o Débito
        </label>
        
        <div className="bg-neutral-900 p-3.5 rounded-xl border border-neutral-800 focus-within:border-amber-500 transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#ffffff',
                  iconColor: '#f59e0b',
                  '::placeholder': { color: '#737373' },
                },
                invalid: {
                  color: '#f87171',
                  iconColor: '#f87171',
                },
              },
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!stripe || procesando || !clientSecret}
          className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm shadow-sm"
        >
          {procesando ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Procesando pago...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" /> Pagar Ahora (${totalFormateado} MXN)
            </>
          )}
        </button>
      </form>

      <div className="relative flex items-center justify-center py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-800"></div>
        </div>
        <span className="relative bg-neutral-900 px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
          O de Respaldo
        </span>
      </div>

      <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/20 space-y-3">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-400">Simulador de Pago de Pruebas</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
              Si estás en desarrollo local o sin claves de Stripe, simula la transacción exitosa para actualizar la base de datos.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSimulatePayment}
          disabled={simulating}
          className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 p-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
        >
          {simulating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Simulando...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-amber-400" /> Simular Pago Exitoso
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export const CheckoutForm = ({ ventaActiva, setRenderNow }) => {
  const [pagado, setPagado] = useState(false);

  if (!ventaActiva) {
    return (
      <div className="max-w-md mx-auto my-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800 text-center shadow-2xl space-y-4">
        <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-white">No hay ninguna venta activa</h3>
          <p className="text-neutral-400 text-xs mt-1">
            Regresa al catálogo y añade productos para realizar el checkout.
          </p>
        </div>
        <button
          onClick={() => setRenderNow('catalogo')}
          className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-2"
        >
          Ver Catálogo <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handlePaymentSuccess = () => {
    setPagado(true);
  };

  const totalFormateado = ventaActiva.total ? Number(ventaActiva.total).toFixed(2) : '0.00';

  if (pagado) {
    return (
      <div className="max-w-md mx-auto my-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800 text-center shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white">¡Pago Exitoso!</h2>
          <p className="text-xs text-neutral-400">
            Tu orden <span className="text-amber-400 font-mono">#{ventaActiva.id}</span> ha sido procesada correctamente.
          </p>
        </div>

        <div className="bg-neutral-950 p-4 rounded-xl text-left text-xs text-neutral-300 border border-neutral-800 space-y-2">
          <div className="flex justify-between">
            <span className="text-neutral-500">Total Pagado:</span>
            <span className="font-bold text-amber-400">${totalFormateado} MXN</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Estado:</span>
            <span className="text-emerald-400 font-bold">PAGADO</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Cliente:</span>
            <span className="text-white font-medium">{ventaActiva.cliente?.nombre || 'Cliente'}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setRenderNow('miscompras')}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Ver Mis Compras
          </button>
          <button
            onClick={() => setRenderNow('catalogo')}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer border border-neutral-700"
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-800">
      <div className="p-6 bg-neutral-900 border-b border-neutral-800 text-center">
        <h2 className="text-xl font-bold text-white">Checkout de Venta</h2>
        <p className="text-neutral-400 mt-1 text-xs">
          Completa tu pago seguro para la orden <span className="text-amber-400 font-mono">#{ventaActiva.id}</span>
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <h3 className="font-bold text-neutral-400 text-xs uppercase tracking-wider">
            Resumen del Pedido
          </h3>
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs space-y-2.5">
            {ventaActiva.detalles?.map((det, idx) => {
              const precio = det.precioUnitario ?? det.producto?.precio ?? 0;
              const subtotal = (precio * det.cantidad).toFixed(2);
              return (
                <div key={idx} className="flex justify-between text-neutral-300">
                  <span className="truncate pr-2">
                    {det.producto?.nombre || `Producto #${det.producto?.id}`} <span className="text-neutral-500">x{det.cantidad}</span>
                  </span>
                  <span className="font-bold text-white shrink-0">
                    ${subtotal}
                  </span>
                </div>
              );
            })}
            <div className="border-t border-neutral-800 pt-2.5 flex justify-between font-bold text-sm text-white">
              <span className="text-neutral-300">Total a Cobrar</span>
              <span className="text-amber-400">${totalFormateado} MXN</span>
            </div>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm 
            venta={ventaActiva} 
            onPaymentSuccess={handlePaymentSuccess} 
          />
        </Elements>
      </div>
    </div>
  );
};
