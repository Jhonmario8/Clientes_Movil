// services/firebaseService.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  runTransaction
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Client } from '../modelo/Cliente';
import { Product } from '../modelo/Product';

const CLIENTES_COLLECTION = 'clientes';
const PRODUCTOS_COLLECTION = 'productos';
const COMPRAS_COLLECTION = 'compras';

// ============ CLIENTES ============
export const getClientes = async (): Promise<Client[]> => {
  try {
    const q = query(collection(db, CLIENTES_COLLECTION), orderBy('nombre'));
    const querySnapshot = await getDocs(q);
    const clientes: Client[] = [];
    querySnapshot.forEach((doc) => {
      clientes.push({ id: doc.id, ...doc.data() } as Client);
    });
    console.log('📊 Clientes obtenidos:', clientes.length);
    return clientes;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return [];
  }
};



export const saveCliente = async (cliente: Client): Promise<boolean> => {
  try {


    if (cliente.id) {

      const docRef = doc(db, CLIENTES_COLLECTION, cliente.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        await updateDoc(docRef, {
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          correo: cliente.correo,
          fecha: cliente.fecha
        });
        console.log('✏️ Cliente actualizado:', cliente.nombre);
      } else {

        const newDocRef = await addDoc(collection(db, CLIENTES_COLLECTION), {
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          correo: cliente.correo,
          fecha: cliente.fecha
        });
        console.log('➕ Nuevo cliente creado con ID de Firestore:', newDocRef.id);
      }
    } else {

      const newDocRef = await addDoc(collection(db, CLIENTES_COLLECTION), {
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        correo: cliente.correo,
        fecha: cliente.fecha
      });
      console.log('➕ Nuevo cliente creado con ID de Firestore:', newDocRef.id);
    }
    return true;
  } catch (error) {
    console.error('❌ Error al guardar cliente:', error);
    return false;
  }
};

// services/firebaseService.ts

export const deleteCliente = async (id: string): Promise<boolean> => {
  try {
    console.log('🗑️ Intentando eliminar cliente con ID:', id);

    if (!id) {
      console.error('❌ ID de cliente vacío');
      return false;
    }

    const docRef = doc(db, CLIENTES_COLLECTION, id);

    // Verificar si existe antes de eliminar
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error('❌ El cliente NO existe en Firestore con ID:', id);
      return false;
    }

    console.log('📄 Documento encontrado:', docSnap.data());
    await deleteDoc(docRef);
    console.log('✅ Cliente eliminado correctamente de Firestore');
    return true;
  } catch (error) {
    console.error('❌ Error al eliminar cliente:', error);
    return false;
  }
};

// ============ PRODUCTOS ============
export const getProductos = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTOS_COLLECTION));
    const productos: Product[] = [];
    querySnapshot.forEach((doc) => {
      productos.push({ id: doc.id, ...doc.data() } as Product);
    });
    console.log('📦 Productos obtenidos:', productos.length);

    if (productos.length === 0) {
      await inicializarProductos();
      return await getProductos();
    }
    return productos;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
};

const inicializarProductos = async () => {
  const productosIniciales = [
    { nombre: "Laptop HP", descripcion: "8GB RAM, 512GB SSD", valorUnitario: 850.00, stock: 10 },
    { nombre: "Mouse Inalámbrico", descripcion: "Ergonómico, 2.4GHz", valorUnitario: 25.50, stock: 50 },
    { nombre: "Teclado Mecánico", descripcion: "RGB, Switches Blue", valorUnitario: 75.99, stock: 30 },
    { nombre: "Monitor 24\"", descripcion: "Full HD, 75Hz", valorUnitario: 180.00, stock: 15 },
    { nombre: "Auriculares USB", descripcion: "Con micrófono, sonido envolvente", valorUnitario: 45.50, stock: 25 }
  ];

  for (const prod of productosIniciales) {
    await addDoc(collection(db, PRODUCTOS_COLLECTION), prod);
  }
  console.log('✅ Productos iniciales creados');
};

export const saveProducto = async (producto: Product): Promise<boolean> => {
  try {
    if (producto.id) {
      const docRef = doc(db, PRODUCTOS_COLLECTION, producto.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, { ...producto });
        console.log('✏️ Producto actualizado:', producto.nombre);
      } else {
        await setDoc(docRef, { ...producto });
        console.log('➕ Producto creado con ID:', producto.nombre);
      }
    } else {
      await addDoc(collection(db, PRODUCTOS_COLLECTION), producto);
      console.log('➕ Producto creado:', producto.nombre);
    }
    return true;
  } catch (error) {
    console.error('Error al guardar producto:', error);
    return false;
  }
};

export const deleteProducto = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, PRODUCTOS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return false;
  }
};

// ============ COMPRAS ============
// ============ COMPRAS (CORREGIDO) ============
export const saveCompra = async (encabezado: any, detalles: any[]): Promise<boolean> => {
  try {
    await runTransaction(db, async (transaction) => {
      console.log('🛒 Iniciando transacción de compra...');

      // ✅ FASE 1: SOLO LECTURAS
      const productosActualizados: Array<{ ref: any, nuevoStock: number }> = [];

      for (const detalle of detalles) {
        const productoRef = doc(db, PRODUCTOS_COLLECTION, detalle.idProducto);
        const productoDoc = await transaction.get(productoRef);

        if (!productoDoc.exists()) {
          throw new Error(`Producto con ID ${detalle.idProducto} no encontrado`);
        }

        const stockActual = productoDoc.data().stock;
        const nuevoStock = stockActual - detalle.cantidad;

        if (nuevoStock < 0) {
          throw new Error(`Stock insuficiente para el producto ${detalle.idProducto}`);
        }

        productosActualizados.push({
          ref: productoRef,
          nuevoStock: nuevoStock
        });

        console.log(`📦 Producto ${detalle.idProducto}: stock ${stockActual} -> ${nuevoStock}`);
      }

      // ✅ FASE 2: SOLO ESCRITURAS
      for (const item of productosActualizados) {
        transaction.update(item.ref, { stock: item.nuevoStock });
      }

      // Crear documento de compra
      const compraRef = doc(collection(db, COMPRAS_COLLECTION));
      transaction.set(compraRef, {
        idCliente: encabezado.idCliente,
        fecha: encabezado.fecha,
        subTotal: encabezado.subTotal,
        descuentoTotal: encabezado.descuentoTotal,
        total: encabezado.total,
        detalles: detalles,
        fechaCreacion: new Date().toISOString()
      });

      console.log('✅ Transacción completada');
    });

    return true;
  } catch (error) {
    console.error('❌ Error en transacción:', error);
    return false;
  }
};
// services/firebaseService.ts

const USUARIOS_COLLECTION = 'usuarios';

// Guardar usuario con rol
export const saveUsuario = async (uid: string, email: string, rol: 'admin' | 'cliente'): Promise<boolean> => {
  try {
    const usuarioRef = doc(db, USUARIOS_COLLECTION, uid);
    await setDoc(usuarioRef, {
      email,
      rol,
      fechaRegistro: new Date().toISOString()
    });
    console.log('✅ Usuario guardado con rol:', rol);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar usuario:', error);
    return false;
  }
};


export const getUserRole = async (uid: string): Promise<'admin' | 'cliente' | null> => {
  try {
    const usuarioRef = doc(db, USUARIOS_COLLECTION, uid);
    const usuarioDoc = await getDoc(usuarioRef);

    if (usuarioDoc.exists()) {
      return usuarioDoc.data().rol;
    }
    return null;
  } catch (error) {
    console.error('❌ Error al obtener rol:', error);
    return null;
  }
};

export const isAdmin = async (uid: string): Promise<boolean> => {
  const rol = await getUserRole(uid);
  return rol === 'admin';
};