import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private readonly supabaseUrl = 'https://wojlvifztpwotgkqqqfm.supabase.co';
  private readonly supabaseKey = 'sb_publishable_mUGYV5uWqho95p0FrD-XRw_vpu5qxkm';
  private readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        storage: window.localStorage, // Fuerza el uso del almacenamiento local compatible
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false // Desactiva la búsqueda de tokens en la URL (útil solo en web)
      }
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  async getNombreUsuario(): Promise<string> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) return 'Invitado';

    const nombre = user.user_metadata?.['first_name'] || user.email?.split('@')[0];
    return nombre || 'Cliente';
  }

  async registrarIngreso() {
    const { data: { user } } = await this.supabase.auth.getUser();

    if (!user) {
      throw new Error('No hay un usuario autenticado.');
    }

    const { data, error } = await this.supabase
      .from('lista_espera')
      .insert([
        { 
          cliente_id: user.id, 
          nombre_cliente: await this.getNombreUsuario(),
          estado_espera: 'esperando'
        }
      ]);

    if (error) throw error;
    return data;
  }

  async getEstadisticasPlatos() {
    const { data, error } = await this.supabase
      .from('estadisticas_platos')
      .select('categoria, cantidad')
      .order('cantidad', { ascending: false });
    
    if (error) {
      console.error('Error obteniendo estadísticas:', error.message);
      throw error;
    }
    return data;
  }

  // --- Funciones añadidas para Alta de Empleado ---

  async crearUsuarioAuth(email: string, clave: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: clave,
    });
    
    if (error) throw error;
    return data;
  }

  async insertarPerfilUsuario(perfilData: any) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .insert([perfilData]);
      
    if (error) throw error;
    return data;
  }

  async uploadFile(bucket: string, filePath: string, file: File) {
    return await this.supabase.storage.from(bucket).upload(filePath, file);
  }

  async getPublicUrl(bucket: string, filePath: string) {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async removeFile(bucket: string, path: string) {
    return await this.supabase.storage.from(bucket).remove([path]);
  }
}