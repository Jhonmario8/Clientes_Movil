
export interface Usuario {
    uid: string;
    email: string;
    rol: 'admin' | 'cliente';
    nombre?: string;
    fechaRegistro: string;
}