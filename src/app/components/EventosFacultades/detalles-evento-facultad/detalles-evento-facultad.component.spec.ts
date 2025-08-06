import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesEventoFacultadComponent } from './detalles-evento-facultad.component';

describe('DetallesEventoFacultadReutilizableComponent', () => {
  let component: DetallesEventoFacultadComponent;
  let fixture: ComponentFixture<DetallesEventoFacultadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesEventoFacultadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesEventoFacultadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
