import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaversOfWonderPrivacyAppComponent } from './privacy-app.component';

describe('WeaversOfWonderPrivacyAppComponent', () => {
  let component: WeaversOfWonderPrivacyAppComponent;
  let fixture: ComponentFixture<WeaversOfWonderPrivacyAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeaversOfWonderPrivacyAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaversOfWonderPrivacyAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
