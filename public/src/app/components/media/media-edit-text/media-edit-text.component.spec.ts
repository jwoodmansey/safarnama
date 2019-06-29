import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaEditTextComponent } from './media-edit-text.component';

describe('MediaEditTextComponent', () => {
  let component: MediaEditTextComponent;
  let fixture: ComponentFixture<MediaEditTextComponent>;

  beforeEach(async(() => {
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
