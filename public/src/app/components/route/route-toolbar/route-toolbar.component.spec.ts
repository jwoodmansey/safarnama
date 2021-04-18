import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteToolbarComponent } from './route-toolbar.component';

describe('RouteToolbarComponent', () => {
  let component: RouteToolbarComponent;
  let fixture: ComponentFixture<RouteToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
