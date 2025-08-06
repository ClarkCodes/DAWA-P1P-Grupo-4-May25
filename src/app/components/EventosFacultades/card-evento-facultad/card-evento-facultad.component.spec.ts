import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardEventoFacultadComponent } from './card-evento-facultad.component';

describe('CardReutilizableComponent', () => {
  let component: CardEventoFacultadComponent;
  let fixture: ComponentFixture<CardEventoFacultadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEventoFacultadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEventoFacultadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
