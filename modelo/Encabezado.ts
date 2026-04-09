// modelo/Encabezado.ts
export interface Encabezado {
  id: string;
  idCliente: string;
  fecha: string;
  subTotal: number;
  descuentoTotal: number;
  total: number;
}

export interface Detalle {
  id: string;
  idEncabezado: string;
  idProducto: string;
  cantidad: number;
  valor: number;
}