import { inject, Injectable, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';
import Mensaje from '../app/paginas/interfaces/mensaje';

@Injectable({
  providedIn: 'root',
})
export class Realtime {
  private sup = inject(SupabaseService);
  public canal = this.sup.supabase.channel('table-db-changes');

  constructor() {}

  async traerPorMesa(numero_mesa: number): Promise<Mensaje[]> {
    const { data, error } = await this.sup.supabase
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
    const { error } = await this.sup.supabase
      .from('chat')
      .insert({ mensaje, usuario, numero_mesa });
      
    if (error) throw error;
  }
}
