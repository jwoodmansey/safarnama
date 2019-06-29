import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PoiCreateComponent } from './poi-create.component'

describe('PoiCreateComponent', () => {
  let component: PoiCreateComponent
  let fixture: ComponentFixture<PoiCreateComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoiCreateComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PoiCreateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
