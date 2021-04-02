import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MediaEditTextComponent } from './media-edit-text.component';

describe('MediaEditTextComponent', () => {
  let component: MediaEditTextComponent;
  let fixture: ComponentFixture<MediaEditTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaEditTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaEditTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
