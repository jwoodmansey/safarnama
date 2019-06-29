import { TriggerZone, PointOfInterestDocument, PlaceType } from '@common/point-of-interest'
import { GeoEntity } from '@models/geo/GeoEntity'
import { Media } from '@models/media'

export class CreatingPointOfInterest {

  // An id will be set if editing
  public lat?: number
  public lng?: number

  constructor(
    public triggerZone: TriggerZone,
    public id?: string,
  ) {

  }

  setAllLatLng(lat: number, lng: number): void {
    this.updateLatLng(lat, lng)
    this.updateTriggerZoneLatLng(lat, lng)
  }

  updateLatLng(lat: number, lng: number): void {
    this.lat = lat
    this.lng = lng
  }

  updateTriggerZoneLatLng(lat: number, lng: number): void {
    this.triggerZone.lat = lat
    this.triggerZone.lng = lng
  }

  updateTriggerZoneRadius(radius: number): void {
    this.triggerZone.radius = radius
  }

  isPopulated(): boolean {
    return this.lat !== undefined && this.lng !== undefined
  }

  // An id will be set if this is an existing
  setId(id: string): void {
    this.id = id
  }
}

export class PointOfInterest implements GeoEntity {

  constructor(
      public id: string,
      public name: string,
      public lat: number,
      public lng: number,
      public triggerZone: TriggerZone,
      public placeType: PlaceType,
      public media: Media[]) {

  }

  getGeoJSONPoint(): GeoJSON.Point {
    return {
      type: 'Point',
      coordinates: [this.lng, this.lat],
    }
  }

  toGeoJSON(): GeoJSON.Feature {
    return {
      type: 'Feature',
      geometry: {
        type: 'GeometryCollection',
        geometries: [this.getGeoJSONPoint()],
      },
      properties: {
        // Since geoJson doesn't support circles, we'll store circular triggers in here
        name: this.name,
        triggerZone: this.triggerZone,
        id: this.id,
      },
    }
  }

  toDocument(experienceId: string): PointOfInterestDocument {
    console.log('exp', experienceId)
    return {
      experienceId,
      _id: undefined,
      triggerZone: this.triggerZone,
      name: this.name,
      location: this.getGeoJSONPoint(),
      type: this.placeType,
      media: this.media.map(m => m.getDocument()),
    }
  }

  static fromDocument(doc: PointOfInterestDocument): PointOfInterest {
    return new PointOfInterest(
      doc._id,
      doc.name,
      doc.location.coordinates[1],
      doc.location.coordinates[0],
      doc.triggerZone,
      doc.type,
      doc.media ? doc.media.map(m => new Media(m)) : [],
    )
  }
}
