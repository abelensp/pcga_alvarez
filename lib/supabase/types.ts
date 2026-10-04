export interface TrabajadorDB {
  id: string;
  rut: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string; // Formato YYYY-MM-DD
  nacionalidad?: string;
  estado_civil?: string;
  telefono: string;
  email?: string;
  direccion: string;
  cargo: string;
  tipo_contrato: string;
  fecha_ingreso: string;
  sueldo_base: string;
  afp: string;
  sistema_salud: string;
  tramo_salud?: string;
  banco?: string;
  tipo_cuenta?: string;
  numero_cuenta?: string;
  contacto_emergencia_nombre?: string;
  contacto_emergencia_parentesco?: string;
  contacto_emergencia_telefono?: string;
  estado?: string;
  created_at?: string;
}