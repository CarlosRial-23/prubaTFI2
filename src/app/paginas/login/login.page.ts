import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Keyboard } from '@capacitor/keyboard';
import { Toast } from '@capacitor/toast';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular'; 
import { Router } from '@angular/router';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
  ],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private toastController: ToastController 
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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

  async onLogin() {
    await Keyboard.hide();
    if (this.loginForm.invalid) {
      this.presentToast('Por favor, completá los campos correctamente.', 'warning');
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      const esValido = await this.authService.login(email, password);

      if (esValido) {
        // Notificación de éxito
        this.presentToast('¡Bienvenido a Úrsula!', 'success');
        this.router.navigate(['/ingreso-qr']);
        console.log('Ingreso exitoso');
      } else {
        
        this.presentToast('Usuario o contraseña incorrectos.', 'danger');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      this.presentToast('Hubo un problema de conexión.', 'danger');
    }
  }

  irAlRegistro() {
    this.router.navigate(['/registro']);
  }
  irAltaEmpleados() {
    this.router.navigate(['/alta-empleado']);
  }
}