import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewPublishedExperiencesComponent } from './admin-view-published-experiences.component';

describe('AdminViewPublishedExperiencesComponent', () => {
  let component: AdminViewPublishedExperiencesComponent;
  let fixture: ComponentFixture<AdminViewPublishedExperiencesComponent>;

  beforeEach(async(() => {
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
