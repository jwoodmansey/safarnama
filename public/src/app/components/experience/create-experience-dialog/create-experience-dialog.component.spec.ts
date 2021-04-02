import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CreateExperienceDialogComponent } from './create-experience-dialog.component'

describe('CreateExperienceDialogComponent', () => {
  let component: CreateExperienceDialogComponent
  let fixture: ComponentFixture<CreateExperienceDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreateExperienceDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExperienceDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
