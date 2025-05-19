import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudFacultadesComponent } from './crud-facultades.component';

describe('CrudFacultadesComponent', () => {
  let component: CrudFacultadesComponent;
  let fixture: ComponentFixture<CrudFacultadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudFacultadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudFacultadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
