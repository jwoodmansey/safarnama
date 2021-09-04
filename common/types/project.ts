type Member = {
  userId: string,
  roles: string[]
}

type App = {
  iOS: {
    appStoreId: string
    bundleId: string,
  },
  android: {
    package: string
  },
}

export type ProjectData = {
  _id: string,
  name: string,
  description?: string,
  createdAt?: Date,
  updatedAt?: Date,
  members?: Member[],
  app?: App,
}