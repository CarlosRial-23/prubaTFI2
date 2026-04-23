import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonContent } from '@ionic/angular';
import { Router } from '@angular/router'; // <-- Importamos Router
import { SupabaseService } from '../../../servicios/supabase.service';
import { register } from 'swiper/element/bundle';

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
  private router = inject(Router); // <-- Inyectamos el Router
  
  productos: any[] = [];
  productosFiltrados: any[] = [];
  categoriaSeleccionada: string = 'comida';
  cargando: boolean = true;

  //FALTA LÓGICA PARA VER MESA ASIGNADA
  private numeroDeMesaActual = 1; 

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    await this.cargarMenu();
  }

  // Refactorizado para usar enrutamiento en lugar de Modal
  irAlChat() {
    console.log('Navegando a la página de chat...');
    this.router.navigate(['/chat'], {
      queryParams: {
        numero_mesa: this.numeroDeMesaActual,
        esMozo: false
      }
    });
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
    console.log('Pedido:', item);
  }

  filtrar(cat: string) {
    this.categoriaSeleccionada = cat;
    this.productosFiltrados = this.productos.filter(p => p.categoria === cat);
  }
}