import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngresoQrPage } from './ingreso-qr.page';

describe('IngresoQrPage', () => {
  let component: IngresoQrPage;
  let fixture: ComponentFixture<IngresoQrPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
