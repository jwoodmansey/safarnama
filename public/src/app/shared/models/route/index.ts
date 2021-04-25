import { GeoEntity } from '@models/geo/GeoEntity'
import { RouteDocument, Direction } from '@common/route'
import { LatLngLiteral } from '@models/geo/LatLng'

export class Route implements GeoEntity {

  constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly points: LatLngLiteral[],
      public readonly colour: string,
      public readonly direction: Direction,
      public readonly description?: string) {

  }

  static fromDocument(doc: RouteDocument): Route {
    if (doc.geo.type !== 'LineString') {
      throw new Error('Invalid GeoJSON in RouteDocument')
    }
    const latLngs: LatLngLiteral[] = doc.geo.coordinates.map(c =>
      ({ lat: c[1], lng: c[0] }))
    return new Route(
      doc._id,
      doc.name,
      latLngs,
      doc.colour,
      doc.direction,
      doc.description,
    )
  }

  toDocument(experienceId: string): RouteDocument {
    return {
      experienceId,
      name: this.name,
      colour: this.colour,
      geo: this.toGeoJSONLine(),
      direction: 'None',
      _id: undefined,
      description: this.description
    }
  }

  toGeoJSONLine(): GeoJSON.LineString {
    return {
      type: 'LineString',
      coordinates: this.points.map(latLng => [latLng.lng, latLng.lat]),
    }
  }

  toGeoJSON(): GeoJSON.Feature  {
    return {
      type: 'Feature',
      properties: {
        name: this.name,
        id: this.id,
        description: this.description,
      },
      geometry: this.toGeoJSONLine(),
    }
  }
}
