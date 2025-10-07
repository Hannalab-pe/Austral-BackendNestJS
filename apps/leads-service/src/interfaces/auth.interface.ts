export interface JwtPayload {
  sub: string;
  email: string;
  nombreUsuario: string;
  nombre: string;
  rol: string;
  permisos: string[];
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  nombreUsuario: string;
  nombre: string;
  rol: string;
  permisos: string[];
}
