import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarEventoFacultadComponent } from './crear-editar-evento-facultad.component';

describe('CrearEditarEventoFacultadReutilizableComponent', () => {
  let component: CrearEditarEventoFacultadComponent;
  let fixture: ComponentFixture<CrearEditarEventoFacultadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarEventoFacultadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEditarEventoFacultadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
