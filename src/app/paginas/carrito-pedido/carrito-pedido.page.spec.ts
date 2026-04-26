import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoPedidoPage } from './carrito-pedido.page';

describe('CarritoPedidoPage', () => {
  let component: CarritoPedidoPage;
  let fixture: ComponentFixture<CarritoPedidoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarritoPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
