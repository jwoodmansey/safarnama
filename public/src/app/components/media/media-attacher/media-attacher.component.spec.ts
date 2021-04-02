import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MediaAttacherComponent } from './media-attacher.component';

describe('MediaAttacherComponent', () => {
  let component: MediaAttacherComponent;
  let fixture: ComponentFixture<MediaAttacherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaAttacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaAttacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
