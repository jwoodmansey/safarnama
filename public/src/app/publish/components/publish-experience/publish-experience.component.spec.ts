import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublishExperienceComponent } from './publish-experience.component';

describe('PublishExperienceComponent', () => {
  let component: PublishExperienceComponent;
  let fixture: ComponentFixture<PublishExperienceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
