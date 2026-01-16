import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCompraVentaComponent } from './reporte-compra-venta-component';

describe('ReporteCompraVentaComponent', () => {
  let component: ReporteCompraVentaComponent;
  let fixture: ComponentFixture<ReporteCompraVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteCompraVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCompraVentaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
