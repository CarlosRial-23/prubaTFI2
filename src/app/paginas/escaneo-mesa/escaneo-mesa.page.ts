import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { SupabaseService } from '../../../servicios/supabase.service';

@Component({
  selector: 'app-escaneo-mesa',
  templateUrl: './escaneo-mesa.page.html',
  styleUrls: ['./escaneo-mesa.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class EscaneoMesaPage implements OnInit {
  mesaAsignadaId: string = '';
  nro_mesa: string = '...';
  usuarioId: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private toastController: ToastController,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    const mesaParam = this.route.snapshot.queryParamMap.get('mesa');
    if (mesaParam) {
      this.nro_mesa = mesaParam;
    }
    await this.cargarDatosAsignacion();
  }

  async cargarDatosAsignacion() {
    const { data: { user } } = await this.supabase.client.auth.getUser();
    if (user) {
      this.usuarioId = user.id;
      
      const { data } = await this.supabase.client
        .from('perfiles')
        .select(`
          mesa_asignada_id, 
          mesas (numero)
        `)
        .eq('id', user.id)
        .single();
      
      if (data) {
        this.mesaAsignadaId = String(data.mesa_asignada_id || '');
        const mesasInfo: any = data.mesas;
        this.nro_mesa = Array.isArray(mesasInfo) 
          ? String(mesasInfo[0]?.numero) 
          : String(mesasInfo?.numero);
      }
    }
  }

  async iniciarEscaneo() {
    const status = await BarcodeScanner.requestPermissions();
    if (status.camera !== 'granted') {
      this.mostrarMensaje('Permiso de cámara denegado', 'danger');
      return;
    }
    document.querySelector('body')?.classList.add('barcode-scanner-active');

    try {
      const { barcodes } = await BarcodeScanner.scan();
      if (barcodes.length > 0) {
        this.validarMesa(barcodes[0].displayValue);
      }
    } catch (err) {
      console.error(err);
    } finally {
      document.querySelector('body')?.classList.remove('barcode-scanner-active');
    }
  }

  async validarMesa(idEscaneado: string) {
    const asignadaId = String(this.mesaAsignadaId).trim().toLowerCase();
    const asignadaNro = String(this.nro_mesa).trim().toLowerCase();
    const leido = String(idEscaneado).trim().toLowerCase();

    console.log(`Comparando LEIDO[${leido}] contra ID[${asignadaId}] o NRO[${asignadaNro}]`);

    if (leido === asignadaId || leido === asignadaNro || leido.includes(asignadaNro)) {
      
      await Haptics.notification({ type: NotificationType.Success });
      
      await this.supabase.client
        .from('perfiles')
        .update({ estado: 'sentado' })
        .eq('id', this.usuarioId);

      this.mostrarMensaje('¡Mesa validada! Bienvenido.', 'success');
      
      this.ngZone.run(() => {
        this.router.navigate(['/menu-digital']);
      });

    } else {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      this.mostrarMensaje(
        `Mesa incorrecta. Tu mesa es la ${this.nro_mesa} (Escaneaste: ${leido})`, 
        'danger'
      );
    }
  }

  async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}