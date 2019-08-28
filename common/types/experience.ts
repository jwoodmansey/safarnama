import * as GeoJSON from 'geojson'
import { PointOfInterestDocument } from './point-of-interest'
import { RouteDocument } from './route'

export type ExperienceData = {
  _id: any,
  name: string,
  description?: string,
  ownerId?: string,
  createdAt?: Date,
  updatedAt?: Date,
  // geoJSON?: GeoJSON.FeatureCollection,
  pointOfInterests?: PointOfInterestDocument[],
  routes?: RouteDocument[],
  collaborators?: string[],
}

export type GeoData = GeoJSON.FeatureCollection & {
  type: 'FeatureCollection'
  features: [],
}

export type MetaData = {
  size: number,
  version: number,
  created_at: Date,
  shortLink?: string,
  ownerPublicProfile: PublicProfile,
}

export type PublicProfile = {
  id: string,
  photoURL?: string,
  displayName: string,
  roles?: string[],
  bio?: string,
}

export type ExperienceSnapshotData = {
  metaData: MetaData,
  data: ExperienceData,
  _id: any,
  ownerId: string,
}

// export type ExperienceSnapshotInnerData = ExperienceData & {
//   pointOfInterests: ?,
// }

// export type PlaceSnapshot = & PointOfInterestDocument {

// }
