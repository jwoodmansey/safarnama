export type Member = {
  userId: string,
  roles: string[]
  name?: string,
}

export type ProjectData = {
  _id: any,
  name: string,
  description?: string,
  createdAt?: Date,
  updatedAt?: Date,
  members?: Member[],
  iOS?: {
    appStoreId: string
    bundleId: string,
  },
  android?: {
    package: string
  },
}