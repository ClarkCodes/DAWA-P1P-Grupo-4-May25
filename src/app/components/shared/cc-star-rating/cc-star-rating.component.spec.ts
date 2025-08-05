import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcStarRatingPrototypeComponent } from './cc-star-rating-prototype.component';

describe('CcStarRatingPrototypeComponent', () => {
  let component: CcStarRatingPrototypeComponent;
  let fixture: ComponentFixture<CcStarRatingPrototypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CcStarRatingPrototypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CcStarRatingPrototypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
