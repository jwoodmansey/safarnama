import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectViewUserComponent } from './project-view-user.component';

describe('ProjectViewUserComponent', () => {
  let component: ProjectViewUserComponent;
  let fixture: ComponentFixture<ProjectViewUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectViewUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectViewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
