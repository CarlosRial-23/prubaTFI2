import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardAdministradorPage } from './dashboard-administrador.page';

describe('DashboardAdministradorPage', () => {
  let component: DashboardAdministradorPage;
  let fixture: ComponentFixture<DashboardAdministradorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAdministradorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
