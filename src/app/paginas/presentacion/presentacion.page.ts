import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.page.html',
  styleUrls: ['./presentacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class PresentacionPage implements OnInit {

  // Inyectamos NavController para poder movernos entre pantallas
  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    setTimeout(() => {
      this.navCtrl.navigateRoot('/login');

    }, 3000); 
  }
}
