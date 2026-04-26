import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service'; // 👈 importás el que ya tenés
import { PerfilTestModel } from '../models/perfil-test.model';

@Injectable({ providedIn: 'root' })
export class PerfilesTestService {

  constructor(private supabaseService: SupabaseService) {}
  //          👆 Angular inyecta el servicio existente, no creás nada nuevo

  async getPerfiles(): Promise<PerfilTestModel[]> {
    const { data, error } = await this.supabaseService.client  // 👈 usás el getter .client
      .from('perfiles_test')
      .select('*');

    if (error) {
      console.error('Error trayendo perfiles:', error);
      return [];
    }

    return data as PerfilTestModel[];
  }
}