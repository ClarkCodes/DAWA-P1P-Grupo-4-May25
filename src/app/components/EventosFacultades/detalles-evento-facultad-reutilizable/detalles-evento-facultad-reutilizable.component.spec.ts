import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesEventoFacultadReutilizableComponent } from './detalles-evento-facultad-reutilizable.component';

describe('DetallesEventoFacultadReutilizableComponent', () => {
  let component: DetallesEventoFacultadReutilizableComponent;
  let fixture: ComponentFixture<DetallesEventoFacultadReutilizableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesEventoFacultadReutilizableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesEventoFacultadReutilizableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
