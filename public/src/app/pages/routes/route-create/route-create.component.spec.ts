import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { RouteCreateComponent } from './route-create.component'

describe('RouteCreateComponent', () => {
  let component: RouteCreateComponent
  let fixture: ComponentFixture<RouteCreateComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RouteCreateComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteCreateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
