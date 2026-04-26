import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular'; 
import { AuthService } from '../../servicios/auth.service'; 
import { Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class RegistroPage implements OnInit {
  registroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router,
    private navCtrl: NavController 
  ) {
    this.registroForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]], 
      cuil: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]], 
      correo_electronico: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      perfil: ['cliente', [Validators.required]],
    });
  }

  ngOnInit() {}

  async obtenerTokenFCM(): Promise<string> {
  return new Promise((resolve, reject) => {

    PushNotifications.removeAllListeners(); // 🔥 IMPORTANTE

    PushNotifications.requestPermissions().then((permStatus) => {

      if (permStatus.receive !== 'granted') {
        reject('Permiso denegado');
        return;
      }

      PushNotifications.addListener('registration', (token) => {
        console.log('TOKEN FCM:', token.value);
        resolve(token.value);
      });

      PushNotifications.addListener('registrationError', (err) => {
        reject(err);
      });

      PushNotifications.register();

    }).catch(reject);

  });
}

  

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: `mi-toast-${color}`, 
    });
    await toast.present();
  }

  

  async onRegister() {
    if (this.registroForm.invalid) {
      this.presentToast('Por favor, revise los campos marcados en rojo.', 'warning');
      this.registroForm.markAllAsTouched();
      return;
    }

    const formValues = this.registroForm.value;

    let fcmToken: string | undefined = undefined;

    // 🔥 OBTENER TOKEN ANTES DE REGISTRAR
    try {
      fcmToken = await this.obtenerTokenFCM();
    } catch (e) {
      console.warn('No se pudo obtener el token FCM');
    }

    const response = await this.authService.register({
      nombres: formValues.nombres,
      apellidos: formValues.apellidos,
      dni: formValues.dni,
      cuil: formValues.cuil, 
      correo_electronico: formValues.correo_electronico,
      clave: formValues.clave,
      perfil: formValues.perfil,
      fcm_token: fcmToken //
    });

    if (!response.ok) {
      const mensajeError = response.error?.message || 'Error desconocido al registrar';
      this.presentToast(`Error: ${mensajeError}`, 'danger');
      return;
    }

    await this.presentToast('Usuario registrado correctamente', 'success');
    this.router.navigate(['/login']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.registroForm.get(controlName);
    if (control && control.invalid && (control.touched || control.dirty)) {
      if (control.hasError('required')) return 'Este campo es obligatorio.';
      if (control.hasError('minlength')) return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres.`;
      if (control.hasError('email')) return 'Formato de correo inválido.';
      if (control.hasError('pattern')) {
        if (controlName === 'dni') return 'Debe tener 7 u 8 números.';
        if (controlName === 'cuil') return 'Debe tener 11 números sin guiones.';
        return 'Solo se permiten letras.';
      }
    }
    return '';
  }

  irAlLogin() {
    this.navCtrl.back();
  }

  
}