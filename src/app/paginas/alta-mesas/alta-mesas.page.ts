import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { QRCodeComponent } from 'angularx-qrcode';

// Tus servicios homologados
import { SupabaseService } from '../../../servicios/supabase.service';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-alta-mesas',
  templateUrl: './alta-mesas.page.html',
  styleUrls: ['./alta-mesas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, QRCodeComponent]
})
export class AltaMesasPage implements OnInit {

  mesaForm: FormGroup;
  mesasExistentes: number[] = [];
  qrGenerado: string | null = null;
  fotoPreview: string | null = null;
  cargando: boolean = false; // Indicador de carga para la UI

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {
    this.mesaForm = this.fb.group({
      numero: ['', [Validators.required, Validators.min(1)]],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      tipo: ['', [Validators.required]],
      foto: [null, [Validators.required]] // Aquí guardaremos el Blob directamente
    });
  }

  async ngOnInit() {
    // Cargar mesas para evitar duplicados en tiempo real
    const { data } = await this.supabaseService.client.from('mesas').select('nro_mesa');
    if (data) {
      this.mesasExistentes = data.map((m: any) => m.nro_mesa);
      this.mesaForm.get('numero')?.addValidators(this.validarDuplicado.bind(this));
      this.mesaForm.get('numero')?.updateValueAndValidity();
    }
  }

  validarDuplicado(control: AbstractControl): ValidationErrors | null {
    const numero = Number(control.value);
    if (this.mesasExistentes.includes(numero)) {
      return { duplicado: true };
    }
    return null;
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, 
        source: CameraSource.Camera
      });

      if (image && image.webPath) {
        this.fotoPreview = image.webPath; 
        
        // Convertimos la ruta local nativa a un archivo binario (Blob)
        const response = await fetch(image.webPath);
        const blob = await response.blob();

        // Guardamos el Blob directamente en el formulario
        this.mesaForm.patchValue({ foto: blob });
        this.mesaForm.get('foto')?.updateValueAndValidity();
        this.cdr.detectChanges(); // Forzar actualización visual para encender el botón
      }
    } catch (error) {
      this.presentToast('Captura de foto cancelada', 'warning');
    }
  }

  async guardarMesa() {
    if (this.mesaForm.invalid) {
      this.presentToast('Por favor, revise los campos marcados en rojo.', 'warning');
      this.mesaForm.markAllAsTouched();
      return;
    }

    this.cargando = true; // Iniciamos la carga
    this.presentToast('Subiendo foto y generando mesa...', 'success');
    
    const formValues = this.mesaForm.value;
    const numeroMesa = Number(formValues.numero);
    const qrDataStr = JSON.stringify({ 
      tipo: 'mesa', 
      numero: numeroMesa,
      capacidad: Number(formValues.capacidad),
      tipo_mesa: formValues.tipo
    });

    try {
      const blob = formValues.foto;
      const fileName = `mesa_${numeroMesa}_${Date.now()}.jpeg`;
      
      // 2. Subir al Storage usando el método centralizado de tu servicio
      const { error: uploadError } = await this.supabaseService.uploadFile('mesas', fileName, blob);
      if (uploadError) throw uploadError;

      // 3. Obtener URL pública de la imagen
      const fotoFinalUrl = await this.supabaseService.getPublicUrl('mesas', fileName);

      // 4. Insertar la nueva mesa en la base de datos
      const { error: dbError } = await this.supabaseService.client
        .from('mesas')
        .insert([{
          nro_mesa: numeroMesa,
          capacidad: Number(formValues.capacidad),
          tipo: formValues.tipo,
          foto: fotoFinalUrl, 
          codigo_qr: qrDataStr
        }]);

      if (dbError) {
        // Limpiar archivo si falló la base de datos (requiere tener removeFile en el servicio)
        if (this.supabaseService.removeFile) {
          await this.supabaseService.removeFile('mesas', fileName); 
        }
        throw dbError;
      }

      // Éxito Total
      this.presentToast('Mesa asignada al salón exitosamente', 'success');
      this.qrGenerado = qrDataStr; 
      this.mesasExistentes.push(numeroMesa); // Actualizar control de duplicados
      
      // Reiniciar estado
      this.mesaForm.reset();
      this.fotoPreview = null;
      this.cdr.detectChanges();

    } catch (error: any) {
      console.error('Error al guardar:', error);
      this.presentToast('Error al guardar: ' + (error.message || 'Intente nuevamente'), 'danger');
    } finally {
      this.cargando = false; // Finalizamos la carga sin importar si hubo error o éxito
    }
  }

  // --- Funciones UI Auxiliares ---

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
    const control = this.mesaForm.get(controlName);
    if (control && control.invalid && (control.touched || control.dirty)) {
      if (control.hasError('required')) return 'Este campo es obligatorio.';
      if (control.hasError('min')) return 'El valor debe ser mayor a 0.';
      if (control.hasError('duplicado')) return 'Este número ya existe en el salón.';
    }
    return '';
  }
}