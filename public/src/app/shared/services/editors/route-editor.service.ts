import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Route } from '@models/route'
import { LatLngLiteral } from '@models/geo/LatLng'

export class EditingRoute {

  private creating: boolean = true
  private points: LatLngLiteral[] = []
  private colour: string = '#51D9A9'

  constructor(public route?: Route) {
    if (route) {
      this.creating = false
      this.colour = route.colour
      //  Clone as these are objects
      this.points.push(...route.points.map(x => ({ ...x })))
      console.log('editing route', this.route)
    }
  }

  addPoint(point: LatLngLiteral): void {
    this.points.push(point)
  }

  removeLastPoint(): void {
    this.points.pop()
  }

  isCreating(): boolean {
    return this.creating
  }

  setColour(colour: string): void {
    this.colour = colour
  }

  getColour(): string {
    return this.colour
  }

  getPoints(): LatLngLiteral[] {
    return this.points
  }
}

@Injectable({
  providedIn: 'root',
})
export class RouteEditorService {

  private editingRoute: EditingRoute | undefined
  private $editingRoute: BehaviorSubject<EditingRoute | undefined> = new BehaviorSubject(undefined)

  constructor() { }

  public startEditing(route?: Route): void {
    this.editingRoute = new EditingRoute(route)
    this.$editingRoute.next(this.editingRoute)
  }

  public finishEditing(): void {
    this.editingRoute = undefined
    this.$editingRoute.next(this.editingRoute)
  }

  public isEditingRoute(): Observable<boolean> {
    return this.$editingRoute.pipe(map(route => route !== undefined))
  }

  public isEditingRoutePrimitive(): boolean {
    return this.editingRoute !== undefined
  }

  public getRoute(): Observable<EditingRoute | undefined> {
    return this.$editingRoute.asObservable()
  }

  public addPoint(latLng: LatLngLiteral): void {
    // We only add while in creation mode, other gmaps takes care
    // if (this.editingRoute.isCreating()) {
      this.editingRoute.addPoint(latLng)
      this.$editingRoute.next(this.editingRoute)
    // }
  }

  public undo(): void {
    // if (this.editingRoute.isCreating()) {
      this.editingRoute.removeLastPoint()
      this.$editingRoute.next(this.editingRoute)

    // }
  }

  public setColour(colour: string): void {
    this.editingRoute.setColour(colour)
    this.$editingRoute.next(this.editingRoute)
  }

}
