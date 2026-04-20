import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { SupabaseService } from '../../../servicios/supabase.service'; 
import { UiService } from '../../services/ui'; 

Chart.register(...registerables);

@Component({
  selector: 'app-sala-espera',
  templateUrl: './sala-espera.page.html',
  styleUrls: ['./sala-espera.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SalaEsperaPage implements OnInit, OnDestroy {
  @ViewChild('graficoCanvas') canvas!: ElementRef;
  
  private channel: any;
  chart: any;
  nombreCliente: string = "Cargando..."; 

  constructor(
    private router: Router, 
    private uiService: UiService,
    private supabaseService: SupabaseService, 
    private ngZone: NgZone
  ) { }

  async ngOnInit() {
    this.nombreCliente = await this.supabaseService.getNombreUsuario();
    this.escucharAsignacion(); 
  }

  async ionViewDidEnter() {
    try {
      const datosDB = await this.supabaseService.getEstadisticasPlatos();
      
      const etiquetas = datosDB.map(item => item.categoria);
      const cantidades = datosDB.map(item => item.cantidad);

      this.inicializarGrafico(etiquetas, cantidades);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      this.inicializarGrafico(['Sin datos'], [1]);
    }
  }

  ngOnDestroy() {
    if (this.channel) {
      this.supabaseService.client.removeChannel(this.channel);
    }
  }

  /**
   * FUNCIÓN DE SIMULACIÓN (TEST):
   * Fuerza la navegación a la pantalla de escaneo de mesa.
   * Cambia el valor de 'mesa' al número que tengas en tu QR físico para evitar error de validación.
   */
  simularAsignacionMesa() {
    console.log("Simulando asignación del Metre...");
    this.ngZone.run(() => {
      this.uiService.mostrarToast('TEST: Mesa 1 asignada (Simulación)', 'success');
      this.router.navigate(['/escaneo-mesa'], { 
        queryParams: { mesa: '1', modo: 'test' } 
      });
    });
  }

  escucharAsignacion() {
    this.channel = this.supabaseService.client
      .channel('sala-espera')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'lista_espera' }, 
        (payload: any) => {
          const registro = payload.new;

          if (registro['id_mesa']) { 
            this.ngZone.run(() => {
              this.uiService.mostrarToast(`¡Mesa ${registro['id_mesa']} asignada!`, 'success');
              this.router.navigate(['/escaneo-mesa'], { 
                queryParams: { mesa: registro['id_mesa'] } 
              });
            });
          }
      })
      .subscribe();
  }

  inicializarGrafico(labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels, 
        datasets: [{
          data: data,  
          backgroundColor: [
            '#f4c430', 
            '#e67e22', 
            '#a4c639', 
            '#1d3557', 
            '#769690' 
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { 
              color: '#e6eceb',
              font: { family: 'Inter', size: 12 }
            }
          }
        }
      }
    });
  }
}