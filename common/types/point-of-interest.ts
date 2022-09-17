import { MediaDocument } from './media';

export type PointOfInterestDocument = {
  _id: any,
  name: string,
  description?: string
  location: GeoJSON.Point,
  triggerZone: TriggerZone,
  createdAt?: Date,
  updatedAt?: Date,
  ownerId?: string,
  experienceId?: string,
  type: PlaceType,
  media: MediaDocument[],
};

type TriggerZoneType = 'circle' | 'polygon';

export type TriggerZone = {
  type: TriggerZoneType,
  lat: number,
  lng: number,
  colour: string,
  radius: number, // Radius in metres, on the earths surface
};

export type PlaceType = {
  name: string,
  imageIconURL?: string,
  matIcon?: string,
  _id: any,
  ownerId?: string,
  created_at?: string,
  updated_at?: string
};
