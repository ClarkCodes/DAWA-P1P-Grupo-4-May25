import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaReutilizableComponent } from './tabla-reutilizable.component';

describe('TablaReutilizableComponent', () => {
  let component: TablaReutilizableComponent;
  let fixture: ComponentFixture<TablaReutilizableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaReutilizableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaReutilizableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
