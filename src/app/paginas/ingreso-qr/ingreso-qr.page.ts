import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { UiService } from '../../services/ui';
import { SupabaseService } from '../../../servicios/supabase.service'; 

@Component({
  selector: 'app-ingreso-qr',
  templateUrl: './ingreso-qr.page.html',
  styleUrls: ['./ingreso-qr.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IngresoQrPage implements OnInit {
  estadoEscaneo: string = 'Listo para escanear';

  constructor(
    private uiService: UiService,
    private router: Router,
    private ngZone: NgZone,
    private supabaseService: SupabaseService 
  ) { } 

  ngOnInit() { }

  async iniciarProcesoEscaneo() {
    try {
      const status = await BarcodeScanner.requestPermissions();
      
      if (status.camera === 'granted') {
        const { barcodes } = await BarcodeScanner.scan();

        if (barcodes.length > 0 && barcodes[0].displayValue === 'INGRESO') {
          this.estadoEscaneo = '¡Ingreso detectado!';
          
          this.ngZone.run(async () => {
            this.uiService.mostrarToast('Registrando ingreso...', 'success');
            
            try {
              await this.supabaseService.registrarIngreso(); 
              this.router.navigate(['/sala-espera']);
            } catch (dbError) {
              console.error('Error de base de datos:', dbError);
              this.uiService.mostrarToast('Error al conectar con Supabase', 'danger');
              this.estadoEscaneo = 'Listo para escanear';
            }
          });
        }
      }
    } catch (error) {
      this.uiService.mostrarToast('Error en el escáner', 'danger');
    }
  }
}