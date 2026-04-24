import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  public usuarioActual: WritableSignal<User | null> = signal<User | null>(null);

  constructor() {
    this.initAuthListener();
  }

  // 🔄 Mantiene sesión sincronizada
  private initAuthListener() {
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      this.usuarioActual.set(session?.user ?? null);
    });
  }

async register(data: {
    nombres: string;
    apellidos: string;
    dni: string;       // <-- Agregado
    cuil: string;      // <-- Modificado (antes era dni_cuil)
    correo_electronico: string;
    clave: string;
    perfil: string;
    foto?: string | null; 
  }): Promise<{ ok: boolean; error?: any }> {

    // 1️⃣ Crear usuario en AUTH (Aquí se guarda la contraseña)
    const { data: authData, error: authError } =
      await this.supabaseService.client.auth.signUp({
        email: data.correo_electronico,
        password: data.clave,
        options: {
          data: { 
            perfil: data.perfil,
            nombre: data.nombres,
            apellido: data.apellidos,
           }
        }
      });

    if (authError) {
      return { ok: false, error: authError };
    }

    const userId = authData.user?.id;

    if (!userId) {
      return { ok: false, error: 'No se pudo obtener el ID del usuario' };
    }

    // 2️⃣ Insertar en tabla pública "usuarios"
    const { error: dbError } = await this.supabaseService.client
      .from('usuarios')
      .insert([
        {
          id: userId,
          nombres: data.nombres,
          apellidos: data.apellidos,
          dni: data.dni,     // <-- Ahora se guarda el DNI
          cuil: data.cuil,   // <-- Ahora se guarda el CUIL
          correo_electronico: data.correo_electronico,
          perfil: data.perfil,
          foto: data.foto || null 
        }
      ]);

    if (dbError) {
      return { ok: false, error: dbError };
    }

    return { ok: true };
  }
  // 🔐 LOGIN
  async login(email: string, password: string): Promise<boolean> {
    const { error } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error(error.message);
      return false;
    }

    this.router.navigate(['/bienvenida']);
    return true;
  }

  // 🚪 LOGOUT
  async logout(): Promise<void> {
    await this.supabaseService.client.auth.signOut();
    this.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }

  // 👤 Usuario actual
  async getUsuario() {
    const { data } = await this.supabaseService.client.auth.getUser();
    return data.user;
  }

  // 🔐 Estado login
  isLogged(): boolean {
    return this.usuarioActual() !== null;
  }
}