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
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
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
}
