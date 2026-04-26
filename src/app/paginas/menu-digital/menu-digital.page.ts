import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonContent } from '@ionic/angular';
import { Router } from '@angular/router'; 
import { SupabaseService } from '../../servicios/supabase.service';
import { CarritoService } from '../../servicios/carrito'; 
import { register } from 'swiper/element/bundle';
import { addIcons } from 'ionicons';
import { timeOutline, chatbubblesSharp, cartOutline } from 'ionicons/icons';

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
  private router = inject(Router);
  
  public carritoService = inject(CarritoService); 
  
  productos: any[] = [];
  productosFiltrados: any[] = [];
  categoriaSeleccionada: string = 'comida';
  cargando: boolean = true;

  private numeroDeMesaActual = 1; 

  constructor(private supabase: SupabaseService) {
    addIcons({ timeOutline, chatbubblesSharp, cartOutline });
  }

  async ngOnInit() {
    await this.cargarMenu();
  }

  irAlChat() {
    console.log('Navegando a la página de chat...');
    this.router.navigate(['/chat'], {
      queryParams: {
        numero_mesa: this.numeroDeMesaActual,
        esMozo: false
      }
    });
  }

  irAlCarrito() {
    this.router.navigate(['/carrito-pedido']);
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
    this.carritoService.agregarItem(item);
    console.log('Agregado al carrito:', item.nombre);
  }

  filtrar(cat: string) {
    this.categoriaSeleccionada = cat;
    this.productosFiltrados = this.productos.filter(p => p.categoria === cat);
  }
}