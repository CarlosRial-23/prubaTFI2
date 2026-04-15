import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { IonicModule, LoadingController, ToastController } from '@ionic/angular'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { SupabaseService } from '../../../servicios/supabase.service';
import { AuthService } from '../../../servicios/auth.service';
import { addIcons } from 'ionicons';
import { qrCodeOutline } from 'ionicons/icons';

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
    private toastController: ToastController // Ajustado al nombre de tu otra page
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
      this.altaForm.patchValue({
        apellidos: this.capitalizarNombres(partes[1]),
        nombres: this.capitalizarNombres(partes[2]),
        dni: partes[4]
      });
      this.presentToast('Datos del DNI cargados correctamente', 'success');
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

    // 2. ACTIVAMOS EL ESTADO DE CARGA
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
        dni_cuil: formValues.cuil, 
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

    } catch (error: any) {
      console.error('Error al guardar:', error);
      this.presentToast('Error al guardar: ' + (error.message || 'Intente nuevamente'), 'danger');
    } finally {
      // 3. APAGAMOS EL ESTADO DE CARGA PASE LO QUE PASE
      this.cargando = false; 
    }
  }

  private capitalizarNombres(texto: string): string {
    return texto.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  // --- NUEVA LÓGICA DE MANEJO DE ERRORES Y TOASTS ---

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