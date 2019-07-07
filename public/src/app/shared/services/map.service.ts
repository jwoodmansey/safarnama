import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Use this service from anywhere in the app to control the maps lat/lng/zoom
 */
@Injectable({
  providedIn: 'root',
})
export class MapService {

  private lat: BehaviorSubject<number> = new BehaviorSubject(54.048726)
  private lng: BehaviorSubject<number> = new BehaviorSubject(-2.803090)
  private zoom: BehaviorSubject<number> = new BehaviorSubject(18)

  constructor() { }

  getLat(): Observable<number> {
    return this.lat.asObservable()
  }

  getLng(): Observable<number> {
    return this.lng.asObservable()
  }

  getZoom(): Observable<number> {
    return this.zoom.asObservable()
  }

  setLatLngZoom(lat: number, lng: number, zoom: number): void {
    console.log('setLatLngZoom', lat, lng, zoom)
    this.setLat(lat)
    this.setLng(lng)
    this.setZoom(zoom)
  }

  setLat(lat: number): void {
    this.lat.next(lat)
  }

  setLng(lng: number): void {
    this.lng.next(lng)
  }

  setZoom(zoom: number): void {
    this.zoom.next(zoom)
  }
}
