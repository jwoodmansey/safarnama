export type Direction = 'None' | 'Ascending' | 'Descending';

export type RouteDocument = {
  _id: any,
  name: string,
  geo: GeoJSON.LineString,
  direction: Direction,
  colour: string,
  created_at?: Date,
  updated_at?: Date,
  ownerId?: string,
  experienceId?: string,
  description?: string,
};
