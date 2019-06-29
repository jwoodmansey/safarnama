import { TestBed } from '@angular/core/testing'

import { PlaceTypeService } from './place-type.service'

describe('PlaceTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: PlaceTypeService = TestBed.get(PlaceTypeService)
    expect(service).toBeTruthy()
  })
})
