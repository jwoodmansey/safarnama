import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectViewPublishedExperienceComponent } from './project-view-published-experience.component';

describe('ProjectViewPublishedExperienceComponent', () => {
  let component: ProjectViewPublishedExperienceComponent;
  let fixture: ComponentFixture<ProjectViewPublishedExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectViewPublishedExperienceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectViewPublishedExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
