import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { SupabaseService } from '../../../servicios/supabase.service';
import { UiService } from '../../services/ui';

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
      .from('perfiles')
      .select('*')
      .eq('aprobado', false);
    
    if (data) this.clientes = data;
  }

  async aprobar(cliente: any) {
    const { error } = await this.supabase.client
      .from('perfiles')
      .update({ aprobado: true })
      .eq('id', cliente.id);

    if (!error) {
      this.ui.mostrarToast(`${cliente.nombre} ha sido aprobado`, 'success');
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
      .from('perfiles')
      .delete()
      .eq('id', cliente.id);

    if (!error) {
      this.ui.mostrarToast('Cliente rechazado correctamente', 'warning');
      this.clientes = this.clientes.filter(c => c.id !== cliente.id);
    }
  }
}
