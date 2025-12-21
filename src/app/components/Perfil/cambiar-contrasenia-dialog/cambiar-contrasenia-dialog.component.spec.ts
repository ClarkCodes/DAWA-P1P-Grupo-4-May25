import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarContraseniaDialogComponent } from './cambiar-contrasenia-dialog.component';

describe('CambiarContraseniaDialogComponent', () => {
  let component: CambiarContraseniaDialogComponent;
  let fixture: ComponentFixture<CambiarContraseniaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambiarContraseniaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarContraseniaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
