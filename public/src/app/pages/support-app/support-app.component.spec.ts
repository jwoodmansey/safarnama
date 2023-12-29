import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportAppComponent } from './support-app.component';

describe('SupportAppComponent', () => {
  let component: SupportAppComponent;
  let fixture: ComponentFixture<SupportAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
