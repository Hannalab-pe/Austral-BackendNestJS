export class CreateClienteDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  telefonoSecundario?: string;
  numeroDocumento: string;
  tipoDocumento: string;
  fechaNacimiento: Date;
  direccion: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  ocupacion?: string;
  empresa?: string;
  estadoCivil?: string;
  contactoEmergenciaNombre?: string;
  contactoEmergenciaTelefono?: string;
  contactoEmergenciaRelacion?: string;
}
