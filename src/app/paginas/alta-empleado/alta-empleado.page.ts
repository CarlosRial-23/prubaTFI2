import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { IonicModule, LoadingController, ToastController } from '@ionic/angular'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // Importado para la foto
import { Haptics, ImpactStyle } from '@capacitor/haptics'; // Importado para feedback
import { SupabaseService } from '../../servicios/supabase.service';
import { AuthService } from '../../servicios/auth.service';
import { addIcons } from 'ionicons';
import { qrCodeOutline, cameraOutline } from 'ionicons/icons'; // Añadido cameraOutline
import { Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
  standalone: true, 
  imports: [CommonModule, IonicModule, ReactiveFormsModule] 
})
export class AltaEmpleadoPage implements OnInit {
  altaForm: FormGroup;
  fotoPersonal: string | null = null; // Cambio a string para manejar DataUrl de la cámara
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router,
  ) {
    addIcons({ qrCodeOutline, cameraOutline }); 

    this.altaForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      cuil: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      perfil: ['', [Validators.required]],
      foto: ['', [Validators.required]] // Se mantiene para validación lógica
    });
  }

  ngOnInit() {}

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera 
      });
      this.fotoPersonal = image.dataUrl || null;
      this.altaForm.patchValue({ foto: this.fotoPersonal }); // Valida el campo foto en el form
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) { 
      console.log("Cámara cancelada"); 
    }
  }

  async escanearDNI() {
    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted' && camera !== 'limited') {
         this.presentToast('Permiso de cámara denegado', 'warning');
         return;
      }

      const { barcodes } = await BarcodeScanner.scan();
      
      if (barcodes.length > 0) {
        const qrData = barcodes[0].rawValue;
        if (qrData) {
          this.procesarDatosDNI(qrData);
        }
      }
    } catch (error) {
      this.presentToast('No se pudo escanear el DNI.', 'danger');
    }
  }

  private procesarDatosDNI(qrData: string) {
    const partes = qrData.split('@');
    if (partes.length >= 7) {
      const apellidosScanner = this.capitalizarNombres(partes[1]);
      const nombresScanner = this.capitalizarNombres(partes[2]);
      const sexoScanner = partes[3];
      const dniScanner = partes[4];
      const cuilCalculado = this.calcularCUIL(parseInt(dniScanner, 10), sexoScanner);

      this.altaForm.patchValue({
        apellidos: apellidosScanner,
        nombres: nombresScanner,
        dni: dniScanner,
        cuil: cuilCalculado 
      });
      this.presentToast('Datos cargados correctamente', 'success');
    }
  }

  async guardarEmpleado() {
    if (this.altaForm.invalid || !this.fotoPersonal) {
      this.presentToast('Por favor, revise los campos y la foto.', 'warning');
      this.altaForm.markAllAsTouched();
      return; 
    }

    this.cargando = true; 

    try {
      const formValues = this.altaForm.value;
      const fileName = `${Date.now()}_empleado.jpeg`;
      const filePath = `perfiles/${fileName}`;
      
      // Conversión de la captura de cámara a archivo para Supabase
      const respuesta = await fetch(this.fotoPersonal);
      const blob = await respuesta.blob();
      const archivoSubir = new File([blob], fileName, { type: 'image/jpeg' });

      const { error: uploadError } = await this.supabaseService.uploadFile('fotos', filePath, archivoSubir);
      if (uploadError) throw uploadError;

      const urlFoto = await this.supabaseService.getPublicUrl('fotos', filePath);

      const res = await this.authService.register({
        ...formValues,
        foto: urlFoto 
      });

      if (!res.ok) {
        await this.supabaseService.removeFile('fotos', filePath);
        throw new Error(res.error?.message || 'Error en el registro');
      }

      this.presentToast('Empleado registrado con éxito.', 'success');
      this.router.navigate(['/login']);

    } catch (error: any) {
      this.presentToast('Error al guardar: ' + (error.message || 'Intente nuevamente'), 'danger');
    } finally {
      this.cargando = false; 
    }
  }

  // Métodos auxiliares se mantienen igual
  private capitalizarNombres(texto: string): string {
    return texto.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  private calcularCUIL(dni: number, sexo: string): string {
    let xy = sexo === 'M' ? 20 : 27;
    const dniStr = dni.toString().padStart(8, '0');
    let base = xy.toString() + dniStr;
    const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    for (let i = 0; i < multiplicadores.length; i++) suma += parseInt(base[i]) * multiplicadores[i];
    const resto = suma % 11;
    let z = resto === 0 ? 0 : (resto === 1 ? (sexo === 'M' ? 9 : 4) : 11 - resto);
    if (resto === 1) xy = 23;
    return `${xy}${dniStr}${z}`;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message, duration: 2000, color, position: 'top', cssClass: 'ursula-toast'
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
        if (controlName === 'dni') return '7 u 8 números.';
        if (controlName === 'cuil') return '11 números.';
        return 'Solo letras.';
      }
    }
    return '';
  }
}