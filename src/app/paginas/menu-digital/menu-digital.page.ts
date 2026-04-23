import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, Injector, inject } from '@angular/core';
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
  private injector = inject(Injector);
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
    console.log('1. Botón de chat presionado correctamente.');

    try {
      const modal = await this.modalController.create({
        component: Chat,
        // PASAMOS EL INJECTOR AQUÍ (Soluciona el congelamiento del modal)
        injector: this.injector, 
        
        componentProps: {
          numero_mesa: this.numeroDeMesaActual,
          esMozo: false
        },
        cssClass: 'modal-chat-personalizado',
        breakpoints: [0, 0.5, 0.8, 1],
        initialBreakpoint: 0.8
      });

      console.log('2. Modal creado, intentando mostrar...');
      await modal.present();
      console.log('3. Modal mostrado con éxito.');

    } catch (error) {
      console.error('🚨 ERROR AL ABRIR EL MODAL:', error);
    }
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