import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientesService } from './clientes.service';

export interface BulkUploadResult {
    success: number;
    errors: Array<{
        row: number;
        error: string;
    }>;
    total: number;
}

@Injectable()
export class DocumentsService {
    constructor(private readonly clientesService: ClientesService) { }

    /**
     * Genera una plantilla Excel para la subida masiva de clientes usando exceljs para aplicar estilos
     */
    async generateTemplate(): Promise<Buffer> {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Plantilla_Clientes');

        // Definir encabezados y ejemplo
        const headers = [
            'Tipo de persona',
            'Tipo de documento',
            'Numero de documento',
            'Nombre',
            'Apellido',
            'Razon Social',
            'Telefono 1',
            'Correo',
            'Cumpleaños',
            'Telefono 2',
            'WhatsApp',
            'Email',
            'Direccion',
            'Distrito',
            'Provincia',
            'Departamento'
        ];
        const exampleData = [
            ['NATURAL', 'DNI', '12345678', 'Juan', 'Pérez', '', '987654321', 'juan.perez@email.com', '1990-05-15', '987654322', '987654323', 'juan.perez@gmail.com', 'Av. Principal 123', 'Lima', 'Lima', 'Lima'],
            ['JURIDICO', 'RUC', '20123456789', '', '', 'Empresa S.A.', '987654322', 'contacto@empresa.com', '', '', '', 'contacto2@empresa.com', 'Jr. Comercio 456', 'Miraflores', 'Lima', 'Lima']
        ];

        // Agregar encabezados
        worksheet.addRow(headers);
        // Agregar ejemplos
        exampleData.forEach(row => worksheet.addRow(row));

        // Definir estilos de columnas
        const requiredColumns = [1, 2, 3, 4, 5, 6, 7, 8]; // 1-based para exceljs
        const optionalColumns = [9, 10, 11, 12, 13, 14, 15, 16];

        // Anchos de columna
        const colWidths = [15, 20, 20, 20, 20, 25, 15, 30, 15, 15, 15, 30, 30, 20, 20, 20];
        worksheet.columns.forEach((col, idx) => {
            col.width = colWidths[idx] || 20;
        });

        // Estilos de encabezado
        headers.forEach((header, idx) => {
            const cell = worksheet.getRow(1).getCell(idx + 1);
            if (requiredColumns.includes(idx + 1)) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF0066CC' }
                };
                cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            } else {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' }
                };
                cell.font = { color: { argb: 'FF000000' } };
            }
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        // Ajustar altura de encabezado
        worksheet.getRow(1).height = 22;

        // Exportar a buffer
        const arrayBuffer = await workbook.xlsx.writeBuffer();
        // Convertir ArrayBuffer a Buffer de Node.js
        return Buffer.from(arrayBuffer);
    }

    /**
     * Procesa el archivo Excel para subida masiva de clientes
     */
    async processBulkUpload(
        file: Express.Multer.File,
        userId: string,
        userRole: string,
        userSupervisorId: string | null
    ): Promise<BulkUploadResult> {
        const ExcelJS = await import('exceljs');
        try {
            // Logs de depuración del archivo recibido
            console.log('=== DEPURACIÓN ARCHIVO RECIBIDO ===');
            console.log('Nombre original:', file.originalname);
            console.log('Mimetype:', file.mimetype);
            console.log('Tamaño:', file.size);
            console.log('Tipo de buffer:', typeof file.buffer);
            console.log('Buffer es Buffer?', Buffer.isBuffer(file.buffer));
            console.log('Longitud del buffer:', file.buffer?.length);
            console.log('Primeros 10 bytes del buffer:', file.buffer?.slice(0, 10)?.toString('hex'));
            console.log('=====================================');

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(file.buffer as any);
            const worksheet = workbook.worksheets[0];
            if (!worksheet) {
                console.error('No se encontró ninguna hoja en el archivo Excel');
                throw new BadRequestException('No se encontró ninguna hoja en el archivo Excel');
            }

            const result: BulkUploadResult = {
                success: 0,
                errors: [],
                total: 0
            };

            let isFirstRow = true; // Para saltar el encabezado
            const createPromises: Promise<void>[] = [];

            worksheet.eachRow((row, rowNumber) => {
                if (isFirstRow) {
                    isFirstRow = false;
                    return; // Saltar encabezado
                }

                const values = Array.isArray(row.values) ? row.values.slice(1) : [];
                // console.log(`Fila ${rowNumber}:`, values); // Comentado para producción

                // Función auxiliar para extraer el valor real de una celda
                const getCellValue = (cell: any): string => {
                    if (cell === undefined || cell === null) return '';
                    if (typeof cell === 'object' && cell.text !== undefined) {
                        // Manejar celdas con hipervínculos
                        return String(cell.text).trim();
                    }
                    return String(cell).trim();
                };

                if (values.length === 0 || values.every(v => getCellValue(v) === '')) {
                    console.log(`Fila ${rowNumber} vacía, se omite.`);
                    return;
                }

                result.total++;
                const rowNumberForError = rowNumber;

                try {
                    const clienteData = this.validateAndMapRow(values.map(getCellValue), rowNumberForError);
                    const createPromise = this.clientesService.create(clienteData, userId, userRole, userSupervisorId)
                        .then(() => {
                            result.success++;
                        })
                        .catch(error => {
                            console.error(`Error creando cliente en fila ${rowNumberForError}:`, error.message);
                            result.errors.push({
                                row: rowNumberForError,
                                error: error.message || 'Error desconocido'
                            });
                        });
                    createPromises.push(createPromise);
                } catch (error) {
                    console.error(`Error validando fila ${rowNumberForError}:`, error.message);
                    result.errors.push({
                        row: rowNumberForError,
                        error: error.message || 'Error desconocido'
                    });
                }
            });

            await Promise.all(createPromises);

            console.log('Resultado final subida masiva:', result);
            return result;
        } catch (error) {
            console.error('Error global al procesar el archivo Excel:', error.message);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Error al procesar el archivo Excel');
        }
    }

    /**
     * Valida y mapea una fila del Excel a los datos del cliente
     */
    private validateAndMapRow(row: any[], rowNumber: number): any {
        if (row.length < 8) {
            throw new BadRequestException(`Fila ${rowNumber}: Datos insuficientes. Se requieren al menos 8 columnas obligatorias`);
        }

        const [
            tipoPersona,
            tipoDocumento,
            numeroDocumento,
            nombre,
            apellido,
            razonSocial,
            telefono1,
            correo,
            cumpleanos,    // opcional
            telefono2,     // opcional
            whatsapp,      // opcional
            email,         // opcional
            direccion,     // opcional
            distrito,      // opcional
            provincia,     // opcional
            departamento   // opcional
        ] = row.map(cell => cell ? String(cell).trim() : '');

        // Validaciones de campos obligatorios
        if (!tipoPersona || !['NATURAL', 'JURIDICO'].includes(tipoPersona.toUpperCase())) {
            throw new BadRequestException(`Fila ${rowNumber}: Tipo de persona debe ser 'NATURAL' o 'JURIDICO'`);
        }

        if (!tipoDocumento || tipoDocumento.length === 0) {
            throw new BadRequestException(`Fila ${rowNumber}: Tipo de documento es obligatorio`);
        }

        if (!numeroDocumento || numeroDocumento.length === 0) {
            throw new BadRequestException(`Fila ${rowNumber}: Número de documento es obligatorio`);
        }

        if (!telefono1 || telefono1.length === 0) {
            throw new BadRequestException(`Fila ${rowNumber}: Teléfono 1 es obligatorio`);
        }

        if (!correo || correo.length === 0) {
            throw new BadRequestException(`Fila ${rowNumber}: Correo es obligatorio`);
        }

        // Validar formato de email básico para el correo obligatorio
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            throw new BadRequestException(`Fila ${rowNumber}: Formato de correo inválido`);
        }

        // Para persona natural, nombre y apellido son obligatorios
        if (tipoPersona.toUpperCase() === 'NATURAL') {
            if (!nombre || nombre.length === 0) {
                throw new BadRequestException(`Fila ${rowNumber}: Nombre es obligatorio para persona natural`);
            }
            if (!apellido || apellido.length === 0) {
                throw new BadRequestException(`Fila ${rowNumber}: Apellido es obligatorio para persona natural`);
            }
        }

        // Para persona jurídica, razón social es obligatoria
        if (tipoPersona.toUpperCase() === 'JURIDICO') {
            if (!razonSocial || razonSocial.length === 0) {
                throw new BadRequestException(`Fila ${rowNumber}: Razón social es obligatoria para persona jurídica`);
            }
        }

        // Validar cumpleaños si se proporciona
        let cumpleanosDate: Date | undefined;
        if (cumpleanos && cumpleanos.length > 0) {
            const date = new Date(cumpleanos);
            if (isNaN(date.getTime())) {
                throw new BadRequestException(`Fila ${rowNumber}: Formato de cumpleaños inválido. Use YYYY-MM-DD`);
            }
            cumpleanosDate = date;
        }

        // Validar email opcional si se proporciona
        if (email && email.length > 0 && !emailRegex.test(email)) {
            throw new BadRequestException(`Fila ${rowNumber}: Formato de email opcional inválido`);
        }

        // Mapear datos
        const clienteData: any = {
            tipoPersona: tipoPersona.toUpperCase(),
            tipoDocumento,
            numeroDocumento,
            nombres: tipoPersona.toUpperCase() === 'NATURAL' ? nombre : null,
            apellidos: tipoPersona.toUpperCase() === 'NATURAL' ? apellido : null,
            razonSocial: tipoPersona.toUpperCase() === 'JURIDICO' ? razonSocial : null,
            telefono1,
            emailNotificaciones: correo,
            estaActivo: true,
            recibirNotificaciones: true
        };

        // Agregar campos opcionales si se proporcionan
        if (cumpleanosDate) {
            clienteData.cumpleanos = cumpleanosDate;
        }

        if (telefono2 && telefono2.length > 0) {
            clienteData.telefono2 = telefono2;
        }

        if (whatsapp && whatsapp.length > 0) {
            clienteData.whatsapp = whatsapp;
        }

        if (email && email.length > 0) {
            // Si hay email opcional, podríamos usarlo para otro campo, pero por ahora lo ignoramos
            // ya que emailNotificaciones ya está mapeado al correo obligatorio
        }

        // Agregar campos de dirección opcionales
        if (direccion && direccion.length > 0) {
            clienteData.direccion = direccion;
        } else {
            clienteData.direccion = 'Por actualizar'; // Valor por defecto
        }

        if (distrito && distrito.length > 0) {
            clienteData.distrito = distrito;
        }

        if (provincia && provincia.length > 0) {
            clienteData.provincia = provincia;
        }

        if (departamento && departamento.length > 0) {
            clienteData.departamento = departamento;
        }

        return clienteData;
    }
}