import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { SupabaseService } from '../../../servicios/supabase.service';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class AltaEmpleadoPage implements OnInit {
  altaForm: FormGroup;
  archivoSeleccionado: File | null = null; // Guardará el objeto File físico

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.altaForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      cuil: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      perfil: ['', [Validators.required]],
      foto: ['', [Validators.required]] // Controlamos que el input no esté vacío
    });
  }

  ngOnInit() {}

  // Este es el método que invoca el (change) del HTML
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  // 3. ESCANEAR DNI (QR)
  async escanearDNI() {
    try {
      // Pedir permisos si es necesario
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted' && camera !== 'limited') {
         this.mostrarMensaje('Permiso de cámara denegado para escanear');
         return;
      }

      const { barcodes } = await BarcodeScanner.scan();
      
      if (barcodes.length > 0) {
        const qrData = barcodes[0].rawValue;
        this.procesarDatosDNI(qrData);
      }
    } catch (error) {
      console.error('Error al escanear QR', error);
      this.mostrarMensaje('No se pudo escanear el DNI.');
    }
  }

  // Procesar el string del DNI Argentino (separado por @)
  private procesarDatosDNI(qrData: string) {
    // Formato típico DNI PDF417/QR: Tramite@Apellidos@Nombres@Sexo@DNI@Ejemplar@FechaNac@FechaEmision
    const partes = qrData.split('@');
    
    if (partes.length >= 7) {
      this.altaForm.patchValue({
        apellidos: this.capitalizarNombres(partes[1]),
        nombres: this.capitalizarNombres(partes[2]),
        dni: partes[4]
      });
      this.mostrarMensaje('Datos del DNI cargados correctamente');
    } else {
      this.mostrarMensaje('Formato de código no reconocido');
    }
  }

  // 4. GUARDAR EMPLEADO
  async guardarEmpleado() {
    if (this.altaForm.invalid) {
      this.altaForm.markAllAsTouched();
      this.mostrarMensaje('Por favor, completa todos los campos correctamente.');
      return;
    }

    if (!this.archivoSeleccionado) {
      this.mostrarMensaje('Debes adjuntar la foto del empleado.');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Guardando empleado...' });
    await loading.present();

    try {
      const formValues = this.altaForm.value;

      // 1. Crear el usuario en Auth
      const authData = await this.supabaseService.crearUsuarioAuth(
        formValues.correo_electronico, 
        formValues.clave
      );

      if (!authData.user) throw new Error('No se pudo crear el usuario en Auth.');

      // 2. Subir la imagen usando tus nuevos métodos
      // Armamos un nombre de archivo único usando el ID del usuario y el nombre original
      const filePath = `perfiles/${authData.user.id}_${this.archivoSeleccionado.name}`;
      
      const { error: uploadError } = await this.supabaseService.uploadFile('fotos', filePath, this.archivoSeleccionado);
      if (uploadError) throw uploadError;

      // 3. Obtener la URL pública de la foto recién subida
      const urlFoto = await this.supabaseService.getPublicUrl('fotos', filePath);

      // 4. Insertar en la tabla pública "usuarios"
      await this.supabaseService.insertarPerfilUsuario({
        id: authData.user.id,
        nombres: formValues.nombres,
        apellidos: formValues.apellidos,
        dni_cuil: formValues.cuil,
        correo_electronico: formValues.correo_electronico,
        perfil: formValues.perfil
        // Aquí podrías guardar la variable urlFoto si agregas el campo a tu base de datos
      });

      this.mostrarMensaje('Empleado registrado con éxito.');
      this.altaForm.reset();
      this.archivoSeleccionado = null;

    } catch (error: any) {
      console.error(error);
      this.mostrarMensaje('Error al guardar: ' + error.message);
    } finally {
      loading.dismiss();
    }
  }

  private async mostrarMensaje(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}