import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  BarChart3, 
  ShoppingBag, 
  Tags, 
  Truck, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Loader2,
  Package
} from 'lucide-react';



export const AdminDashboard = ({ setRenderNow }) => {
  const [subVista, setSubVista] = useState('resumen');

  // --- ESTADOS DE DATOS ---
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // --- ESTADOS PARA MODALES DE EDICIÓN / CREACIÓN ---
  const [modalAbierto, setModalAbierto] = useState(null); // 'producto' | 'categoria' | 'proveedor' | 'detalleVenta' | null
  const [itemEditar, setItemEditar] = useState(null);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  // --- FORMULARIOS ---
  const [formProducto, setFormProducto] = useState({ nombre: '', descripcion: '', precio: 0, stock: 0, imagenUrl: '', categoriaId: '', proveedorId: '' });
  const [formCategoria, setFormCategoria] = useState({ nombre: '' });
  const [formProveedor, setFormProveedor] = useState({ nombre: '', email: '', telefono: '', direccion: '' });

  // ---------------------------------------------------------------------------
  // CARGA DE DATOS
  // ---------------------------------------------------------------------------
  useEffect(() => {
  const cargarDatos = async () => {
    setLoading(true);
    try {
      
      const resProd = await apiService.getProductos();
      setProductos(resProd);

      const resCat = await apiService.getCategorias();
      setCategorias(resCat);

      const resProv = await apiService.getProveedores();
      setProveedores(resProv);

      const resVentas = await apiService.getVentas();
      setVentas(resVentas);

    } catch (err) {
      console.error("Error al cargar datos del backend:", err);
      setError("Error en el servidor backend.. " + err);
    } finally {
      setLoading(false);
    }
  };

  cargarDatos();
}, []);


  // ---------------------------------------------------------------------------
  // HANDLERS CRUD
  // ---------------------------------------------------------------------------
  const abrirModalCrear = (tipo) => {
    setItemEditar(null);
    if (tipo === 'producto') setFormProducto({ nombre: '', descripcion: '', precio: '', stock: '', imagenUrl: '', categoriaId: categorias[0]?.id || '', proveedorId: proveedores[0]?.id || '' });
    if (tipo === 'categoria') setFormCategoria({ nombre: '' });
    if (tipo === 'proveedor') setFormProveedor({ nombre: '', email: '', telefono: '', direccion: '' });
    setModalAbierto(tipo);
  };

  const abrirModalEditar = (tipo, item) => {
    setItemEditar(item);
    if (tipo === 'producto') {
      setFormProducto({
        nombre: item.nombre,
        descripcion: item.descripcion || '',
        precio: item.precio,
        stock: item.stock,
        imagenUrl: item.imagen_url || item.imagenUrl || '',
        categoriaId: item.categoria?.id || item.categoriaId || '',
        proveedorId: item.proveedor?.id || item.proveedorId || ''
      });
    }
    if (tipo === 'categoria') setFormCategoria({ nombre: item.nombre });
    if (tipo === 'proveedor') setFormProveedor({ nombre: item.nombre, email: item.email || '', telefono: item.telefono || '', direccion: item.direccion || '' });
    setModalAbierto(tipo);
  };


  const guardarProducto = async (e, producto, id = null) => {
  e.preventDefault();
  try {
    if (id) {
      // Actualizar producto existente
      const actualizado = await apiService.actualizarProducto(id, producto);
      setProductos(prev =>
        prev.map(p => p.id === id ? actualizado : p)
      );
    } else {
      // Crear nuevo producto
      const nuevo = await apiService.creaProducto(producto);
      setProductos(prev => [...prev, nuevo]);
    }

    alert("Producto guardado correctamente");
    setModalAbierto(null);
  } catch (err) {
    alert("Error al guardar producto: " + err.message);
  }
};


const guardarCategoria = async (e, categoria, id = null) => {
  e.preventDefault();
  try {
    if (id) {
      // Actualizar categoría existente
      const actualizada = await apiService.actualizarCategoria(id, categoria);
      setCategorias(prev =>
        prev.map(c => c.id === id ? actualizada : c)
      );
    } else {
      // Crear nueva categoría
      const nueva = await apiService.crearCategoria(categoria);
      setCategorias(prev => [...prev, nueva]);
    }

    alert("Categoría guardada correctamente");
    setModalAbierto(null);
  } catch (err) {
    alert("Error al guardar categoría: " + err.message);
  }
};

const guardarProveedor = async (e, proveedor, id = null) => {
  e.preventDefault();
  try {
    if (id) {
      // Actualizar proveedor existente
      const actualizado = await apiService.actualizarProveedor(id, proveedor);
      setProveedores(prev =>
        prev.map(p => p.id === id ? actualizado : p)
      );
    } else {
      // Crear nuevo proveedor
      const nuevo = await apiService.crearProveedor(proveedor);
      setProveedores(prev => [...prev, nuevo]);
    }

    alert("Proveedor guardado correctamente");
    setModalAbierto(null);
  } catch (err) {
    alert("Error al guardar proveedor: " + err.message);
  }
};


const eliminarRegistro = async (tipo, id) => {
  if (!window.confirm("¿Estás seguro de eliminar este registro?")) return;
  try {
    switch (tipo) {
      case "productos":
        await apiService.eliminarProducto(id);
        setProductos(prev => prev.filter(p => p.id !== id));
        break;
      case "categorias":
        await apiService.eliminarCategoria(id);
        setCategorias(prev => prev.filter(c => c.id !== id));
        break;
      case "proveedores":
        await apiService.eliminarProveedor(id);
        setProveedores(prev => prev.filter(p => p.id !== id));
        break;
      case "clientes":
        await apiService.eliminarCliente(id);
        // si tienes un estado de clientes, aquí lo actualizas igual:
        // setClientes(prev => prev.filter(c => c.id !== id));
        break;
      case "ventas":
        // normalmente no se eliminan ventas, pero si tu API lo permite:
        // await apiService.eliminarVenta(id);
        // setVentas(prev => prev.filter(v => v.id !== id));
        break;
      default:
        throw new Error("Tipo no soportado: " + tipo);
    }
    alert(`${tipo} eliminado correctamente`);
  } catch (err) {
    alert("Error al eliminar: " + err.message);
  }
};



  // Componente Auxiliar para Tarjetas de Métricas
  const CardMetrica = ({ titulo, valor, estiloColor, icono: Icono }) => (
    <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-2">
      <div className="flex justify-between items-center text-neutral-500">
        <span className="text-[10px] font-bold uppercase tracking-wider">{titulo}</span>
        {Icono && <Icono className="w-4 h-4 text-neutral-400" />}
      </div>
      <p className={`text-2xl font-black ${estiloColor}`}>{valor}</p>
    </div>
  );

  return (
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 flex flex-col md:flex-row gap-6 animate-fadeIn">
      
      {/* --- MENÚ LATERAL --- */}
      <aside className="w-full md:w-64 bg-neutral-900 rounded-2xl border border-neutral-800 p-4 h-fit space-y-1 shadow-2xl">
        <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
          Panel de Control
        </div>
        
        <button
          onClick={() => setSubVista('resumen')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subVista === 'resumen' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Resumen
        </button>

        <button
          onClick={() => setSubVista('productos')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subVista === 'productos' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Productos
        </button>

        <button
          onClick={() => setSubVista('categorias')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subVista === 'categorias' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <Tags className="w-4 h-4" /> Categorías
        </button>

        <button
          onClick={() => setSubVista('proveedores')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subVista === 'proveedores' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" /> Proveedores
        </button>

        <button
          onClick={() => setSubVista('ventas')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subVista === 'ventas' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Ventas y Pedidos
        </button>
      </aside>

      {/* --- SECCIÓN PRINCIPAL --- */}
      <section className="flex-1 bg-neutral-900 rounded-2xl border border-neutral-800 p-6 min-h-[500px] shadow-2xl">
        
        {/* VISTA 1: RESUMEN */}
        {subVista === 'resumen' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Métricas Globales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <CardMetrica titulo="Productos" valor={productos.length} estiloColor="text-amber-400" icono={Package} />
              <CardMetrica titulo="Categorías" valor={categorias.length} estiloColor="text-emerald-400" icono={Tags} />
              <CardMetrica titulo="Proveedores" valor={proveedores.length} estiloColor="text-blue-400" icono={Truck} />
              <CardMetrica titulo="Ventas Creadas" valor={ventas.length} estiloColor="text-amber-500" icono={DollarSign} />
            </div>
          </div>
        )}

        {/* VISTA 2: PRODUCTOS */}
        {subVista === 'productos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Gestión de Productos</h2>
              <button
                onClick={() => abrirModalCrear('producto')}
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Nuevo Producto
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-500 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Precio</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {productos.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-neutral-500 italic">No hay productos registrados.</td>
                    </tr>
                  ) : (
                    productos.map((prod) => (
                      <tr key={prod.id} className="hover:bg-neutral-950/50 transition-colors">
                        <td className="p-3 font-mono text-neutral-500">#{prod.id}</td>
                        <td className="p-3 font-bold text-white">{prod.nombre}</td>
                        <td className="p-3 text-amber-400 font-semibold">${prod.precio?.toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${prod.stock > 5 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {prod.stock} unids.
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => abrirModalEditar('producto', prod)} className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors cursor-pointer">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => eliminarRegistro('productos', prod.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISTA 3: CATEGORÍAS */}
        {subVista === 'categorias' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Categorías de Productos</h2>
              <button
                onClick={() => abrirModalCrear('categoria')}
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Nueva Categoría
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-500 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {categorias.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-neutral-500 italic">No hay categorías registradas.</td>
                    </tr>
                  ) : (
                    categorias.map((cat) => (
                      <tr key={cat.id} className="hover:bg-neutral-950/50">
                        <td className="p-3 font-mono text-neutral-500">#{cat.id}</td>
                        <td className="p-3 font-bold text-white">{cat.nombre}</td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => abrirModalEditar('categoria', cat)} className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg cursor-pointer">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => eliminarRegistro('categorias', cat.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISTA 4: PROVEEDORES */}
        {subVista === 'proveedores' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Gestión de Proveedores</h2>
              <button
                onClick={() => abrirModalCrear('proveedor')}
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Nuevo Proveedor
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-500 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Contacto</th>
                    <th className="p-3">Dirección</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {proveedores.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-neutral-500 italic">No hay proveedores registrados.</td>
                    </tr>
                  ) : (
                    proveedores.map((prov) => (
                      <tr key={prov.id} className="hover:bg-neutral-950/50">
                        <td className="p-3 font-mono text-neutral-500">#{prov.id}</td>
                        <td className="p-3 font-bold text-white">{prov.nombre}</td>
                        <td className="p-3 text-neutral-400">{prov.email} <br /> <span className="text-[10px] text-neutral-500">{prov.telefono}</span></td>
                        <td className="p-3 text-neutral-400">{prov.direccion || 'N/A'}</td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => abrirModalEditar('proveedor', prov)} className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg cursor-pointer">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => eliminarRegistro('provedores', prov.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISTA 5: VENTAS Y PEDIDOS */}
        {subVista === 'ventas' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Historial de Ventas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-500 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-3">ID Venta</th>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3 text-right">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {ventas.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-neutral-500 italic">No hay registros de ventas.</td>
                    </tr>
                  ) : (
                    ventas.map((v) => (
                      <tr key={v.id} className="hover:bg-neutral-950/50">
                        <td className="p-3 font-mono text-amber-400 font-bold">#{v.id}</td>
                        <td className="p-3 text-neutral-400">{v.fecha ? new Date(v.fecha).toLocaleString() : 'N/A'}</td>
                        <td className="p-3 font-bold text-white">${v.total?.toFixed(2)} MXN</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${v.estadoPago === 'PAGADO' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {v.estadoPago || 'PENDIENTE'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => { setVentaSeleccionada(v); setModalAbierto('detalleVenta'); }}
                            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg cursor-pointer flex items-center gap-1 ml-auto text-[11px]"
                          >
                            <Eye className="w-3.5 h-3.5" /> Ver Ítems
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </section>

      {/* --------------------------------------------------------------------------- */}
      {/* MODALES REUTILIZABLES (CREACIÓN / EDICIÓN)                                  */}
      {/* --------------------------------------------------------------------------- */}

      {/* MODAL PRODUCTO */}
{modalAbierto === 'producto' && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
        <h3 className="text-base font-bold text-white">
          {itemEditar ? 'Editar Producto' : 'Nuevo Producto'}
        </h3>
        <button onClick={() => setModalAbierto(null)} className="text-neutral-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* 👇 Aquí pasamos el id si existe */}
      <form onSubmit={(e) => guardarProducto(e, formProducto, itemEditar?.id)} className="space-y-3 text-xs">
        <div>
          <label className="block text-neutral-400 font-medium mb-1">Nombre</label>
          <input
            type="text"
            required
            value={formProducto.nombre}
            onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-neutral-400 font-medium mb-1">Precio ($ MXN)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formProducto.precio}
              onChange={(e) => setFormProducto({ ...formProducto, precio: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-neutral-400 font-medium mb-1">Stock Inicial</label>
            <input
              type="number"
              required
              value={formProducto.stock}
              onChange={(e) => setFormProducto({ ...formProducto, stock: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-neutral-400 font-medium mb-1">Categoría</label>
          <select
            value={formProducto.categoriaId}
            onChange={(e) => setFormProducto({ ...formProducto, categoriaId: e.target.value })}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-neutral-400 font-medium mb-1">Proveedor</label>
          <select
            value={formProducto.proveedorId}
            onChange={(e) => setFormProducto({ ...formProducto, proveedorId: e.target.value })}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
          >
            <option value="">Selecciona un proveedor</option>
            {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-neutral-400 font-medium mb-1">URL de la Imagen</label>
          <input
            type="text"
            value={formProducto.imagenUrl}
            onChange={(e) => setFormProducto({ ...formProducto, imagenUrl: e.target.value })}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
            placeholder="https://..."
          />
        </div>

        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 py-2.5 rounded-xl font-bold transition-all cursor-pointer mt-4">
          {itemEditar ? 'Guardar Cambios' : 'Crear Producto'}
        </button>
      </form>
    </div>
  </div>
)}


      {/* MODAL CATEGORÍA */}
{modalAbierto === 'categoria' && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
        <h3 className="text-base font-bold text-white">
          {itemEditar ? 'Editar Categoría' : 'Nueva Categoría'}
        </h3>
        <button onClick={() => setModalAbierto(null)} className="text-neutral-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* 👇 Aquí pasamos el id si existe */}
      <form onSubmit={(e) => guardarCategoria(e, formCategoria, itemEditar?.id)} className="space-y-3 text-xs">
        <div>
          <label className="block text-neutral-400 font-medium mb-1">Nombre de la Categoría</label>
          <input
            type="text"
            required
            value={formCategoria.nombre}
            onChange={(e) => setFormCategoria({ ...formCategoria, nombre: e.target.value })}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 py-2.5 rounded-xl font-bold transition-all cursor-pointer mt-4"
        >
          {itemEditar ? 'Guardar Cambios' : 'Crear Categoría'}
        </button>
      </form>
    </div>
  </div>
)}
{/* MODAL PROVEEDOR */}
{modalAbierto === 'proveedor' && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
        <h3 className="text-base font-bold text-white">
          {itemEditar ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        </h3>
        <button onClick={() => setModalAbierto(null)} className="text-neutral-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 👇 Pasamos el id si existe */}
      <form onSubmit={(e) => guardarProveedor(e, formProveedor, itemEditar?.id)} className="space-y-3 text-xs">
        <div>
          <label className="block text-neutral-400 font-medium mb-1">Nombre</label>
          <input
            type="text"
            required
            value={formProveedor.nombre}
            onChange={(e) => setFormProveedor({ ...formProveedor, nombre: e.target.value })}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-neutral-400 font-medium mb-1">Email</label>
          <input
            type="email"
            value={formProveedor.email}
            onChange={(e) => setFormProveedor({ ...formProveedor, email: e.target.value })}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-neutral-400 font-medium mb-1">Teléfono</label>
          <input
            type="text"
            value={formProveedor.telefono}
            onChange={(e) => setFormProveedor({ ...formProveedor, telefono: e.target.value })}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-neutral-400 font-medium mb-1">Dirección</label>
          <input
            type="text"
            value={formProveedor.direccion}
            onChange={(e) => setFormProveedor({ ...formProveedor, direccion: e.target.value })}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 py-2.5 rounded-xl font-bold transition-all cursor-pointer mt-4"
        >
          {itemEditar ? 'Guardar Cambios' : 'Crear Proveedor'}
        </button>
      </form>
    </div>
  </div>
)}



      {/* MODAL DETALLE DE VENTA (`detalleventa`) */}
      {modalAbierto === 'detalleVenta' && ventaSeleccionada && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Detalle de Venta #{ventaSeleccionada.id}</h3>
                <p className="text-[10px] text-neutral-500">Cliente ID: {ventaSeleccionada.cliente?.id || 'General'}</p>
              </div>
              <button onClick={() => setModalAbierto(null)} className="text-neutral-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {ventaSeleccionada.detalles?.map((det, idx) => (
                <div key={idx} className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">{det.producto?.nombre || `Producto #${det.productoId}`}</p>
                    <p className="text-[10px] text-neutral-500">{det.cantidad} unids. x ${det.precioUnitario?.toFixed(2)}</p>
                  </div>
                  <span className="font-mono text-amber-400 font-bold">${det.subtotal?.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-800 pt-3 flex justify-between items-center text-xs font-bold text-white">
              <span>Total Comprado:</span>
              <span className="text-amber-400 text-base font-mono">${ventaSeleccionada.total?.toFixed(2)} MXN</span>
            </div>
          </div>
        </div>
      )}
      

    </div>
  );
};