type Member = {
  userId: string,
  roles: string[]
}

export type Project = {
  name: string,
  description?: string,
  createdAt?: Date,
  updatedAt?: Date,
  members?: Member[],
}