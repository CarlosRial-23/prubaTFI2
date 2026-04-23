// src/app/paginas/chat/chat.ts
import { Component, inject, signal, Input, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular'; 
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
export class Chat implements OnInit, OnDestroy {
  // Recibimos el número de mesa y si el usuario actual es un mozo (opcional para vista)
  @Input() numero_mesa!: number; 
  @Input() esMozo: boolean = false;

  realtime = inject(Realtime);
  protected authService = inject(AuthService);
  private modalCtrl = inject(ModalController);

  mensajes = signal<Mensaje[]>([]);
  usuarioActual: string = '';
  msj = '';
  
  async ngOnInit() {
    try {
      console.log('Inicializando componente Chat para la mesa:', this.numero_mesa);
      
      const usuario = await this.authService.getUsuario();
      // Extraemos el apellido como string. Usamos 'Invitado' como respaldo si es null
      this.usuarioActual = usuario?.user_metadata?.['apellido'] || 'Invitado';

      // 1. Cargar mensajes iniciales de esta mesa
      const mensajesIniciales = await this.realtime.traerPorMesa(this.numero_mesa);
      this.mensajes.set(mensajesIniciales);
      
    } catch (error) {
      console.error('Error al cargar mensajes o usuario:', error);
    }

    // 2. Escuchar nuevos mensajes en tiempo real
    this.realtime.canal
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Mejor escuchar solo INSERT para chats
          schema: 'public',
          table: 'chat',
        },
        (payload) => {
          const nuevoMensaje = payload.new as Mensaje;
          // IMPORTANTÍSIMO: Filtrar para mostrar solo si es de la sala/mesa actual
          if (nuevoMensaje.numero_mesa === this.numero_mesa) {
             this.mensajes.update((msgs) => [...msgs, nuevoMensaje]);
          }
        }
      )
      .subscribe();
  }

  async enviarMensaje() {
    if (!this.msj.trim()) return;

    try {
      const usuario = await this.authService.getUsuario();
      
      // Aplicamos la misma lógica para enviar el mensaje con el apellido
      const nombreUsuario = usuario?.user_metadata?.['apellido'] || 'Invitado';

      await this.realtime.crear(this.msj, nombreUsuario, this.numero_mesa);
      this.msj = ''; // Limpiamos el input después de enviar
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  }

  ngOnDestroy() {
    // Es buena práctica desuscribirse al destruir el componente
    if (this.realtime && this.realtime.canal) {
      this.realtime.canal.unsubscribe();
    }
  }

  cerrarChat() {
    this.modalCtrl.dismiss();
  }
}