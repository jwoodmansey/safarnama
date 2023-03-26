import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportExperienceDialogComponent } from './export-experience-dialog.component';

describe('ExportExperienceDialogComponent', () => {
  let component: ExportExperienceDialogComponent;
  let fixture: ComponentFixture<ExportExperienceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportExperienceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportExperienceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
