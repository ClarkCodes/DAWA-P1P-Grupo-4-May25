import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudAdminPanelComponent } from './crud-admin-panel.component';

describe('CrudSigninLoginComponent', () => {
  let component: CrudAdminPanelComponent;
  let fixture: ComponentFixture<CrudAdminPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudAdminPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
