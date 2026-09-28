export interface TrabajadorDB {
  id: string;
  rut: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  correo: string;
  celular: string;
  especialidad_tecnica: string;
  estado_operativo: 'Activo' | 'Inactivo';
}