import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuditoriaService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    private getAuthServiceUrl(): string {
        return this.configService.get('AUTH_SERVICE_URL', 'http://localhost:3001');
    }

    async createAuditoriaRecord(data: {
        tabla: string;
        idRegistro: string;
        accion: string;
        idUsuario?: string;
        ipAddress?: string;
    }): Promise<void> {
        try {
            const authServiceUrl = this.getAuthServiceUrl();
            const url = `${authServiceUrl}/auditoria`;

            console.log('🔍 Intentando crear registro de auditoría:', {
                url,
                data,
                authServiceUrl
            });

            const response = await firstValueFrom(
                this.httpService.post(url, data)
            );

            console.log('✅ Registro de auditoría creado exitosamente:', response.data);

        } catch (error) {
            // Log detallado del error
            console.error('❌ Error al crear registro de auditoría:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: `${this.getAuthServiceUrl()}/auditoria`,
                data
            });
            // No lanzamos el error para no interrumpir la operación principal
        }
    }
}