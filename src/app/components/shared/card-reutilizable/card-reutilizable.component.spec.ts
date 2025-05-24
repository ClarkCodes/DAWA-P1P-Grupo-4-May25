import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardReutilizableComponent } from './card-reutilizable.component';

describe('CardReutilizableComponent', () => {
  let component: CardReutilizableComponent;
  let fixture: ComponentFixture<CardReutilizableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardReutilizableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardReutilizableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
