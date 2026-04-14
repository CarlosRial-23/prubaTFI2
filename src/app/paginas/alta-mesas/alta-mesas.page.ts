import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SupabaseService } from '../../../servicios/supabase.service';
import { UiService } from '../../services/ui';

@Component({
  selector: 'app-alta-mesas',
  templateUrl: './alta-mesas.page.html',
  styleUrls: ['./alta-mesas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AltaMesasPage implements OnInit {

  nuevaMesa = {
    numero: null,
    capacidad: null,
    tipo: 'estandar',
    foto: null
  };

  errorDuplicado: boolean = false;
  mesasExistentes: number[] = [];

  constructor(private supabase: SupabaseService, private ui: UiService) { }

  async ngOnInit() {
    const { data } = await this.supabase.client.from('mesas').select('numero');
    if (data) this.mesasExistentes = data.map((m: any) => m.numero);
  }

  validarDuplicado() {
    this.errorDuplicado = this.mesasExistentes.includes(Number(this.nuevaMesa.numero));
  }

  async tomarFoto() {
    // logica de capacitor camara
  }

  async guardarMesa() {
    if (this.errorDuplicado) return;

    this.ui.mostrarToast('Generando mesa y QR...', 'success');
    
    const { error } = await this.supabase.client
      .from('mesas')
      .insert([{
        numero: this.nuevaMesa.numero,
        capacidad: this.nuevaMesa.capacidad,
        tipo: this.nuevaMesa.tipo,
        foto_url: this.nuevaMesa.foto,
        qr_data: `ursula-mesa-${this.nuevaMesa.numero}` 
      }]);

    if (!error) {
      this.ui.mostrarToast('Mesa creada correctamente', 'success');
      this.mesasExistentes.push(Number(this.nuevaMesa.numero));
      this.nuevaMesa = { numero: null, capacidad: null, tipo: 'estandar', foto: null };
    }
  }
}
