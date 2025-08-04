import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarPerfilInfoDialogComponent } from './actualizar-perfil-info-dialog.component';

describe('ActualizarPerfilInfoDialogComponent', () => {
  let component: ActualizarPerfilInfoDialogComponent;
  let fixture: ComponentFixture<ActualizarPerfilInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarPerfilInfoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarPerfilInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
