import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaEventosComponent } from './asistencia-eventos.component';

describe('EstudiantesComponent', () => {
  let component: AsistenciaEventosComponent;
  let fixture: ComponentFixture<AsistenciaEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciaEventosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciaEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
