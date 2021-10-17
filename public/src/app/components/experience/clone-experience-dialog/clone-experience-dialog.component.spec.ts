import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneExperienceDialogComponent } from './clone-experience-dialog.component';

describe('CloneExperienceDialogComponent', () => {
  let component: CloneExperienceDialogComponent;
  let fixture: ComponentFixture<CloneExperienceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneExperienceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneExperienceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
