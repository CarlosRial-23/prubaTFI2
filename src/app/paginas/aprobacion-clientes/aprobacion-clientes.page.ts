import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { SupabaseService } from '../../servicios/supabase.service';
import { UiService } from '../../services/ui';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-aprobacion-clientes',
  templateUrl: './aprobacion-clientes.page.html',
  styleUrls: ['./aprobacion-clientes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AprobacionClientesPage implements OnInit {
  clientes: any[] = [];

  constructor(
    private supabase: SupabaseService,
    private ui: UiService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.cargarClientesPendientes();
  }

  async cargarClientesPendientes() {
  const { data, error } = await this.supabase.client
    .from('usuarios')
    .select('*')
    .eq('estado', 'pendiente');

  console.log('DATA:', data);
  console.log('ERROR:', error);

  if (data) this.clientes = data;
}
  async aprobar(cliente: any) {
  const { error } = await this.supabase.client
    .from('usuarios')
    .update({ estado: 'aprobado' })
    .eq('id', cliente.id);

  if (!error) {

    // 🔥 EMAIL (ya lo tenías)
    await this.enviarEmail(
      cliente.correo_electronico,
      cliente.nombres,
      'aprobado'
    );

    // 🔥 PUSH (NUEVO)
    if (cliente.fcm_token) {
      await this.enviarPush(cliente.fcm_token, cliente.nombres);
    }

    this.ui.mostrarToast(`${cliente.nombres} aprobado`, 'success');
    this.clientes = this.clientes.filter(c => c.id !== cliente.id);
  }
}

  async confirmarRechazo(cliente: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Rechazo',
      message: `¿Estás seguro de rechazar a ${cliente.nombre}? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Rechazar', 
          role: 'destructive',
          handler: () => this.rechazar(cliente)
        }
      ]
    });
    await alert.present();
  }

  async rechazar(cliente: any) {
  const { error } = await this.supabase.client
    .from('usuarios')
    .update({ estado: 'rechazado' })
    .eq('id', cliente.id);

  if (!error) {

    await this.enviarEmail(
      cliente.correo_electronico,   // 🔥 CORRECTO
      cliente.nombres,              // 🔥 CORRECTO
      'rechazado'
    );

    this.ui.mostrarToast('Cliente rechazado correctamente', 'warning');
    this.clientes = this.clientes.filter(c => c.id !== cliente.id);
  }
}

  async enviarEmail(emailDestino: string, nombre: string, estado: string) {

  const esAprobado = estado === 'aprobado';

  try {
    await emailjs.send(
      'service_ak7ndqs',
      'template_nidyqhs',
      {
        nombre: nombre,
        estado: esAprobado ? 'Cuenta aprobada' : 'Cuenta rechazada',
        mensaje: esAprobado
          ? 'Tu cuenta fue aprobada. Ya puedes ingresar a la aplicación.'
          : 'Tu solicitud fue rechazada. No puedes acceder a la app.',
        color: esAprobado ? 'green' : 'red',
        email: emailDestino
      },
      'DRsDVRJ7hpSJWJfvD'
    );

  } catch (error) {
    console.error('Error email:', error);
  }
}

async enviarPush(token: string, nombre: string) {
  try {
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=TU_SERVER_KEY_AQUI'
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title: 'Cuenta aprobada',
          body: `Hola ${nombre}, tu cuenta fue aprobada`
        }
      })
    });

    console.log('Push enviada');

  } catch (error) {
    console.error('Error push:', error);
  }
}
}