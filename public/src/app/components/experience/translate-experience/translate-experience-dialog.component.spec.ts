import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateExperienceDialogComponent } from './translate-experience-dialog.component';

describe('TranslateExperienceDialogComponent', () => {
  let component: TranslateExperienceDialogComponent;
  let fixture: ComponentFixture<TranslateExperienceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslateExperienceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateExperienceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
