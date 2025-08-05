import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudComentariosComponent } from './crud-comentarios.component';

describe('ComentariosComponent', () => {
  let component: CrudComentariosComponent;
  let fixture: ComponentFixture<CrudComentariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudComentariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudComentariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
