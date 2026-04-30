// 1. Añade ViewChild a las importaciones de @angular/core
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonFab, IonFabButton, IonFabList, IonIcon, IonButton } from '@ionic/angular/standalone';
import { PerfilesTestService } from '../../servicios/perfil.service';
import { PerfilTestModel } from '../../models/perfil-test.model';
import { addIcons } from 'ionicons';
import { flash } from 'ionicons/icons';

@Component({
  selector: 'app-acceso-rapido',
  templateUrl: './acceso-rapido.component.html',
  styleUrls: ['./acceso-rapido.component.scss'],
  standalone: true,
  imports: [CommonModule, IonFab, IonFabButton, IonFabList, IonIcon, IonButton],
})
export class AccesoRapidoComponent implements OnInit {
  perfiles: PerfilTestModel[] = [];

  // 2. Captura la referencia del elemento IonFab de tu HTML
  @ViewChild(IonFab) fabMenu!: IonFab; 

  @Output() perfilSeleccionado: EventEmitter<PerfilTestModel> = new EventEmitter<PerfilTestModel>();

  constructor(
    private perfilesService: PerfilesTestService,
    private cdr: ChangeDetectorRef 
  ) {
    addIcons({ flash }); // Se registra el ícono flash solicitado
  }

  async ngOnInit() {
    try {
      const data = await this.perfilesService.getPerfiles();
      this.perfiles = data || [];
      this.cdr.detectChanges(); 
    } catch (error) {
      console.error('Error cargando perfiles:', error);
    }
  }

  seleccionar(perfil: PerfilTestModel) {
    // Emite el perfil elegido hacia el Login
    this.perfilSeleccionado.emit(perfil); 
    
    // 3. Llama al método close() para contraer el botón flotante
    if (this.fabMenu) {
      this.fabMenu.close();
    }
  }
}