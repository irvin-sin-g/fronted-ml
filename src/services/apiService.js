// Detecta la variable de entorno de Vite o usa localhost como respaldo en desarrollo
const BASE_ENV_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1/";
// Asegura que no termine con diagonal duplicada al concatenar
const API_URL = BASE_ENV_URL.endsWith('/') ? BASE_ENV_URL : `${BASE_ENV_URL}/`;

const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const errortext = await response.text();
        throw new Error(errortext || "Error en la petición"); 
    }

    if (response.status === 204) return null;

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }

    return await response.text();
};

export const apiService = {

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getUserRole: () => {
        return localStorage.getItem('rol');
    },

    getUserName: () => {
        return localStorage.getItem('nombre') || localStorage.getItem('username');
    },

    // ==========================================
    // AUTENTICACIÓN
    // ==========================================
    registro: async (userData) => {
        const response = await fetch(`${API_URL}auth/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return await handleResponse(response);
    },

    login: async (username, password) => {
        const response = await fetch(`${API_URL}auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await handleResponse(response);
        if (data && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username || '');
            localStorage.setItem('nombre', data.nombre || '');
            localStorage.setItem('rol', data.rol || '');
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('nombre');
        localStorage.removeItem('rol');
    },

    // ==========================================
    // PETICIONES A PRODUCTOS
    // ==========================================
    getProductos: async () => {
        const response = await fetch(`${API_URL}productos/`, { headers: getHeaders() });
        return await handleResponse(response);
    },

    getProducto: async (id) => {
        const response = await fetch(`${API_URL}productos/${id}`, { headers: getHeaders() });
        return await handleResponse(response);
    },

    creaProducto: async (producto) => {
        const response = await fetch(`${API_URL}productos`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(producto),
        });
        return await handleResponse(response);
    },

    actualizarProducto: async (id, producto) => {
        const response = await fetch(`${API_URL}productos/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(producto),
        });
        return await handleResponse(response);
    },

    eliminarProducto: async (id) => {
        const response = await fetch(`${API_URL}productos/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    // ==========================================
    // PETICIONES A CATEGORÍAS
    // ==========================================
    getCategorias: async () => {
        const response = await fetch(`${API_URL}categorias/`, { headers: getHeaders() });
        return await handleResponse(response);
    },

    getCategoria: async (id) => {
        const response = await fetch(`${API_URL}categorias/${id}`, { headers: getHeaders() });
        return await handleResponse(response);
    },

    crearCategoria: async (categoria) => {
        const response = await fetch(`${API_URL}categorias`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(categoria),
        });
        return await handleResponse(response);
    },

    actualizarCategoria: async (id, categoria) => {
        const response = await fetch(`${API_URL}categorias/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(categoria),
        });
        return await handleResponse(response);
    },

    eliminarCategoria: async (id) => {
        const response = await fetch(`${API_URL}categorias/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    // ==========================================
    // PETICIONES A CLIENTES
    // ==========================================
    getClientes: async () => {
        const response = await fetch(`${API_URL}clientes/`, { headers: getHeaders() });
        return await handleResponse(response);
    },

    getCliente: async (id) => {
        const response = await fetch(`${API_URL}clientes/${id}`, { headers: getHeaders() });
        return await handleResponse(response);
    },

    crearCliente: async (cliente) => {
        const response = await fetch(`${API_URL}clientes`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(cliente),
        });
        return await handleResponse(response);
    },

    actualizarCliente: async (id, cliente) => {
        const response = await fetch(`${API_URL}clientes/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(cliente),
        });
        return await handleResponse(response);
    },

    eliminarCliente: async (id) => {
        const response = await fetch(`${API_URL}clientes/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    // ==========================================
    // PETICIONES A PROVEEDORES
    // ==========================================
    getProveedores: async () => {
        const response = await fetch(`${API_URL}proveedores/`, { headers: getHeaders() });
        return await handleResponse(response);
    },

    getProveedor: async (id) => {
        const response = await fetch(`${API_URL}proveedores/${id}`, { headers: getHeaders() });
        return await handleResponse(response);
    },

    crearProveedor: async (proveedor) => {
        const response = await fetch(`${API_URL}proveedores`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(proveedor),
        });
        return await handleResponse(response);
    },

    actualizarProveedor: async (id, proveedor) => {
        const response = await fetch(`${API_URL}proveedores/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(proveedor),
        });
        return await handleResponse(response);
    },

    eliminarProveedor: async (id) => {
        const response = await fetch(`${API_URL}proveedores/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    // ==========================================
    // PETICIONES A VENTAS
    // ==========================================
    getVentas: async () => {
        const response = await fetch(`${API_URL}ventas/`, {
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    getVenta: async (id) => {
        const response = await fetch(`${API_URL}ventas/${id}`, {
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    procesarVenta: async (venta) => {
        const response = await fetch(`${API_URL}ventas/procesar`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(venta),
        });

        return await handleResponse(response);
    },

    getMisCompras: async () => {
        const response = await fetch(`${API_URL}ventas/mis-compras`, {
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    // ==========================================
    // PETICIONES A PAGOS (Stripe)
    // ==========================================
    crearIntencionPago: async (idVenta) => {
        const response = await fetch(`${API_URL}pagos/crear-intencion`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                idVenta,
                moneda: "mxn",
            }),
        });

        return await handleResponse(response);
    },

    confirmarPagoVenta: async (idVenta) => {
        const response = await fetch(`${API_URL}pagos/confirmar-pago/${idVenta}`, {
            method: "POST",
            headers: getHeaders(),
        });

        return await handleResponse(response);
    },
};
