import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PoiViewAllComponent } from './poi-view-all.component'

describe('PoiViewAllComponent', () => {
  let component: PoiViewAllComponent
  let fixture: ComponentFixture<PoiViewAllComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PoiViewAllComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PoiViewAllComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
