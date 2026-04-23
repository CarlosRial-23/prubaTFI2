import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import Mensaje from '../interfaces/mensaje';
import { Realtime } from '../../../servicios/realtime';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat {
  realtime = inject(Realtime);
  protected authService = inject(AuthService);

  mensajes = signal<Mensaje[]>([]);
  usuarioActual: string = ''; // ← Nombre del usuario logueado
  msj = '';

  async ngOnInit() {
    try {
      const datos = await this.authService.getUsuario();
      this.usuarioActual  = datos; // Ajusta según lo que devuelva getDatos()

      const mensajesIniciales = await this.realtime.traerTodosFijo();
      this.mensajes.set(mensajesIniciales);
    } catch (error) {
      console.error('Error al cargar mensajes o usuario:', error);
    }

    // Escuchar nuevos mensajes en tiempo real
    this.realtime.canal
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat',
        },
        (payload) => {
          this.mensajes.update((msgs) => [...msgs, payload.new as Mensaje]);
        }
      )
      .subscribe();
  }

  async enviarMensaje() {
    if (!this.msj.trim()) return;

    try {
      const usuario = await this.authService.getUsuario();
      await this.realtime.crear(this.msj, usuario);
      this.msj = '';
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  }
}