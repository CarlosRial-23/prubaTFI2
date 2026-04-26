import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CarritoService } from '../../servicios/carrito';
import { SupabaseService } from '../../servicios/supabase.service';
import { addIcons } from 'ionicons';
import { trashOutline, arrowBackOutline, restaurantOutline } from 'ionicons/icons';

@Component({
  selector: 'app-carrito-pedido',
  templateUrl: './carrito-pedido.page.html',
  styleUrls: ['./carrito-pedido.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CarritoPedidoPage {
  public carritoService = inject(CarritoService);
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private numeroDeMesa = 1; 

  constructor() {
    addIcons({ trashOutline, arrowBackOutline, restaurantOutline });
  }

  volver() { this.router.navigate(['/menu-digital']); }

  eliminarItem(producto_id: string) {
    const listaActualizada = this.carritoService.items().filter(i => i.producto_id !== producto_id);
    this.carritoService.items.set(listaActualizada);
  }

  async confirmarPedido() {
    if (this.carritoService.items().length === 0) return;

    try {
      const { data: pedidoData, error: pedidoError } = await this.supabase.client
        .from('pedidos')
        .insert({
          id_mesa: this.numeroDeMesa,
          total: this.carritoService.total(),
          tiempo_estimado: this.carritoService.tiempoTotal(),
          estado: 'esperando_mozo'
        }).select().single();

      if (pedidoError) throw pedidoError;

      const detalles = this.carritoService.items().map(item => ({
        pedido_id: pedidoData.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        subtotal: item.cantidad * item.precio,
        estado_item: 'pendiente'
      }));

      const { error: detalleError } = await this.supabase.client.from('detalle_pedido').insert(detalles);
      if (detalleError) throw detalleError;

      this.carritoService.vaciarCarrito();
      this.mostrarToast('Pedido enviado a la cocina', 'success');
      this.router.navigate(['/sala-espera']); 

    } catch (error) {
      console.error('Error:', error);
      this.mostrarToast('Error al enviar el pedido', 'danger');
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({ message: mensaje, duration: 2500, color: color });
    toast.present();
  }
}