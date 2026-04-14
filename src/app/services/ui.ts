import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(private toastController: ToastController) { }

  async mostrarToast(mensaje: string, tipo: 'success' | 'danger' | 'warning' | 'info' = 'info') {
    const iconos = {
      success: 'checkmark-circle',
      danger:  'close-circle',
      warning: 'warning',
      info:    'information-circle'
    };

    setTimeout(async () => {
      const toast = await this.toastController.create({
        message: mensaje,
        icon: iconos[tipo],
        duration: 4000,
        position: 'bottom',
        cssClass: `ursula-custom-toast toast-${tipo}`,
        mode: 'ios', 
        buttons: [{ text: 'X', role: 'cancel' }]
      });
      await toast.present();
    }, 200);
  }
}