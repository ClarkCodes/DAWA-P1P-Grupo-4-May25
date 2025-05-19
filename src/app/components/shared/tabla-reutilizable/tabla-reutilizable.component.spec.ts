import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaReutilizableComponent } from './tabla-reutilizable.component';

describe('TablaReutilizableComponent', () => {
  let component: TablaReutilizableComponent;
  let fixture: ComponentFixture<TablaReutilizableComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaReutilizableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
