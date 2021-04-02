import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminViewPublishedExperiencesComponent } from './admin-view-published-experiences.component';

describe('AdminViewPublishedExperiencesComponent', () => {
  let component: AdminViewPublishedExperiencesComponent;
  let fixture: ComponentFixture<AdminViewPublishedExperiencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewPublishedExperiencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewPublishedExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
