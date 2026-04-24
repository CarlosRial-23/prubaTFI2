import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import Mensaje from '../interfaces/mensaje';
import { Realtime } from '../../../servicios/realtime';
import { AuthService } from '../../../servicios/auth.service';
import { SupabaseService } from '../../../servicios/supabase.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, DatePipe],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class Chat implements OnInit, OnDestroy {
  numero_mesa!: number;
  esMozo: boolean = false;

  realtime = inject(Realtime);
  protected authService = inject(AuthService);
  private supabase = inject(SupabaseService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  mensajes = signal<Mensaje[]>([]);
  usuarioActual: string = '';
  msj = '';
  
  private suscripcionChat: any;

  async ngOnInit() {
    try {
      this.route.queryParams.subscribe(params => {
        this.numero_mesa = Number(params['numero_mesa']) || 0;
        this.esMozo = params['esMozo'] === 'true' || params['esMozo'] === true;
      });

      const usuarioAuth = await this.authService.getUsuario();
      
      if (usuarioAuth) {
        const { data, error } = await this.supabase.client
          .from('usuarios')
          .select('apellidos, nombres') 
          .eq('id', usuarioAuth.id)
          .single();

        if (error) {
          console.error('Error al consultar tabla usuarios:', error.message);
        }

        if (data) {
          // --- NUEVA LÓGICA DE CONCATENACIÓN ---
          // Limpiamos los espacios extra por si acaso y los unimos
          const nombresStr = data.nombres ? data.nombres.trim() : '';
          const apellidoStr = data.apellidos ? data.apellidos.trim() : '';
          
          const nombresCompleto = `${nombresStr} ${apellidoStr}`.trim();

          // Asignamos el nombres completo. Si está vacío, usamos el email.
          this.usuarioActual = nombresCompleto || usuarioAuth.email?.split('@')[0] || 'Usuario';
          // -------------------------------------
        } else {
          this.usuarioActual = usuarioAuth.email?.split('@')[0] || 'Cliente';
        }
      } else {
        this.usuarioActual = 'Invitado';
      }

    } catch (error) {
      console.error('Error al inicializar chat:', error);
      this.usuarioActual = 'Error';
    }

    const mensajesIniciales = await this.realtime.traerPorMesa(this.numero_mesa);
    this.mensajes.set(mensajesIniciales);

    this.suscripcionChat = this.supabase.client.channel('chat_mesa_' + this.numero_mesa);
    
    this.suscripcionChat
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat' }, (payload: any) => {
        const nuevoMensaje = payload.new as Mensaje;
        if (nuevoMensaje.numero_mesa === this.numero_mesa) {
          this.mensajes.update((msgs) => [...msgs, nuevoMensaje]);
        }
      })
      .subscribe();
  }

  async enviarMensaje() {
    if (!this.msj.trim()) return;
    try {
      await this.realtime.crear(this.msj, this.usuarioActual, this.numero_mesa);
      this.msj = '';
    } catch (error) {
      console.error('Error al enviar:', error);
    }
  }

  ngOnDestroy() {
    if (this.suscripcionChat) {
      this.supabase.client.removeChannel(this.suscripcionChat);
    }
  }

  cerrarChat() {
    this.location.back();
  }
}