import { Directive, AfterContentInit, Output, EventEmitter } from '@angular/core'
import { AgmPolyline } from '@agm/core/directives/polyline'
import { PolylineManager } from '@agm/core/services/managers/polyline-manager'
import { LatLngLiteral } from '@agm/core/map-types'

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'agm-polyline-editable',
})
export class AgmPolylineEditableDirective extends AgmPolyline implements AfterContentInit {

  @Output() pointsChanged: EventEmitter<LatLngLiteral[]> =
     new EventEmitter<LatLngLiteral[]>()

  constructor(polylineManager: PolylineManager) {
    super(polylineManager)
  }

  public ngAfterContentInit(): void {
    this.initEventListners()
    super.ngAfterContentInit()
  }

  private initEventListners(): void {
    // tslint:disable-next-line:no-this-assignment
    const self: any = this

    const checkForPathsChange = () => {
      self.polylineManager._polylines
        .get(self)
        .then(result => {
          const points = this.convertToLatLngLiteral(result.getPath().getArray())
          let arePathsChanged: boolean = false
          if (self.paths.length !== points.length) {
            self.points = points
            arePathsChanged = true
          } else if (JSON.stringify(this.points) !== JSON.stringify(points)) {
            self.points = points
            arePathsChanged = true
          }
          if (arePathsChanged) {
            self.polyPathsChange.emit(points)
          }
        })
    }

    self._polylineManager
      .createEventObservable('mouseup', self)
      .subscribe(checkForPathsChange)
  }

  private convertToLatLngLiteral(array: any): LatLngLiteral[] {
    const result: LatLngLiteral[] = []
    for (const coords of array) {
      result.push({
        lat: coords.lat(),
        lng: coords.lng(),
      })
    }
    return result
  }

}
