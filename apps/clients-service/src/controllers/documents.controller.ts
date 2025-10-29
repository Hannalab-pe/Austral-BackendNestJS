import {
    Controller,
    Get,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Request,
    Response,
    BadRequestException,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { Response as Res } from 'express';
import { DocumentsService, BulkUploadResult } from '../services/documents.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Get('template')
    @ApiOperation({
        summary: 'Descargar plantilla Excel para subida masiva de clientes',
        description: 'Genera y descarga una plantilla Excel con las columnas necesarias para la subida masiva de clientes. Los campos obligatorios tienen fondo azul y texto blanco, los opcionales tienen fondo blanco y texto negro.',
    })
    @ApiResponse({
        status: 200,
        description: 'Plantilla Excel generada exitosamente',
        content: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async downloadTemplate(@Response() res: Res): Promise<void> {
        try {
            const buffer = await this.documentsService.generateTemplate();

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename="plantilla_clientes.xlsx"'
            );

            res.send(buffer);
        } catch (error) {
            throw new BadRequestException('Error al generar la plantilla');
        }
    }

    @Post('bulk-upload')
    @ApiOperation({
        summary: 'Subir archivo Excel para creación masiva de clientes',
        description: 'Procesa un archivo Excel con datos de clientes y crea los registros en masa. Retorna un resumen de los resultados.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Archivo Excel con datos de clientes',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Archivo Excel (.xlsx) con los datos de clientes',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Subida masiva procesada exitosamente',
        schema: {
            type: 'object',
            properties: {
                success: {
                    type: 'number',
                    description: 'Número de clientes creados exitosamente',
                },
                errors: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            row: {
                                type: 'number',
                                description: 'Número de fila donde ocurrió el error',
                            },
                            error: {
                                type: 'string',
                                description: 'Descripción del error',
                            },
                        },
                    },
                    description: 'Lista de errores encontrados',
                },
                total: {
                    type: 'number',
                    description: 'Total de filas procesadas',
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Error en el procesamiento del archivo',
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB límite
        },
        fileFilter: (req, file, callback) => {
            // Validar tipo de archivo
            if (!file.originalname.match(/\.(xlsx|xls)$/)) {
                return callback(new BadRequestException('Solo se permiten archivos Excel (.xlsx o .xls)'), false);
            }
            callback(null, true);
        },
    }))
    async bulkUpload(
        @UploadedFile() file: Express.Multer.File,
        @Request() req: any,
    ): Promise<BulkUploadResult> {
        if (!file) {
            throw new BadRequestException('No se proporcionó ningún archivo');
        }

        // Obtener información del usuario autenticado
        const userId = req.user.idUsuario;
        const userRole = req.user.rol?.nombre || '';
        const userSupervisorId = req.user.supervisorId || null;

        return this.documentsService.processBulkUpload(file, userId, userRole, userSupervisorId);
    }
}