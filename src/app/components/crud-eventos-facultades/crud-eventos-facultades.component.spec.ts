import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudEventosFacultadesComponent } from './crud-eventos-facultades.component';

describe('CrudEventosFacultadesComponent', () => {
  let component: CrudEventosFacultadesComponent;
  let fixture: ComponentFixture<CrudEventosFacultadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudEventosFacultadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudEventosFacultadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
