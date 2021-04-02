import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DownloadExperienceComponent } from './download-experience.component';

describe('DownloadExperienceComponent', () => {
  let component: DownloadExperienceComponent;
  let fixture: ComponentFixture<DownloadExperienceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
