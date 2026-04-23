import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { IonicModule, LoadingController, ToastController } from '@ionic/angular'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { SupabaseService } from '../../../servicios/supabase.service';
import { AuthService } from '../../../servicios/auth.service';
import { addIcons } from 'ionicons';
import { qrCodeOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
  standalone: true, 
  imports: [CommonModule, IonicModule, ReactiveFormsModule] 
})
export class AltaEmpleadoPage implements OnInit {
  altaForm: FormGroup;
  archivoSeleccionado: File | null = null; 
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController, // Ajustado al nombre de tu otra page
    private router: Router,
  ) {
    addIcons({ qrCodeOutline }); 

    this.altaForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      cuil: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      perfil: ['', [Validators.required]],
      foto: ['', [Validators.required]] 
    });
  }

  ngOnInit() {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  async escanearDNI() {
    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted' && camera !== 'limited') {
         this.presentToast('Permiso de cámara denegado para escanear', 'warning');
         return;
      }

      const { barcodes } = await BarcodeScanner.scan();
      
      if (barcodes.length > 0) {
        const qrData = barcodes[0].rawValue;
        if (qrData) {
          this.procesarDatosDNI(qrData);
        } else {
          this.presentToast('El código QR está vacío', 'warning');
        }
      }
    } catch (error) {
      console.error('Error al escanear QR', error);
      this.presentToast('No se pudo escanear el DNI.', 'danger');
    }
  }

  private procesarDatosDNI(qrData: string) {
    const partes = qrData.split('@');
    
    if (partes.length >= 7) {
      const apellidosScanner = this.capitalizarNombres(partes[1]);
      const nombresScanner = this.capitalizarNombres(partes[2]);
      const sexoScanner = partes[3]; // Extraemos 'M' o 'F'
      const dniScanner = partes[4];
      const cuilCalculado = this.calcularCUIL(parseInt(dniScanner, 10), sexoScanner);

      this.altaForm.patchValue({
        apellidos: apellidosScanner,
        nombres: nombresScanner,
        dni: dniScanner,
        cuil: cuilCalculado 
      });
      
      this.presentToast('Datos del DNI y CUIL cargados correctamente', 'success');
    } else {
      this.presentToast('Formato de código no reconocido', 'warning');
    }
  }

  async guardarEmpleado() {
    if (this.altaForm.invalid) {
      this.presentToast('Por favor, revise los campos marcados en rojo.', 'warning');
      this.altaForm.markAllAsTouched();
      return; 
    }

    if (!this.archivoSeleccionado) {
      this.presentToast('Debes adjuntar la foto del empleado.', 'warning');
      return; 
    }

    this.cargando = true; 

    try {
      const formValues = this.altaForm.value;

      const extension = this.archivoSeleccionado.name.split('.').pop();
      const fileName = `${Date.now()}_empleado.${extension}`;
      const filePath = `perfiles/${fileName}`;
      
      const { error: uploadError } = await this.supabaseService.uploadFile('fotos', filePath, this.archivoSeleccionado);
      
      if (uploadError) throw uploadError;

      const urlFoto = await this.supabaseService.getPublicUrl('fotos', filePath);

      const res = await this.authService.register({
        nombres: formValues.nombres,
        apellidos: formValues.apellidos,
        dni: formValues.dni,     // <-- Pasamos el DNI del formulario
        cuil: formValues.cuil,   // <-- Pasamos el CUIL del formulario
        correo_electronico: formValues.correo_electronico,
        clave: formValues.clave,
        perfil: formValues.perfil,
        foto: urlFoto 
      });

      if (!res.ok) {
        await this.supabaseService.removeFile('fotos', filePath);
        throw new Error(res.error?.message || 'Error en el registro');
      }

      this.presentToast('Empleado registrado con éxito.', 'success');
      this.altaForm.reset();
      this.archivoSeleccionado = null;
      this.router.navigate(['/login']);

    } catch (error: any) {
      console.error('Error al guardar:', error);
      this.presentToast('Error al guardar: ' + (error.message || 'Intente nuevamente'), 'danger');
    } finally {

      this.cargando = false; 
    }
  }

  private capitalizarNombres(texto: string): string {
    return texto.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  private calcularCUIL(dni: number, sexo: string): string {
    let xy = sexo === 'M' ? 20 : 27;

    const dniStr = dni.toString().padStart(8, '0');
    let base = xy.toString() + dniStr;

    const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    
    for (let i = 0; i < multiplicadores.length; i++) {
      suma += parseInt(base[i]) * multiplicadores[i];
    }

    const resto = suma % 11;
    let z: number;

    if (resto === 0) {
      z = 0;
    } else if (resto === 1) {
      xy = 23;
      z = sexo === 'M' ? 9 : 4;
    } else {
      z = 11 - resto;
    }

    return `${xy}${dniStr}${z}`;
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

  getErrorMessage(controlName: string): string {
    const control = this.altaForm.get(controlName);
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
}