import { inject, Injectable, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';
import Mensaje from '../app/paginas/interfaces/mensaje';

@Injectable({
  providedIn: 'root',
})
export class Realtime {
  private sup = inject(SupabaseService);

  // channel: Qué canal de información quiero escuchar. Está el table-db-changes y el schema-db-changes y cualquiera que creemos nosotros.
  public canal = this.sup.supabase.channel('table-db-changes');

  constructor() {}

  async traerTodosFijo(): Promise<Mensaje[]> {
    const { data, error } = await this.sup.supabase.from('chat').select('*');

    if (error) {
      return [];
    }
    return data as Mensaje[];
  }

  async crear(mensaje: string, usuario: string): Promise<void> {
    await this.sup.supabase.from('chat').insert({mensaje:mensaje, usuario:usuario});
  }
}
