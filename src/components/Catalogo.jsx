import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Search, Filter, ShoppingCart, Info, AlertTriangle, Truck } from 'lucide-react';

export const Catalogo = ({ setRenderNow, user, AddToCart }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carga, setCarga] = useState(false);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selecionCategoria, setSelecionCategoria] = useState('Todos');

  useEffect(() => {
    const cargaDatosCatalogo = async () => {
      setCarga(true);
      try {
        const datosProductos = await apiService.getProductos();
        setProductos(datosProductos);
        const datosCategorias = await apiService.getCategorias();
        setCategorias(datosCategorias);
      } catch (err) {
        setError('Error en el servidor backend.. ' + err);
      } finally {
        setCarga(false);
      }
    }; 
    cargaDatosCatalogo();
  }, []);

  const handleAddToCart = (producto) => {
    if (!user) {
      setRenderNow('login');
      return;
    }
    if (user.role !== 'ROLE_CLIENTE') {
      alert('Solo los usuarios registrados con el rol de Cliente pueden realizar compras.');
      return;
    }
    AddToCart(producto);
  };

  const filtroProductos = productos.filter((producto) => {
  // 1. Buscador por texto (sin modificar)
  const busqueda = 
    producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (producto.descripcion && producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));

  // 2. Filtro de Categoría a prueba de fallos
  if (selecionCategoria === 'Todos') return busqueda;

  // Buscamos cuál es el ID de la categoría seleccionada en el botón
  const catBoton = categorias.find(
    (c) => c.nombre?.trim().toLowerCase() === selecionCategoria.trim().toLowerCase()
  );
  const targetId = catBoton ? catBoton.id : null;

  // Comprobamos todas las formas en las que el backend podría enviar la relación
  const coincideCategoria = 
    // Comparación 1: Si producto.categoria es objeto { id, nombre }
    producto.categoria?.nombre?.trim().toLowerCase() === selecionCategoria.trim().toLowerCase() ||
    // Comparación 2: Si coinciden por ID (producto.categoria.id === catBoton.id)
    (targetId && producto.categoria?.id === targetId) ||
    // Comparación 3: Si viene como propiedad plana (producto.categoriaId === catBoton.id)
    (targetId && Number(producto.categoriaId) === Number(targetId));

  return busqueda && coincideCategoria;
});
    
  if (carga) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
        <p className="text-neutral-400 mt-4 text-sm font-medium">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner Principal */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Catálogo de Productos<span className="text-amber-500">.</span>
          </h1>
          <p className="mt-2 text-neutral-400 text-sm sm:text-base">
            Explora las mejores ofertas, productos de calidad y envíos garantizados directamente por nuestros proveedores.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 opacity-5 flex items-center justify-center p-8 pointer-events-none">
          <ShoppingCart className="w-64 h-64 text-amber-500" />
        </div>
      </div>

      {error && (
        <div className="bg-amber-500/10 text-amber-400 p-4 rounded-xl flex items-start gap-2.5 border border-amber-500/30 text-sm mb-6">
          <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Aviso del Servidor:</span> {error}. Mostrando interfaz local. Asegúrate de iniciar la API en Spring Boot.
          </div>
        </div>
      )}

      {/* Buscador y Contenido */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 flex-shrink-0 space-y-6">
          {/* Tarjeta de Búsqueda */}
          <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 shadow-sm space-y-3">
            <h3 className="font-bold text-neutral-300 flex items-center gap-2 text-xs uppercase tracking-wider">
              <Search className="w-4 h-4 text-amber-500" /> Buscar Producto
            </h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Escribe nombre o descripción..."
                className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-amber-500 text-sm text-neutral-200 placeholder-neutral-500 transition-colors"
              />
            </div>
          </div>

          {/* Tarjeta de Categorías */}
          <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 shadow-sm space-y-4">
            <h3 className="font-bold text-neutral-300 flex items-center gap-2 text-xs uppercase tracking-wider">
              <Filter className="w-4 h-4 text-amber-500" /> Categorías
            </h3>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setSelecionCategoria('Todos')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  selecionCategoria === 'Todos' 
                    ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20' 
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                }`}
              >
                Todas las categorías
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelecionCategoria(cat.nombre)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    selecionCategoria === cat.nombre 
                      ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20' 
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cuadrícula de Productos */}
        <div className="w-full md:w-3/4">
          {filtroProductos.length === 0 ? (
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-12 text-center shadow-sm">
              <AlertTriangle className="w-12 h-12 text-amber-500/60 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-neutral-200">No se encontraron productos</h3>
              <p className="text-neutral-400 text-sm mt-1">Prueba a modificar los filtros o los términos de búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtroProductos.map((producto) => {
                const defaultImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300";
                const isOutOfStock = producto.stock <= 0;

                return (
                  <div key={producto.id} className="bg-neutral-900 rounded-2xl border border-neutral-800 shadow-sm overflow-hidden flex flex-col group hover:border-neutral-700 transition-all duration-300">
                    <div className="h-48 w-full bg-neutral-950 relative overflow-hidden">
                      <img
                        src={producto.imagenUrl || defaultImage}
                        alt={producto.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                        onError={(e) => { e.target.src = defaultImage; }}
                      />
                      {producto.categoria && (
                        <span className="absolute top-3 left-3 bg-neutral-950/80 text-neutral-300 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-neutral-800 backdrop-blur-sm">
                          {producto.categoria.nombre}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {producto.proveedor && (
                          <div className="text-[11px] text-neutral-400 font-semibold flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-amber-500" />
                            <span>{producto.proveedor.nombreEmpresa}</span>
                          </div>
                        )}
                        <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-amber-400 transition-colors">
                          {producto.nombre}
                        </h3>
                        <p className="text-neutral-400 text-xs line-clamp-2 h-8 leading-relaxed">
                          {producto.descripcion || 'Sin descripción disponible.'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-800/80">
                        <div className="flex justify-between items-baseline mb-3">
                          <span className="font-extrabold text-lg text-amber-400">
                            ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span className="text-xs text-neutral-400 font-normal">MXN</span>
                          </span>
                          <span className={`text-[11px] font-semibold ${isOutOfStock ? 'text-red-400' : 'text-emerald-400'}`}>
                            {isOutOfStock ? 'Sin stock' : `Disponibles: ${producto.stock}`}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(producto)}
                          disabled={isOutOfStock}
                          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                            isOutOfStock 
                              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                              : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-sm'
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {!user ? 'Ingresa para comprar' : 'Añadir al Carrito'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
