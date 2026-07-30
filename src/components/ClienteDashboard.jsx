import React, { useEffect, useState } from "react";
import {
  User,
  ShoppingBag,
  AlertTriangle,
  Package,
  CalendarDays,
  Eye,
  X,
  CreditCard, // 1. Importamos el ícono de tarjeta
} from "lucide-react";
import { apiService } from "../services/apiService";

export const ClienteDashboard = ({ user }) => {
  const [subVista, setSubVista] = useState("perfil");
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  useEffect(() => {
    if (subVista === "compras") {
      cargarPedidos();
    }
  }, [subVista]);

  const cargarPedidos = async () => {
    setLoading(true);

    try {
      const datosPedidos = await apiService.getMisCompras();

      datosPedidos.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );

      setPedidos(datosPedidos);
    } catch (err) {
      setError("Error al cargar pedidos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Función para procesar o reanudar el pago
  const reanudarPago = async (pedido) => {
    try {
      setLoading(true);
      setError(null);
      
      // Si utilizas la intención de pago para Stripe en el frontend:
      // const intencion = await apiService.crearIntencionPago(pedido.id);

      // Confirmamos el pago en el servidor
      await apiService.confirmarPagoVenta(pedido.id);
      
      // Recargamos el historial para actualizar los estados
      await cargarPedidos();

      if (pedidoSeleccionado) {
        setPedidoSeleccionado(null);
      }
    } catch (err) {
      console.error("Error procesando pago:", err);
      setError("No se pudo completar el pago. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";

    return new Date(fecha).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const obtenerColorEstado = (estado) => {
    switch (estado?.toUpperCase()) {
      case "PAGADO":
        return "bg-green-500/10 text-green-400 border border-green-500/30";

      case "PENDIENTE":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";

      case "CANCELADO":
        return "bg-red-500/10 text-red-400 border border-red-500/30";

      default:
        return "bg-neutral-800 text-neutral-300";
    }
  };

  const totalGastado = pedidos.reduce(
    (ac, pedido) => ac + (pedido.total || 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-5">

      {/* =======================
            MENU LATERAL
      ======================== */}
      <aside className="w-full md:w-52 self-start sticky top-6 bg-neutral-900 rounded-xl border border-neutral-800 p-3 shadow-lg">
        <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-2 px-2">
          Mi Cuenta
        </div>

        <button
          onClick={() => setSubVista("perfil")}
          className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
            subVista === "perfil"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
          }`}
        >
          <User size={16} />
          Mi Perfil
        </button>

        <button
          onClick={() => setSubVista("compras")}
          className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium mt-1 transition ${
            subVista === "compras"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
          }`}
        >
          <ShoppingBag size={16} />
          Mis Pedidos
        </button>
      </aside>

      {/* =======================
            PANEL PRINCIPAL
      ======================== */}
      <section className="flex-1 bg-neutral-900 rounded-xl border border-neutral-800 p-5 shadow-lg">

        {/* PERFIL */}
        {subVista === "perfil" && (
          <>
            <h2 className="text-xl text-white font-bold mb-6">
              Información del Perfil
            </h2>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
                  Nombre
                </label>
                <div className="mt-1 bg-neutral-950 rounded-lg p-3 border border-neutral-800 text-sm text-white">
                  {user?.nombre}
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
                  Correo electrónico
                </label>
                <div className="mt-1 bg-neutral-950 rounded-lg p-3 border border-neutral-800 text-sm text-white">
                  {user?.username}
                </div>
              </div>
            </div>
          </>
        )}

        {/* PEDIDOS */}
        {subVista === "compras" && (
          <>
            <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Historial de Pedidos
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {pedidos.length} pedidos realizados
                </p>
              </div>

              <div className="text-right">
                <p className="text-neutral-500 text-[10px] uppercase font-semibold">
                  Total Gastado
                </p>
                <h3 className="text-xl font-bold text-amber-400">
                  ${totalGastado.toFixed(2)}
                </h3>
              </div>
            </div>

            {loading && (
              <p className="text-sm text-neutral-400 py-4">
                Cargando pedidos...
              </p>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 py-4">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            {!loading && pedidos.length === 0 && (
              <div className="text-center py-12">
                <Package
                  size={48}
                  className="mx-auto text-neutral-700 mb-3"
                />
                <p className="text-sm text-neutral-400">
                  Todavía no has realizado ninguna compra.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 hover:border-amber-500/30 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base text-white font-bold">
                        Pedido #{pedido.id}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-neutral-400 mt-1.5">
                        <span className="flex gap-1.5 items-center">
                          <CalendarDays size={14} />
                          {formatearFecha(pedido.fecha)}
                        </span>

                        <span className="flex gap-1.5 items-center">
                          <Package size={14} />
                          {pedido.detalles?.length || 0} prod.
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${obtenerColorEstado(
                        pedido.estadoPago
                      )}`}
                    >
                      {pedido.estadoPago}
                    </span>
                  </div>

                  <div className="flex justify-between items-end mt-4 pt-3 border-t border-neutral-900">
                    <div>
                      <p className="text-neutral-500 text-[10px] uppercase font-semibold">
                        Total
                      </p>
                      <h3 className="text-xl text-amber-400 font-bold">
                        ${pedido.total.toFixed(2)}
                      </h3>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setPedidoSeleccionado(pedido)}
                        className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs px-3.5 py-1.5 rounded-lg transition"
                      >
                        <Eye size={15} />
                        Ver detalles
                      </button>

                      {/* 3. Botón para pagar si está pendiente en la lista */}
                      {pedido.estadoPago?.toUpperCase() === "PENDIENTE" && (
                        <button
                          onClick={() => reanudarPago(pedido)}
                          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs px-3.5 py-1.5 rounded-lg transition"
                        >
                          <CreditCard size={15} />
                          Pagar Ahora
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ==========================================================
                  MODAL DETALLE DEL PEDIDO
      ========================================================== */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">

            {/* Encabezado */}
            <div className="flex justify-between items-center border-b border-neutral-800 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Pedido #{pedidoSeleccionado.id}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {formatearFecha(pedidoSeleccionado.fecha)}
                </p>
              </div>

              <button
                onClick={() => setPedidoSeleccionado(null)}
                className="p-1.5 rounded-lg hover:bg-neutral-800 transition"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            {/* Estado */}
            <div className="px-5 pt-3">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${obtenerColorEstado(
                  pedidoSeleccionado.estadoPago
                )}`}
              >
                {pedidoSeleccionado.estadoPago}
              </span>
            </div>

            {/* Productos */}
            <div className="p-5 max-h-[50vh] overflow-y-auto space-y-3">
              {pedidoSeleccionado.detalles?.map((detalle) => (
                <div
                  key={detalle.id}
                  className="flex gap-4 bg-neutral-950 border border-neutral-800 rounded-lg p-3 items-center"
                >
                  <img
                    src={
                      detalle.producto?.imagenUrl ||
                      "https://placehold.co/100x100?text=Producto"
                    }
                    alt={detalle.producto?.nombre}
                    className="w-16 h-16 rounded-lg object-cover border border-neutral-800"
                  />

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">
                      {detalle.producto?.nombre}
                    </h3>

                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                      <div>
                        <p className="text-[10px] uppercase text-neutral-500">
                          Cant.
                        </p>
                        <p className="text-white font-medium mt-0.5">
                          {detalle.cantidad}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase text-neutral-500">
                          P. Unitario
                        </p>
                        <p className="text-white font-medium mt-0.5">
                          ${detalle.precioUnitario?.toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase text-neutral-500">
                          Subtotal
                        </p>
                        <p className="text-amber-400 font-bold mt-0.5">
                          ${detalle.subtotal?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Modal */}
            <div className="border-t border-neutral-800 px-5 py-4 flex justify-between items-center">
              <div>
                <p className="text-neutral-500 uppercase text-[10px] font-semibold">
                  Total del Pedido
                </p>
                <h2 className="text-2xl font-bold text-amber-400">
                  ${pedidoSeleccionado.total.toFixed(2)}
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPedidoSeleccionado(null)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-5 py-2 rounded-lg transition"
                >
                  Cerrar
                </button>

                {/* 3. Botón para pagar directamente dentro del modal */}
                {pedidoSeleccionado.estadoPago?.toUpperCase() === "PENDIENTE" && (
                  <button
                    onClick={() => reanudarPago(pedidoSeleccionado)}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs px-5 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <CreditCard size={16} />
                    Pagar Ahora
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
