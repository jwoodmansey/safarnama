export type Direction = 'None' | 'Ascending' | 'Descending'

export type RouteDocument = {
  _id: any,
  name: string,
  geo: GeoJSON.LineString,
  direction: Direction,
  colour: string,
  createdAt?: Date,
  updatedAt?: Date,
  ownerId?: string,
  experienceId: string,
  description?: string
}
