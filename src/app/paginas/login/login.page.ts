import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../servicios/auth.service';
import { 
  IonContent, IonFab, IonFabButton, IonFabList, IonIcon, ToastController, 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  eyeOutline, eyeOffOutline, flash
} from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    IonContent, IonFab, IonFabButton, IonFabList, IonIcon
  ],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    addIcons({ 
      eyeOutline, eyeOffOutline, flash
    });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword() { this.showPassword = !this.showPassword; }

  async accesoDirectoMetre() {
    console.log("SRE Bypass: Navegando al Dashboard Metre...");
    await Haptics.impact({ style: ImpactStyle.Medium });
    this.router.navigate(['/dashboard-metre']);
  }
  
  async fillUser(perfil: string) {
    const creds: any = {
      'dueño': { email: 'duenio@duenio.com', pass: '111111' },
      'supervisor': { email: 'supervisor@supervisor.com', pass: '444444' },
      'metre': { email: 'metre1@metre.com', pass: '333333' },
      'mozo': { email: 'mozo@mozo.com', pass: '222222' },
      'cocinero': { email: 'cocinero@cocinero.com', pass: '555555' },
      'cantinero': { email: 'cantinero@cantinero.com', pass: '666666' },
      'cliente': { email: 'cliente@cliente.com', pass: '999999' },
    };

    if (creds[perfil]) {
      this.loginForm.patchValue({ 
        email: creds[perfil].email, 
        password: creds[perfil].pass 
      });
      
      this.loginForm.markAllAsTouched(); 
      await Haptics.impact({ style: ImpactStyle.Light });
      this.presentToast(`Perfil ${perfil.toUpperCase()} cargado`, 'success');

    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.hasError('required')) return 'Este campo es obligatorio';
      if (control.hasError('email')) return 'Formato de correo inválido';
      if (control.hasError('minlength')) return 'Debe tener al menos 6 caracteres';
    }
    return '';
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top',
      cssClass: 'ursula-custom-toast toast-' + color 
    });
    await toast.present();
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); 
      this.presentToast('Por favor, verifique los campos ingresados', 'warning'); 
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
    // 1. Intentamos el login
    const ok = await this.authService.login(email, password);

    if (ok) {
      // 2. Obtenemos el perfil de los metadatos del usuario actual
      const perfil = this.authService.usuarioActual()?.user_metadata['perfil'];
      
      // 3. Mostramos el Toast con el perfil
      this.presentToast(`Bienvenido! Perfil: ${perfil?.toUpperCase() || 'No definido'}`, 'success');

      switch (perfil) {
        case 'metre':
          this.router.navigate(['/dashboard-metre']);
          break;

        case 'cocinero':
          this.router.navigate(['/alta-producto']);
          break;
        case 'cantinero':
          this.router.navigate(['/alta-producto']);
          break;

        default:
          this.router.navigate(['/ingreso-qr']);
          break;
      }
      
    } else {
      this.presentToast('Correo o contraseña incorrectos', 'danger');
    }
  } catch (e) {
    this.presentToast('Error de conexión con el servidor', 'danger');
  }
  }

  irAlRegistro() { this.router.navigate(['/registro']); }
  
  irAltaEmpleados() {
    this.router.navigate(['/alta-empleado']);
  }
  irAltaCliente() {
    this.router.navigate(['/alta-cliente']);
  }
}