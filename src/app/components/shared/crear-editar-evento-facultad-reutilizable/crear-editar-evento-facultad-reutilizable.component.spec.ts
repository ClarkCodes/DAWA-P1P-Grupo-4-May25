import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarEventoFacultadReutilizableComponent } from './crear-editar-evento-facultad-reutilizable.component';

describe('CrearEditarEventoFacultadReutilizableComponent', () => {
  let component: CrearEditarEventoFacultadReutilizableComponent;
  let fixture: ComponentFixture<CrearEditarEventoFacultadReutilizableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarEventoFacultadReutilizableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEditarEventoFacultadReutilizableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
