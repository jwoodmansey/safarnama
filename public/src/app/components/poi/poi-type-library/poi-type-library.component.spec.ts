import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PoiTypeLibraryComponent } from './poi-type-library.component'

describe('PoiTypeLibraryComponent', () => {
  let component: PoiTypeLibraryComponent
  let fixture: ComponentFixture<PoiTypeLibraryComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PoiTypeLibraryComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PoiTypeLibraryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
