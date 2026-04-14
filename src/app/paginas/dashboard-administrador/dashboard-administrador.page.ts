import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular'; 

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-administrador.page.html',
  styleUrls: ['./dashboard-administrador.page.scss'],
  standalone: true, 
  imports: [
    IonicModule,  
    CommonModule   
  ]
})
export class DashboardAdminPage implements OnInit {

  // Ejemplo de numeor de clientes para ver en la pantalla, 
  // pero se deberia sacar de la base de datos
  pendientesClientes: number = 5;

  constructor() { }

  ngOnInit() {
    // despues agregar la logica aca para supabase 
  }

}