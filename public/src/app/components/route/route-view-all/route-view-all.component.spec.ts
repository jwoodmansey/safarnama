import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteViewAllComponent } from './route-view-all.component';

describe('RouteViewAllComponent', () => {
  let component: RouteViewAllComponent;
  let fixture: ComponentFixture<RouteViewAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteViewAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteViewAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
