import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
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
     * Genera una plantilla Excel para la subida masiva de clientes
     */
    async generateTemplate(): Promise<Buffer> {
        // Definir las columnas de la plantilla
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

        // Crear datos de ejemplo
        const exampleData = [
            ['NATURAL', 'DNI', '12345678', 'Juan', 'Pérez', '', '987654321', 'juan.perez@email.com', '1990-05-15', '987654322', '987654323', 'juan.perez@gmail.com', 'Av. Principal 123', 'Lima', 'Lima', 'Lima'],
            ['JURIDICO', 'RUC', '20123456789', '', '', 'Empresa S.A.', '987654322', 'contacto@empresa.com', '', '', '', 'contacto2@empresa.com', 'Jr. Comercio 456', 'Miraflores', 'Lima', 'Lima']
        ];

        // Crear workbook y worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([headers, ...exampleData]);

        // Establecer ancho de columnas
        ws['!cols'] = [
            { wch: 15 }, // Tipo de persona
            { wch: 20 }, // Tipo de documento
            { wch: 20 }, // Numero de documento
            { wch: 20 }, // Nombre
            { wch: 20 }, // Apellido
            { wch: 25 }, // Razon Social
            { wch: 15 }, // Telefono 1
            { wch: 30 }, // Correo
            { wch: 15 }, // Cumpleaños
            { wch: 15 }, // Telefono 2
            { wch: 15 }, // WhatsApp
            { wch: 30 }, // Email
            { wch: 30 }, // Direccion
            { wch: 20 }, // Distrito
            { wch: 20 }, // Provincia
            { wch: 20 }  // Departamento
        ];

        // Aplicar estilos a los encabezados
        // Campos obligatorios (fondo azul, texto blanco): columnas 0-7
        // Campos opcionales (fondo blanco, texto negro): columnas 8-15
        const requiredColumns = [0, 1, 2, 3, 4, 5, 6, 7]; // Índices de columnas obligatorias
        const optionalColumns = [8, 9, 10, 11, 12, 13, 14, 15]; // Índices de columnas opcionales

        // Aplicar estilo a encabezados obligatorios (fondo azul, texto blanco)
        requiredColumns.forEach(col => {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
            if (!ws[cellRef]) ws[cellRef] = { t: 's', v: headers[col] };
            ws[cellRef].s = {
                fill: { fgColor: { rgb: "FF0066CC" } }, // Azul
                font: { color: { rgb: "FFFFFFFF" } }, // Blanco
                alignment: { horizontal: "center", vertical: "center" }
            };
        });

        // Aplicar estilo a encabezados opcionales (fondo blanco, texto negro)
        optionalColumns.forEach(col => {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
            if (!ws[cellRef]) ws[cellRef] = { t: 's', v: headers[col] };
            ws[cellRef].s = {
                fill: { fgColor: { rgb: "FFFFFFFF" } }, // Blanco
                font: { color: { rgb: "FF000000" } }, // Negro
                alignment: { horizontal: "center", vertical: "center" }
            };
        });

        XLSX.utils.book_append_sheet(wb, ws, 'Plantilla_Clientes');

        // Convertir a buffer
        return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
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
        try {
            // Leer el archivo Excel
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convertir a JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

            if (jsonData.length < 2) {
                throw new BadRequestException('El archivo debe contener al menos los encabezados y una fila de datos');
            }

            // Remover fila de encabezados
            jsonData.shift();

            const result: BulkUploadResult = {
                success: 0,
                errors: [],
                total: jsonData.length
            };

            // Procesar cada fila
            for (let i = 0; i < jsonData.length; i++) {
                const row = jsonData[i];
                const rowNumber = i + 2; // +2 porque Excel empieza en 1 y ya removimos headers

                try {
                    // Validar y mapear datos
                    const clienteData = this.validateAndMapRow(row, rowNumber);

                    // Intentar crear el cliente
                    await this.clientesService.create(clienteData, userId, userRole, userSupervisorId);
                    result.success++;

                } catch (error) {
                    result.errors.push({
                        row: rowNumber,
                        error: error.message || 'Error desconocido'
                    });
                }
            }

            return result;

        } catch (error) {
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