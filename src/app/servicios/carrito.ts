import { Injectable, signal, computed } from '@angular/core';

export interface ItemCarrito {
  producto_id: string;
  nombre: string;
  precio: number;
  tiempo_elaboracion: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // Estado global reactivo
  public items = signal<ItemCarrito[]>([]);

  // Cálculos automáticos instantáneos
  public total = computed(() => this.items().reduce((acc, item) => acc + (item.precio * item.cantidad), 0));
  public tiempoTotal = computed(() => this.items().reduce((acc, item) => acc + (item.tiempo_elaboracion * item.cantidad), 0));
  public cantidadProductos = computed(() => this.items().reduce((acc, item) => acc + item.cantidad, 0));

  agregarItem(producto: any) {
    this.items.update(lista => {
      const index = lista.findIndex(i => i.producto_id === producto.id);
      if (index > -1) {
        lista[index].cantidad++;
        return [...lista];
      } else {
        return [...lista, {
          producto_id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          tiempo_elaboracion: producto.tiempo_elaboracion,
          cantidad: 1
        }];
      }
    });
  }

  vaciarCarrito() {
    this.items.set([]);
  }
}