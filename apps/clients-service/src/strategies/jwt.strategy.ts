import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * Estrategia JWT para validar tokens en el servicio de clientes
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET', 'austral-jwt-secret-2024'),
        });
    }

    /**
     * Valida el payload del JWT y retorna el usuario
     * El payload actualizado del auth-service incluye:
     * - sub, id: ID del usuario
     * - email, nombreUsuario, nombre, apellido
     * - rol: Objeto completo { idRol, nombre }
     * - supervisorId: ID del supervisor (para Vendedores)
     */
    async validate(payload: any) {
        return {
            idUsuario: payload.id || payload.sub, // Usar 'id' o 'sub' como fallback
            email: payload.email,
            nombre: payload.nombre,
            apellido: payload.apellido,
            rol: payload.rol, // Objeto completo del rol
            supervisorId: payload.supervisorId || null,
        };
    }
}
