import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaEventosComponent } from './pagina-eventos.component';

describe('PaginaEventosComponent', () => {
  let component: PaginaEventosComponent;
  let fixture: ComponentFixture<PaginaEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaEventosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
