import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectViewAllComponent } from './project-view-all.component';

describe('ProjectViewAllComponent', () => {
  let component: ProjectViewAllComponent;
  let fixture: ComponentFixture<ProjectViewAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectViewAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectViewAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
