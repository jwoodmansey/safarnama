import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ExperienceEditComponent } from './experience-edit.component'

describe('ExperienceEditComponent', () => {
  let component: ExperienceEditComponent
  let fixture: ComponentFixture<ExperienceEditComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExperienceEditComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
