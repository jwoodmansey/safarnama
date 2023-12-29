import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportApp } from './support-app.component';

describe('SupportApp', () => {
  let component: SupportApp;
  let fixture: ComponentFixture<SupportApp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportApp ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportApp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
