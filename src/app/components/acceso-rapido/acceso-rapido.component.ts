import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/angular/standalone';
import { PerfilesTestService } from '../../servicios/perfil.service';
import { PerfilTestModel } from '../../models/perfil-test.model';
import { addIcons } from 'ionicons';
// Se importan todos los íconos necesarios para los diferentes roles
import { 
  flash, 
  keyOutline, 
  briefcaseOutline, 
  shieldCheckmarkOutline, 
  restaurantOutline, 
  fastFoodOutline, 
  wineOutline, 
  personOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-acceso-rapido',
  templateUrl: './acceso-rapido.component.html',
  standalone: true,
  imports: [CommonModule, IonFab, IonFabButton, IonFabList, IonIcon],
})
export class AccesoRapidoComponent implements OnInit {

  perfiles: PerfilTestModel[] = [];

  // 👇 Emite el perfil elegido hacia el Login padre
  @Output() perfilSeleccionado = new EventEmitter<PerfilTestModel>();

  constructor(private perfilesService: PerfilesTestService) {
    // Se registran los íconos para que Ionic pueda utilizarlos cuando se llamen desde el HTML
    addIcons({ 
      flash,
      keyOutline,
      briefcaseOutline,
      shieldCheckmarkOutline,
      restaurantOutline,
      fastFoodOutline,
      wineOutline,
      personOutline
    });
  }

  async ngOnInit() {
    this.perfiles = await this.perfilesService.getPerfiles();
  }

  seleccionar(perfil: PerfilTestModel) {
    this.perfilSeleccionado.emit(perfil);
  }
}