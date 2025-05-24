import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogReutilizableComponent } from './confirm-dialog-reutilizable.component';

describe('ConfirmDialogReutilizableComponent', () => {
  let component: ConfirmDialogReutilizableComponent;
  let fixture: ComponentFixture<ConfirmDialogReutilizableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogReutilizableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogReutilizableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
