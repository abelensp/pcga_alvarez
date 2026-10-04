import { createClient } from '../lib/supabase/client';
import { FaenaDB } from '../lib/supabase/types';

const supabase = createClient();

export async function obtenerFaenas(): Promise<FaenaDB[]> {
  const { data, error } = await supabase
    .from('faenas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function crearFaena(faena: Omit<FaenaDB, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('faenas')
    .insert([faena])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function actualizarFaena(id: number, faena: Partial<FaenaDB>) {
  const { data, error } = await supabase
    .from('faenas')
    .update(faena)
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}