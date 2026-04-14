import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.page.html',
  styleUrls: ['presentacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PresentacionPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.reproducirSonidoInicio();

    setTimeout(() => {
      this.router.navigateByUrl('/ingreso', { replaceUrl: true });
    }, 5000); // son 5 segundos
  }

  reproducirSonidoInicio() {
    const audio = new Audio('assets/sonidos/inicio.mp3');
    audio.volume = 0.5;
    audio.play().catch(error => console.log('Esperando interacción para reproducir sonido:', error));
  }
}