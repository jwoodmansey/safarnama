import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminViewUsersComponent } from './admin-view-users.component';

describe('AdminViewUsersComponent', () => {
  let component: AdminViewUsersComponent;
  let fixture: ComponentFixture<AdminViewUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
