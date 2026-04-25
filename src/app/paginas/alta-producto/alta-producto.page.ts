import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Necesario para el routerLink del botón de volver
import { AuthService } from '../../../servicios/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import { ToastController, IonContent, IonIcon, IonSpinner, IonActionSheet } from '@ionic/angular/standalone';
import { SupabaseService } from '../../../servicios/supabase.service';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.page.html',
  styleUrls: ['./alta-producto.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule,
    IonContent, 
    IonIcon, 
    IonSpinner, 
    IonActionSheet // <-- Ahora Angular sí sabe qué es un ActionSheet
  ]
})
export class AltaProductoPage implements OnInit {

  productoForm: FormGroup;
  productosExistentes: string[] = [];
  fotosPreview: (string | null)[] = [null, null, null];
  cargando: boolean = false;

  // --- VARIABLES PARA EL ACTION SHEET DECLARATIVO ---
  isActionSheetOpen = false;
  fotoIndexActual = 0;
  
  actionSheetButtons = [
    {
      text: 'CÁMARA',
      handler: () => {
        this.abrirCamara(this.fotoIndexActual, CameraSource.Camera);
      }
    },
    {
      text: 'GALERÍA',
      handler: () => {
        this.abrirCamara(this.fotoIndexActual, CameraSource.Photos);
      }
    },
    {
      text: 'CANCELAR',
      role: 'cancel'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ cameraOutline });

    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tiempo_elaboracion: ['', [Validators.required, Validators.min(0)]],
      precio: ['', [Validators.required, Validators.min(1)]],
      foto1: [null, Validators.required],
      foto2: [null, Validators.required],
      foto3: [null, Validators.required]
    });
  }

  async ngOnInit() {
    const { data } = await this.supabaseService.client.from('productos').select('nombre');
    if (data) {
      this.productosExistentes = data.map((p: any) => p.nombre.toLowerCase().trim());
      this.productoForm.get('nombre')?.addValidators(this.validarDuplicado.bind(this));
      this.productoForm.get('nombre')?.updateValueAndValidity();
    }
  }

  validarDuplicado(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const nombreIngresado = control.value.toLowerCase().trim();
    if (this.productosExistentes.includes(nombreIngresado)) {
      return { duplicado: true };
    }
    return null;
  }

 tomarFoto(index: number) {
    this.fotoIndexActual = index;
    this.isActionSheetOpen = true; 
  }

  onActionSheetDismiss() {
    this.isActionSheetOpen = false; // Se llama al cerrar o cancelar
  }

  async abrirCamara(index: number, source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, 
        source: source // Cámara o Galería según el botón tocado
      });

      if (image && image.webPath) {
        this.fotosPreview[index] = image.webPath; 
        
        // Convertimos a Blob
        const response = await fetch(image.webPath);
        const blob = await response.blob();

        // Guardamos en el form
        const controlName = `foto${index + 1}`;
        this.productoForm.patchValue({ [controlName]: blob });
        this.productoForm.get(controlName)?.updateValueAndValidity();
        
        this.cdr.detectChanges(); // Forzar actualización visual
      }
    } catch (error) {
      console.warn('Selección cancelada');
    }
  }

  async guardarProducto() {
    if (this.productoForm.invalid) {
      this.presentToast('Por favor, complete correctamente todos los campos y fotos.', 'warning');
      this.productoForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.presentToast('Subiendo fotos y creando producto...', 'success');
    
    const formValues = this.productoForm.value;
    const urlsFotos: string[] = [];
    const timestamp = Date.now();
    const nombreNormalizado = formValues.nombre.replace(/\s+/g, '_').toLowerCase();
    const perfil = this.authService.usuarioActual()?.user_metadata?.["perfil"];
    let categoriaPerfil = "";
    
    try {
      // Subir las 3 fotos iterando
      for (let i = 1; i <= 3; i++) {
        const blob = formValues[`foto${i}`];
        const fileName = `producto_${nombreNormalizado}_${timestamp}_${i}.jpeg`;
        
        const { error: uploadError } = await this.supabaseService.uploadFile('productos', fileName, blob);
        if (uploadError) throw uploadError;

        const fotoUrl = await this.supabaseService.getPublicUrl('productos', fileName);
        urlsFotos.push(fotoUrl);
      }

      if(perfil === "cocinero") categoriaPerfil = "comida";
      if(perfil === "cantinero") categoriaPerfil = "bebida";

      // Insertar en la BD
      const { error: dbError } = await this.supabaseService.client
        .from('productos')
        .insert([{
          nombre: formValues.nombre.trim(),
          descripcion: formValues.descripcion.trim(),
          precio: Number(formValues.precio),
          tiempo_elaboracion: Number(formValues.tiempo_elaboracion),
          categoria: categoriaPerfil,
          fotos: urlsFotos, 
          disponible: true
        }]);

      if (dbError) throw dbError;

      this.presentToast('Producto guardado exitosamente', 'success');
      
      this.productosExistentes.push(formValues.nombre.toLowerCase().trim());
      this.resetearFormulario();

    } catch (error: any) {
      console.error('Error al guardar:', error);
      this.presentToast('Error al guardar producto: ' + (error.message || 'Intente nuevamente'), 'danger');
    } finally {
      this.cargando = false;
    }
  }

  resetearFormulario() {
    this.productoForm.reset();
    this.fotosPreview = [null, null, null];
    this.cdr.detectChanges();
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
}