import { Component, OnInit, inject} from '@angular/core';
import { SupabaseService } from '../../../servicios/supabase.service'; // Asegura esta ruta
import { AuthService } from '../../../servicios/auth.service'; // Asegura esta ruta
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { qrCodeOutline, cameraOutline } from 'ionicons/icons';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AltaClientePage implements OnInit {
  clienteForm!: FormGroup;
  fotoPersonal: string | null = null;
  cargando: boolean = false;
  
  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
  ) {
    addIcons({ qrCodeOutline, cameraOutline }); 
  }

  ngOnInit() {
    this.clienteForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)]],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      perfil: ['cliente', [Validators.required]]
    });
  }

  // Método de mensajes de error idéntico a alta-empleado
  getErrorMessage(controlName: string): string {
    const control = this.clienteForm.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.hasError('required')) return 'Este campo es obligatorio';
      if (control.hasError('email')) return 'Formato de correo inválido';
      if (control.hasError('pattern')) {
        if (controlName === 'dni') return 'DNI debe tener 7 u 8 números';
        return 'Formato no permitido';
      }
      if (control.hasError('minlength')) return 'Mínimo 6 caracteres';
    }
    return '';
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera 
      });
      this.fotoPersonal = image.dataUrl || null;
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) { console.log("Cámara cancelada"); }
  }

  async escanearDNI() {
    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted') {
        this.presentToast('Se requieren permisos de cámara', 'danger');
        return;
      }

      const { barcodes } = await BarcodeScanner.scan({
        formats: [BarcodeFormat.Pdf417]
      });

      if (barcodes.length > 0) {
        const contenido = barcodes[0].displayValue;
        const datos = contenido.split('@');
        
        if (datos.length > 4) {
          // Aplicamos la función de capitalización a los datos escaneados
          const apellidosFormateados = this.capitalizarPalabras(datos[1]);
          const nombresFormateados = this.capitalizarPalabras(datos[2]);

          this.clienteForm.patchValue({
            apellidos: apellidosFormateados,
            nombres: nombresFormateados,
            dni: datos[4].trim() // Mantenemos el trim() para evitar espacios en el DNI
          });
          
          this.clienteForm.markAllAsTouched();
          this.presentToast('Datos de DNI cargados', 'success');
        }
      }
    } catch (error) {
      this.presentToast('Error al escanear el código', 'danger');
    }
  }

  private capitalizarPalabras(texto: string): string {
    if (!texto) return '';
    // Primero pasa todo a minúsculas, luego busca la primera letra de cada palabra y la hace mayúscula
    return texto.trim().toLowerCase().replace(/\b\w/g, (letra) => letra.toUpperCase());
  }

  async guardarCliente() {
    // 1. Validaciones idénticas a tu código de empleado
    if (this.clienteForm.invalid) {
      this.presentToast('Por favor, revise los campos marcados en rojo.', 'warning');
      this.clienteForm.markAllAsTouched();
      return; 
    }

    if (!this.fotoPersonal) { // Usamos la variable de la cámara en vez de archivoSeleccionado
      this.presentToast('Debes capturar la foto del cliente.', 'warning');
      return; 
    }

    this.cargando = true; // Usamos tu indicador de carga

    try {
      const formValues = this.clienteForm.value;

      // 2. Nombramos el archivo (forzamos .jpeg porque viene de la cámara)
      const fileName = `${Date.now()}_cliente.jpeg`;
      const filePath = `perfiles/${fileName}`;
      
      // 3. Convertimos la foto de la cámara a un objeto File para que uploadFile lo acepte
      const respuesta = await fetch(this.fotoPersonal);
      const blob = await respuesta.blob();
      const archivoSubir = new File([blob], fileName, { type: 'image/jpeg' });

      // 4. Subimos a Supabase usando tu servicio
      const { error: uploadError } = await this.supabaseService.uploadFile('fotos', filePath, archivoSubir);
      
      if (uploadError) throw uploadError;

      const urlFoto = await this.supabaseService.getPublicUrl('fotos', filePath);
      const dniString = formValues.dni.toString().padStart(8, '0');
      const cuilGenerado = `23${dniString}9`;

      // 5. Registramos al usuario
      const res = await this.authService.register({
        nombres: formValues.nombres,
        apellidos: formValues.apellidos,
        dni: formValues.dni,
        cuil: cuilGenerado, // El cliente no carga CUIL, enviamos el DNI para rellenar la tabla
        correo_electronico: formValues.correo,
        clave: formValues.clave,
        perfil: "cliente",
        foto: urlFoto 
      });

      // 6. Rollback: Si la base de datos falla, borramos la foto del bucket
      if (!res.ok) {
        await this.supabaseService.removeFile('fotos', filePath);
        throw new Error(res.error?.message || 'Error en el registro');
      }

      this.presentToast('Cliente registrado con éxito.', 'success');
      this.clienteForm.reset({ perfil: 'cliente' });
      this.fotoPersonal = null;
      this.router.navigate(['/login']);

    } catch (error: any) {
      console.error('Error al guardar:', error);
      this.presentToast('Error al guardar: ' + (error.message || 'Intente nuevamente'), 'danger');
    } finally {
      this.cargando = false; 
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message, duration: 2000, color, position: 'top', cssClass: 'ursula-toast'
    });
    await toast.present();
  }
}