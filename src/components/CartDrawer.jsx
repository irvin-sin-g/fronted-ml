import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'

export const CartDrawer = ({ abierto, items, onClose, onCantidad, onEliminar }) => {
  if (!abierto) return null

  const total = items.reduce((suma, item) => suma + Number(item.precio || 0) * item.cantidad, 0)

  return (
    <div className="fixed inset-0 z-60">
      <button aria-label="Cerrar carrito" onClick={onClose} className="absolute inset-0 bg-rose-950/35 backdrop-blur-[1px]" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col">
        <header className="bg-rose-950 text-amber-100 px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-amber-300" /><h2 className="font-bold">Mi carrito</h2></div>
          <button onClick={onClose} className="p-1 hover:bg-amber-900 rounded-lg"><X className="w-5 h-5" /></button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <p className="py-12 text-center text-rose-700">Tu carrito está vacío.</p>
          ) : items.map((item) => (
            <article key={item.id} className="border border-rose-100 rounded-2xl p-3">
              <div className="flex justify-between gap-3"><div><h3 className="font-bold text-rose-950">{item.nombre}</h3><p className="text-sm text-amber-800">${Number(item.precio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p></div><button onClick={() => onEliminar(item.id)} className="text-rose-600 hover:text-rose-900"><Trash2 className="w-4 h-4" /></button></div>
              <div className="flex items-center justify-between mt-3"><div className="flex items-center border border-rose-200 rounded-lg"><button onClick={() => onCantidad(item.id, item.cantidad - 1)} className="p-1.5"><Minus className="w-4 h-4" /></button><span className="w-8 text-center text-sm font-bold">{item.cantidad}</span><button onClick={() => onCantidad(item.id, item.cantidad + 1)} className="p-1.5"><Plus className="w-4 h-4" /></button></div><span className="font-bold text-rose-950">${(Number(item.precio || 0) * item.cantidad).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
            </article>
          ))}
        </div>
        <footer className="border-t border-rose-100 p-5"><div className="flex justify-between font-extrabold text-rose-950"><span>Total</span><span>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span></div><button disabled={!items.length} className="w-full mt-4 py-3 rounded-xl bg-amber-700 hover:bg-amber-600 disabled:bg-rose-200 text-white font-bold">Continuar compra</button></footer>
      </aside>
    </div>
  )
}
