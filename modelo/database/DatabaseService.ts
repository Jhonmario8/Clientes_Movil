// database/StorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client } from '../../modelo/Cliente';
import { Product } from '../../modelo/Product';

const STORAGE_KEYS = {
  CLIENTES: '@clientes',
  PRODUCTOS: '@productos',
  COMPRAS: '@compras'
};

// Productos iniciales
const productosIniciales: Product[] = [
  { id: "1", nombre: "Laptop HP", descripcion: "8GB RAM, 512GB SSD", valorUnitario: 850.00, stock: 10 },
  { id: "2", nombre: "Mouse Inalámbrico", descripcion: "Ergonómico, 2.4GHz", valorUnitario: 25.50, stock: 50 },
  { id: "3", nombre: "Teclado Mecánico", descripcion: "RGB, Switches Blue", valorUnitario: 75.99, stock: 30 },
  { id: "4", nombre: "Monitor 24\"", descripcion: "Full HD, 75Hz", valorUnitario: 180.00, stock: 15 },
  { id: "5", nombre: "Auriculares USB", descripcion: "Con micrófono, sonido envolvente", valorUnitario: 45.50, stock: 25 }
];

// Inicializar la base de datos
export const initDatabase = async () => {
  try {
    console.log('🔄 Inicializando Storage...');
    
    // Inicializar productos
    const productos = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTOS);
    if (!productos) {
      console.log('📦 Creando productos iniciales...');
      await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productosIniciales));
    } else {
      console.log('✅ Productos existentes:', JSON.parse(productos).length);
    }
    
    // Inicializar clientes
    const clientes = await AsyncStorage.getItem(STORAGE_KEYS.CLIENTES);
    if (!clientes) {
      console.log('👥 Creando array de clientes vacío...');
      await AsyncStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify([]));
    } else {
      console.log('✅ Clientes existentes:', JSON.parse(clientes).length);
    }

    console.log('✅ Storage inicializado correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar storage:', error);
  }
};

// ============ CLIENTES ============
export const getClientes = async (): Promise<Client[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CLIENTES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return [];
  }
};

export const saveCliente = async (cliente: Client): Promise<boolean> => {
  try {
    const clientes = await getClientes();
    const index = clientes.findIndex(c => c.id === cliente.id);
    
    if (index >= 0) {
      clientes[index] = cliente;
    } else {
      clientes.push(cliente);
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));
    console.log('✅ Cliente guardado:', cliente.nombre);
    return true;
  } catch (error) {
    console.error('Error al guardar cliente:', error);
    return false;
  }
};

export const deleteCliente = async (id: string): Promise<boolean> => {
  try {
    const clientes = await getClientes();
    const nuevosClientes = clientes.filter(c => c.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(nuevosClientes));
    console.log('✅ Cliente eliminado');
    return true;
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return false;
  }
};

// ============ PRODUCTOS ============
export const getProductos = async (): Promise<Product[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTOS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
};

export const updateStockProducto = async (id: string, nuevoStock: number): Promise<boolean> => {
  try {
    const productos = await getProductos();
    const producto = productos.find(p => p.id === id);
    if (producto) {
      producto.stock = nuevoStock;
      await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productos));
    }
    return true;
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    return false;
  }
};

// ============ COMPRAS ============
export const saveCompra = async (encabezado: any, detalles: any[]): Promise<boolean> => {
  try {
    console.log('🛒 Guardando compra...');
    
    // Actualizar stock de productos
    const productos = await getProductos();
    detalles.forEach(detalle => {
      const producto = productos.find(p => p.id === detalle.idProducto);
      if (producto) {
        producto.stock -= detalle.cantidad;
        console.log(`📉 Stock ${producto.nombre}: ${producto.stock + detalle.cantidad} -> ${producto.stock}`);
      }
    });
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productos));
    
    // Guardar compra en historial
    const compras = await AsyncStorage.getItem(STORAGE_KEYS.COMPRAS);
    const comprasArray = compras ? JSON.parse(compras) : [];
    comprasArray.push({ 
      ...encabezado, 
      detalles,
      fechaCompra: new Date().toISOString()
    });
    await AsyncStorage.setItem(STORAGE_KEYS.COMPRAS, JSON.stringify(comprasArray));
    
    console.log('✅ Compra guardada exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error al guardar compra:', error);
    return false;
  }
};

export const getCompras = async (): Promise<any[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPRAS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al obtener compras:', error);
    return [];
  }
};

// ============ UTILIDADES ============
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log('🧹 Storage limpiado completamente');
  } catch (error) {
    console.error('Error al limpiar storage:', error);
  }
};

export const resetProductos = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productosIniciales));
    console.log('🔄 Productos reseteados a valores iniciales');
  } catch (error) {
    console.error('Error al resetear productos:', error);
  }
};

export const saveProducto = async (producto: Product): Promise<boolean> => {
  try {
    const productos = await getProductos();
    const index = productos.findIndex(p => p.id === producto.id);
    
    if (index >= 0) {
      productos[index] = producto;
      console.log('✏️ Producto actualizado:', producto.nombre);
    } else {
      productos.push(producto);
      console.log('➕ Nuevo producto agregado:', producto.nombre);
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productos));
    return true;
  } catch (error) {
    console.error('Error al guardar producto:', error);
    return false;
  }
};

export const deleteProducto = async (id: string): Promise<boolean> => {
  try {
    const productos = await getProductos();
    const nuevosProductos = productos.filter(p => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(nuevosProductos));
    console.log('🗑️ Producto eliminado');
    return true;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return false;
  }
};