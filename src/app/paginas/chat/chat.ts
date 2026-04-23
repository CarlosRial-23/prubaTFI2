import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; // <-- Importamos para recibir params
import { Location } from '@angular/common';       // <-- Importamos para volver atrás
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
  // Ya no son @Input()
  numero_mesa!: number; 
  esMozo: boolean = false;

  realtime = inject(Realtime);
  protected authService = inject(AuthService);
  private route = inject(ActivatedRoute); // <-- Inyectamos ActivatedRoute
  private location = inject(Location);    // <-- Inyectamos Location

  mensajes = signal<Mensaje[]>([]);
  usuarioActual: string = '';
  msj = '';
  
  async ngOnInit() {
    try {
      // 1. Recibir los parámetros pasados por la URL
      this.route.queryParams.subscribe(params => {
        this.numero_mesa = Number(params['numero_mesa']) || 0;
        this.esMozo = params['esMozo'] === 'true' || params['esMozo'] === true;
      });

      console.log('Inicializando componente Chat para la mesa:', this.numero_mesa);
      
      const usuario = await this.authService.getUsuario();
      this.usuarioActual = usuario?.user_metadata?.['apellido'] || 'Invitado';

      // 2. Cargar mensajes iniciales de esta mesa
      const mensajesIniciales = await this.realtime.traerPorMesa(this.numero_mesa);
      this.mensajes.set(mensajesIniciales);
      
    } catch (error) {
      console.error('Error al cargar mensajes o usuario:', error);
    }

    // 3. Escuchar nuevos mensajes en tiempo real
    this.realtime.canal
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat',
        },
        (payload) => {
          const nuevoMensaje = payload.new as Mensaje;
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
      const nombreUsuario = usuario?.user_metadata?.['apellido'] || 'Invitado';

      await this.realtime.crear(this.msj, nombreUsuario, this.numero_mesa);
      this.msj = '';
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  }

  ngOnDestroy() {
    if (this.realtime && this.realtime.canal) {
      this.realtime.canal.unsubscribe();
    }
  }

  cerrarChat() {
    this.location.back();
  }
}