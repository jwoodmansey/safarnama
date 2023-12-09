import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyAppComponent } from './privacy-app.component';

describe('PrivacyAppComponent', () => {
  let component: PrivacyAppComponent;
  let fixture: ComponentFixture<PrivacyAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
