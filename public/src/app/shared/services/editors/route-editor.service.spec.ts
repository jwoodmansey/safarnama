import { TestBed } from '@angular/core/testing'

import { RouteEditorService } from './route-editor.service'

describe('RouteEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: RouteEditorService = TestBed.get(RouteEditorService)
    expect(service).toBeTruthy()
  })
})
