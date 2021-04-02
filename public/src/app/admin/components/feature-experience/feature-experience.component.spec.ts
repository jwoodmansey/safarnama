import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeatureExperienceComponent } from './feature-experience.component';

describe('FeatureExperienceComponent', () => {
  let component: FeatureExperienceComponent;
  let fixture: ComponentFixture<FeatureExperienceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
