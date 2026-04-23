import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonContent } from '@ionic/angular';
import { SupabaseService } from '../../../servicios/supabase.service';
import { register } from 'swiper/element/bundle';
import { ModalController } from '@ionic/angular';
import { Chat } from '../chat/chat';

register();

@Component({
  selector: 'app-menu-digital',
  templateUrl: './menu-digital.page.html',
  styleUrls: ['./menu-digital.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuDigitalPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  productos: any[] = [];
  productosFiltrados: any[] = [];
  categoriaSeleccionada: string = 'comida';
  cargando: boolean = true;

  constructor(
    private supabase: SupabaseService,
    private modalController: ModalController,
  ) {}

  async ngOnInit() {
    await this.cargarMenu();
  }

  //FALTA LÓGICA PARA VER MESA ASIGNADA
  private numeroDeMesaActual = 1; 

  async irAlChat() {
    const modal = await this.modalController.create({
      component: Chat,
      // Aquí le pasamos el número de mesa al @Input() del componente Chat
      componentProps: {
        numero_mesa: this.numeroDeMesaActual,
        esMozo: false // Cambia a true si este botón lo toca el mozo
      },
      cssClass: 'modal-chat-personalizado', // Opcional: por si quieres darle estilos CSS al tamaño del modal
      breakpoints: [0, 0.5, 0.8, 1], // Opcional: si quieres que sea un modal deslizable (bottom sheet)
      initialBreakpoint: 0.8
    });

    await modal.present();
  }

  async cargarMenu() {
    this.cargando = true;
    const { data } = await this.supabase.client.from('productos').select('*').eq('disponible', true);
    this.productos = data || [];
    this.filtrar('comida');
    this.cargando = false;
  }

  cambiarCategoria(event: any) {
    const cat = event.detail.value;
    this.filtrar(cat);
    this.content.scrollToTop(300);
  }

  pedirItem(item: any) {
  // Tu lógica de pedido acá
  console.log('Pedido:', item);
  }

  filtrar(cat: string) {
    this.categoriaSeleccionada = cat;
    this.productosFiltrados = this.productos.filter(p => p.categoria === cat);
  }

}