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
  dni_cuil: string;
  correo_electronico: string;
  clave: string;
  perfil: string;
  foto?: string | null; // 📸 Se agrega la propiedad como opcional
}): Promise<{ ok: boolean; error?: any }> {

  // 1️⃣ Crear usuario en AUTH
  const { data: authData, error: authError } =
    await this.supabaseService.client.auth.signUp({
      email: data.correo_electronico,
      password: data.clave,
    });

  if (authError) {
    return { ok: false, error: authError };
  }

  const userId = authData.user?.id;

  if (!userId) {
    return { ok: false, error: 'No se pudo obtener el ID del usuario' };
  }

  // 2️⃣ Insertar en tabla "usuarios"
  const { error: dbError } = await this.supabaseService.client
    .from('usuarios')
    .insert([
      {
        id: userId,
        nombres: data.nombres,
        apellidos: data.apellidos,
        dni_cuil: data.dni_cuil,
        correo_electronico: data.correo_electronico,
        perfil: data.perfil,
        // 🔥 Si data.foto es undefined o string vacío, inserta null
        foto: data.foto || null 
      }
    ]);

  if (dbError) {
    // Opcional: Podrías eliminar el usuario de Auth si falla la inserción en la tabla
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