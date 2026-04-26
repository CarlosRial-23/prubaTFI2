import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import Mensaje from '../models/mensaje';

@Injectable({
  providedIn: 'root',
})
export class Realtime {
  private sup = inject(SupabaseService);
  
  // CORRECCIÓN 1: Cambiado .supabase por .client
  public canal = this.sup.client.channel('table-db-changes');

  constructor() {}

  async traerPorMesa(numero_mesa: number): Promise<Mensaje[]> {
    // CORRECCIÓN 2: Cambiado .supabase por .client
    const { data, error } = await this.sup.client
      .from('chat')
      .select('*')
      .eq('numero_mesa', numero_mesa)
      .order('created_at', { ascending: true }); // Orden cronológico vital para un chat

    if (error) {
      console.error('Error obteniendo mensajes:', error);
      return [];
    }
    return data as Mensaje[];
  }

  async crear(mensaje: string, usuario: string, numero_mesa: number): Promise<void> {
    // CORRECCIÓN 3: Cambiado .supabase por .client
    const { error } = await this.sup.client
      .from('chat')
      .insert({ mensaje, usuario, numero_mesa });
      
    if (error) throw error;
  }
}