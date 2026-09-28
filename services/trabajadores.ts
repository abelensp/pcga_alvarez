import { createClient } from '../lib/supabase/client';
import { TrabajadorDB } from '../lib/supabase/types';

const supabase = createClient();

export async function obtenerTrabajadores(): Promise<TrabajadorDB[]> {
  const { data, error } = await supabase
    .from('trabajadores')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function crearTrabajador(trabajador: Omit<TrabajadorDB, 'id'>) {
  const { data, error } = await supabase
    .from('trabajadores')
    .insert([trabajador])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function actualizarTrabajador(id: string, trabajador: Partial<TrabajadorDB>) {
  const { data, error } = await supabase
    .from('trabajadores')
    .update(trabajador)
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}