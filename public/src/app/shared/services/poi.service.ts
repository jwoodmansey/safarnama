import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { HttpHeaders, HttpClient } from '@angular/common/http'
import { tap, map } from 'rxjs/operators'
import { CreatingPointOfInterest, PointOfInterest } from '@models/place'
import { environment } from '../../../environments/environment'
import { PointOfInterestDocument } from '@common/point-of-interest'

@Injectable({
  providedIn: 'root',
})
export class PoiService {

  private POI_URL = environment.api.url + 'point-of-interest'
  // private URL_GET_ALL = environment.api.url + 'experience/mine'

  private creatingPoi: CreatingPointOfInterest | undefined
  private creatingPoiObservable: BehaviorSubject<CreatingPointOfInterest | undefined> =
    new BehaviorSubject(undefined)
  private allPois: PointOfInterest[] = []
  private allPoisObservable: BehaviorSubject<PointOfInterest[]> = new BehaviorSubject([])

  constructor(private http: HttpClient) { }

  getCreatingPoi(): Observable<CreatingPointOfInterest | undefined> {
    return this.creatingPoiObservable.asObservable()
  }

  isCreatingPoi(): boolean {
    return this.creatingPoi !== undefined
  }

  getById(poiId: string): PointOfInterest {
    return this.allPois.find(poi => poi.id === poiId)
  }

  setCreatingPoi(poi: CreatingPointOfInterest | undefined): void {
    // MUST clone the object or we will pass by reference and confuse change detection
    // this.creatingPoiObservable.next(Object.assign({}, poi))
    this.creatingPoiObservable.next(poi)
    this.creatingPoi = poi
  }

  setInitialLatLng(lat: number, lng: number): void {
    this.creatingPoi.setAllLatLng(lat, lng)
    // MUST clone the object or we will pass by reference and confuse change detection
    this.creatingPoiObservable.next(this.creatingPoi)
  }

  updateCreatingPoiLatLng(lat: number, lng: number): void {
    this.creatingPoi.updateLatLng(lat, lng)
  }

  updateCreatingTriggerLatLng(lat: number, lng: number): void {
    this.creatingPoi.updateTriggerZoneLatLng(lat, lng)
  }

  updateCreatingPoiTriggerRadius(radius: number): void {
    this.creatingPoi.updateTriggerZoneRadius(radius)
  }

  poisLoaded(pois: PointOfInterestDocument[]): void {
    const objs = pois.map(poi => PointOfInterest.fromDocument(poi))
    this.allPois = []
    this.allPois.push(...objs)
    this.allPoisObservable.next(this.allPois)
  }

  addNewPointOfInterest(experienceId: string,
                        poi: PointOfInterest): Observable<PointOfInterestDocument> {
    return this.http.post<PointOfInterestDocument>(
      this.POI_URL,
      poi.toDocument(experienceId), {
        headers: new HttpHeaders({'Content-Type':  'application/json',
        }),
      })
      .pipe(
        tap(createdPoi => {
          this.allPois.push(PointOfInterest.fromDocument(createdPoi))
          this.creatingPoiObservable.next(undefined)
          this.creatingPoi = undefined
          this.allPoisObservable.next(this.allPois)
        }),
      )
  }

  editPointOfInterest(experienceId: string,
                      poi: PointOfInterest): Observable<PointOfInterestDocument> {
    return this.http.put<PointOfInterestDocument>(
      `${this.POI_URL}/${poi.id}`,
      poi.toDocument(experienceId),
    ).pipe(
      tap(editedPoi => {
        const idx = this.allPois.findIndex(poi => poi.id === editedPoi._id)
        this.allPois[idx] = PointOfInterest.fromDocument(editedPoi)
        this.creatingPoiObservable.next(undefined)
        this.creatingPoi = undefined
        this.allPoisObservable.next(this.allPois)
      }),
    )
  }

  deletePoi(poiId: string): Observable<boolean> {
    return this.http.delete(`${this.POI_URL}/${poiId}`).pipe(
      map(() => true),
      tap(() => {
        const idx = this.allPois.findIndex(poi => poi.id === poiId)
        this.allPois.splice(idx, 1)
        this.allPoisObservable.next(this.allPois)
      }),
    )
  }

  getAll(): Observable<PointOfInterest[]> {
    return this.allPoisObservable.asObservable()
  }
}
