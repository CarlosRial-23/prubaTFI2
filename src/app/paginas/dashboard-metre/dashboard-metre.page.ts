import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SupabaseService } from '../../../servicios/supabase.service';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { addIcons } from 'ionicons';
import { trashOutline, logOutOutline, peopleSharp, gridSharp, hourglassOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard-metre',
  templateUrl: './dashboard-metre.page.html',
  styleUrls: ['./dashboard-metre.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DashboardMetrePage implements OnInit {
  clientesEnEspera: any[] = [];
  mesas: any[] = [];
  clienteSeleccionado: any = null;
  mesaSeleccionada: any = null;

  confirmacionVisible = false;
  confirmacion = { tipo: '', titulo: '', mensaje: '', accion: async () => {} };

  constructor(private supabase: SupabaseService) {
    addIcons({ trashOutline, logOutOutline, peopleSharp, gridSharp, hourglassOutline });
  }

  async ngOnInit() { await this.cargarDatos(); }

  async cargarDatos() {
    const { data: lista } = await this.supabase.client
      .from('lista_espera')
      .select('*')
      .is('id_mesa', null);
    this.clientesEnEspera = lista || [];

    const { data: m } = await this.supabase.client
      .from('mesas')
      .select('*')
      .order('nro_mesa', { ascending: true });
    this.mesas = m || [];
  }

  seleccionarCliente(cliente: any) {
    if (this.clienteSeleccionado?.cliente_id === cliente.cliente_id) {
      this.clienteSeleccionado = null;
      this.mesaSeleccionada = null;
      return;
    }
    this.clienteSeleccionado = cliente;
    if (this.mesaSeleccionada && this.mesaSeleccionada.capacidad < cliente.cantidad_comensales) {
      this.mesaSeleccionada = null;
    }
    Haptics.impact({ style: ImpactStyle.Light });
  }

  seleccionarMesa(mesa: any) {
    if (!this.clienteSeleccionado) return;
    if (mesa.estado !== 'libre') return;
    if (mesa.capacidad < this.clienteSeleccionado.cantidad_comensales) return;

    if (this.mesaSeleccionada?.nro_mesa === mesa.nro_mesa) {
      this.mesaSeleccionada = null;
      return;
    }
    this.mesaSeleccionada = mesa;
    Haptics.impact({ style: ImpactStyle.Light });
  }

  pedirConfirmacion(ev: Event, tipo: 'cliente' | 'mesa', item: any) {
    ev.stopPropagation();
    Haptics.impact({ style: ImpactStyle.Medium });

    if (tipo === 'cliente') {
      this.confirmacion = {
        tipo,
        titulo: '¿ELIMINAR CLIENTE?',
        mensaje: `Se quitará a ${item.nombre_cliente} de la lista de espera.`,
        accion: async () => {
          await this.supabase.client
            .from('lista_espera')
            .delete()
            .eq('cliente_id', item.cliente_id);
          if (this.clienteSeleccionado?.cliente_id === item.cliente_id) {
            this.clienteSeleccionado = null;
            this.mesaSeleccionada = null;
          }
          await this.cargarDatos();
        }
      };
    } else {
      this.confirmacion = {
        tipo,
        titulo: '¿LIBERAR MESA?',
        mensaje: `La Mesa ${item.nro_mesa} volverá a estar disponible.`,
        accion: async () => {
          await this.supabase.client
            .from('mesas')
            .update({ estado: 'libre' })
            .eq('nro_mesa', item.nro_mesa);
          await Haptics.notification({ type: NotificationType.Success });
          await this.cargarDatos();
        }
      };
    }

    this.confirmacionVisible = true;
  }

  cancelarConfirmacion() {
    this.confirmacionVisible = false;
    Haptics.impact({ style: ImpactStyle.Light });
  }

  async ejecutarConfirmacion() {
    await this.confirmacion.accion();
    this.confirmacionVisible = false;
  }

  async confirmarAsignacion() {
    if (!this.clienteSeleccionado || !this.mesaSeleccionada) return;

    await this.supabase.client
      .from('mesas')
      .update({ estado: 'ocupada' })
      .eq('nro_mesa', this.mesaSeleccionada.nro_mesa);

    await this.supabase.client
      .from('lista_espera')
      .update({ id_mesa: this.mesaSeleccionada.nro_mesa, estado_espera: 'asignado' })
      .eq('cliente_id', this.clienteSeleccionado.cliente_id);

    await Haptics.notification({ type: NotificationType.Success });

    this.clienteSeleccionado = null;
    this.mesaSeleccionada = null;
    await this.cargarDatos();
  }
}