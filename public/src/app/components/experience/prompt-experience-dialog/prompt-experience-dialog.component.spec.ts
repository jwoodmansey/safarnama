import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PromptExperienceDialogComponent } from './prompt-experience-dialog.component'

describe('PromptExperienceDialogComponent', () => {
  let component: PromptExperienceDialogComponent
  let fixture: ComponentFixture<PromptExperienceDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PromptExperienceDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptExperienceDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
