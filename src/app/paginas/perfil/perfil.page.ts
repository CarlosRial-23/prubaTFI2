import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Importamos CommonModule para *ngIf y uppercase
import { IonicModule } from '@ionic/angular';   // <-- Importamos IonicModule para todas las etiquetas <ion-*>
import { Router } from '@angular/router';
import { SupabaseService } from '../../servicios/supabase.service';
import { AuthService } from '../../servicios/auth.service';
import { addIcons } from 'ionicons';
import { logOutOutline, mailOutline, idCardOutline, personOutline } from 'ionicons/icons';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true, 
  imports: [CommonModule, IonicModule] 
})
export class PerfilPage implements OnInit {
  usuario: any = null;
  cargando: boolean = true;

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ logOutOutline, mailOutline, idCardOutline, personOutline });
  }

  async ngOnInit() {
    await this.cargarPerfil();
  }

  async cargarPerfil() {
    this.cargando = true;
    try {
    
      const currentUser = this.authService.usuarioActual(); 
      const email = currentUser?.email;

      if (email) {
        this.usuario = await this.supabaseService.obtenerDatosUsuario(email);
      } else {
        console.warn('No hay un usuario logueado o falta el email');
      }
    } catch (error) {
      console.error('Error cargando el perfil:', error);
    } finally {
      this.cargando = false;
    }
  }

  async cerrarSesion() {
    await this.authService.logout(); 
    this.router.navigate(['/login']); 
  }
}