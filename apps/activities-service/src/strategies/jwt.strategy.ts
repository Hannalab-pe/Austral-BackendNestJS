import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET', 'austral-jwt-secret-2024'),
        });
    }

    async validate(payload: any) {
        // El payload ya fue validado por el api-gateway, solo extraemos la información
        return {
            userId: payload.sub,
            email: payload.email,
            nombreUsuario: payload.nombreUsuario,
            nombreCompleto: payload.nombreCompleto,
            idRol: payload.idRol,
        };
    }
}