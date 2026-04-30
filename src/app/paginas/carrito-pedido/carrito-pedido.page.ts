import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CarritoService } from '../../servicios/carrito';
import { SupabaseService } from '../../servicios/supabase.service';
import { addIcons } from 'ionicons';
import { trashOutline, arrowBackOutline, restaurantOutline, addOutline, removeOutline } from 'ionicons/icons';
import { AuthService } from '../../servicios/auth.service';

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
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private numeroDeMesa = 1; 

  constructor() {
    addIcons({ trashOutline, arrowBackOutline, restaurantOutline, addOutline, removeOutline });
  }

  volver() { this.router.navigate(['/menu-digital']); }

  eliminarItem(producto_id: string) {
    const listaActualizada = this.carritoService.items().filter(i => i.producto_id !== producto_id);
    this.carritoService.items.set(listaActualizada);
  }

  modificarCantidad(producto_id: string, delta: number) {
    const itemsActuales = this.carritoService.items();
    const index = itemsActuales.findIndex(i => i.producto_id === producto_id);

    if (index > -1) {
      const nuevaCantidad = itemsActuales[index].cantidad + delta;

      if (nuevaCantidad <= 0) {
        this.eliminarItem(producto_id);
      } else {
        const nuevaLista = [...itemsActuales];
        nuevaLista[index].cantidad = nuevaCantidad;
        this.carritoService.items.set(nuevaLista);
      }
    }
  }

  async confirmarPedido() {
  if (this.carritoService.items().length === 0) return;

  try {
    const user = this.auth.usuarioActual();

    if (!user) {
      this.mostrarToast('No hay usuario logueado', 'danger');
      return;
    }

    const { data: espera, error: errorEspera } = await this.supabase.client
      .from('lista_espera')
      .select('id_mesa')
      .eq('cliente_id', user.id)
      .single();

    if (errorEspera || !espera?.id_mesa) {
      this.mostrarToast('No tenés mesa asignada', 'danger');
      return;
    }

    const { data: pedidoData, error: pedidoError } = await this.supabase.client
      .from('pedidos')
      .insert({
        id_mesa: espera.id_mesa,          
        cliente_id: user.id,             
        total: this.carritoService.total(),
        tiempo_estimado: this.carritoService.tiempoTotal(),
        estado: 'esperando_mozo'
      })
      .select()
      .single();

    if (pedidoError) throw pedidoError;

    const detalles = this.carritoService.items().map(item => ({
      pedido_id: pedidoData.id,
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      subtotal: item.cantidad * item.precio,
      estado_item: 'pendiente'
    }));

    const { error: detalleError } = await this.supabase.client
      .from('detalle_pedido')
      .insert(detalles);

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