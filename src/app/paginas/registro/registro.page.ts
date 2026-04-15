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
import { AuthService } from '../../../servicios/auth.service'; 
import { Router } from '@angular/router';

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
    private navCtrl: NavController,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController 
  ) {}

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellidos: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      dni_cuil: ['', [Validators.required, Validators.pattern(/^(\d{8}|\d{11})$/)]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      perfil: ['', [Validators.required]],
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

    const response = await this.authService.register({
      nombres: formValues.nombres,
      apellidos: formValues.apellidos,
      dni_cuil: formValues.dni_cuil,
      correo_electronico: formValues.correo_electronico,
      clave: formValues.clave,
      perfil: formValues.perfil,
    });

    if (!response.ok) {
      console.error('Error detallado de Supabase:', response.error);
      const mensajeError = response.error?.message || 'Error desconocido al registrar';
      this.presentToast(`Error: ${mensajeError}` , 'danger');
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
        if (controlName === 'dni_cuil') return 'Debe tener 8 u 11 números.';
        return 'Solo se permiten letras.';
      }
    }
    return '';
  }

  irAlLogin() {
    this.navCtrl.back();
  }
}