import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { OpenExperienceDialogComponent } from './open-experience-dialog.component'

describe('OpenExperienceDialogComponent', () => {
  let component: OpenExperienceDialogComponent
  let fixture: ComponentFixture<OpenExperienceDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OpenExperienceDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenExperienceDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
