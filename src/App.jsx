import { useState } from 'react';
import Footer from './components/Footer';
import { Catalogo } from './components/Catalogo';
import { Navbar } from './components/Navbar';
import { apiService } from './services/apiService';
import { Registro } from './components/Registro';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { ClienteDashboard } from './components/ClienteDashboard';
import { Cart } from './components/Cart';
import { CheckoutForm } from './components/CheckoutForm';

function App() {
  const [user, setUser] = useState(() => {
    if (apiService.isAuthenticated()) {
      const username = localStorage.getItem('username');
      const nombre = localStorage.getItem('nombre');
      const role = localStorage.getItem('rol') || localStorage.getItem('role');

      if (username || role) {
        return { username, nombre, role };
      }
    }
    return null;
  });

  const [renderNow, setRenderNow] = useState('catalogo');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [ventaActiva, setVentaActiva] = useState(null);

  const handleLoginSuccess = (userData) => {
    const userRole = userData.rol || userData.role;

    if (userData.username) localStorage.setItem('username', userData.username);
    if (userData.nombre) localStorage.setItem('nombre', userData.nombre);
    if (userRole) {
      localStorage.setItem('role', userRole);
      localStorage.setItem('rol', userRole);
    }

    const newUser = {
      username: userData.username,
      nombre: userData.nombre,
      role: userRole
    };

    setUser(newUser);

    if (userRole === 'ROLE_ADMIN') {
      setRenderNow('admin-panel');
    } else {
      setRenderNow('catalogo');
    }
  };

  const handleLogout = () => {
    if (apiService.logout) {
      apiService.logout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('nombre');
      localStorage.removeItem('role');
      localStorage.removeItem('rol');
    }

    setUser(null);
    setCart([]);
    setVentaActiva(null);
    setRenderNow('catalogo');
  };

  const AddToCart = (producto) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.producto.id === producto.id);
      if (existing) {
        if (existing.cantidad >= producto.stock) {
          alert("No se puede añadir más stock para " + producto.nombre + ". Inventario disponible " + producto.stock);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prevCart, { producto: producto, cantidad: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.producto.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartCountTotal = cart.reduce((sum, item) => sum + item.cantidad, 0);

  const updateQuantity = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      removeFromCart(productoId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.producto.id === productoId) {
          if (nuevaCantidad > item.producto.stock) {
            alert("No se puede exceder el stock disponible " + item.producto.stock);
            return item;
          }
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      })
    );
  };

  const renderTabContent = () => {
    switch (renderNow) {
      case 'catalogo':
        return <Catalogo setRenderNow={setRenderNow} user={user} AddToCart={AddToCart} />;
      case 'register':
        return (
          <Registro
            onRegisterSuccess={() => setRenderNow('login')}
            onGoToLogin={() => setRenderNow('login')}
          />
        );
      case 'login':
        return (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onGoToRegister={() => setRenderNow('register')}
          />
        );
      case 'admin-panel':
        if (user?.role !== 'ROLE_ADMIN') {
          return <div className="text-center my-12 text-red-600 font-bold">Acceso Denegado.</div>;
        }
        return <AdminDashboard setRenderNow={setRenderNow} user={user} />;
      case 'miscompras':
        if (!user) {
          return <div className="text-center my-12 text-red-600 font-bold">Inicia sesión para ver tu perfil.</div>;
        }
        return <ClienteDashboard user={user} />;
      case 'checkout':
        return (
          <CheckoutForm 
            ventaActiva={ventaActiva} 
            setRenderNow={setRenderNow} 
          />
        );
      default:
        return <Catalogo setRenderNow={setRenderNow} user={user} AddToCart={AddToCart} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 antialiased">
      <Navbar
        renderNow={renderNow}
        setRenderNow={setRenderNow}
        user={user}
        onLogout={handleLogout}
        cartCount={cartCountTotal}
        openCart={() => setIsCartOpen(true)}
      />
      <main className="flex-grow pb-12">
        {renderTabContent()}
      </main>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        setRenderNow={setRenderNow}
        setVentaActiva={setVentaActiva}
      />  
      <Footer />
    </div>
  );
}

export default App;