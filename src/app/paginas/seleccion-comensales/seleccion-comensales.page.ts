import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../servicios/supabase.service';
import { AuthService } from '../../../servicios/auth.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-seleccion-comensales',
  templateUrl: './seleccion-comensales.page.html',
  styleUrls: ['./seleccion-comensales.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton
  ]
})
export class SeleccionComensalesPage {
  cantidad = 0;

  constructor(
    private supabase: SupabaseService,
    private auth: AuthService,
    private router: Router
  ) {}

  seleccionar(n: number) {
    this.cantidad = n;
    Haptics.impact({ style: ImpactStyle.Light });
  }

  onInputExtra(ev: any) {
    const val = parseInt(ev.detail.value);
    this.cantidad = val > 0 ? val : 0;
  }

  async confirmar() {
    const user = this.auth.usuarioActual() as any; 
    
    if (!user) {
      console.error("SRE Error: No hay sesión activa.");
      return;
    }

    try {
      const { data: usuarioData } = await this.supabase.client
        .from('usuarios')
        .select('nombres')
        .eq('id', user.id)
        .single();

      const nombreFinal = usuarioData?.nombres || user.email;

      const { error } = await this.supabase.client
        .from('lista_espera')
        .insert({
          cliente_id: user.id,
          nombre_cliente: nombreFinal,
          cantidad_comensales: this.cantidad,
          estado_espera: 'esperando_mesa'
        });

      if (!error) {
        await Haptics.impact({ style: ImpactStyle.Medium });
        this.router.navigate(['/sala-espera']);
      } else {
        console.error("SRE Error Supabase:", error.message);
      }
    } catch (err) {
      console.error("Error crítico en el flujo:", err);
    }
  }
}