import * as mongoose from 'mongoose';

export class EntityNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EntityNotFoundError'
  }
}


// The goal here is to never expose the mongoose model outside of repositories
export class Repository<T extends mongoose.Model<D>, D> {
  constructor(protected model: T) {

  }

  async add(data: D): Promise<D> {
    const entity = new this.model(data)
    await entity.save()
    return entity.toObject() as D
  }

  async remove(id: string) {
    const entity = await this.model.findById(id)
    if (!entity) {
      throw new EntityNotFoundError(`Entity was not found ${id}`)
    }
    await entity.remove()
  }

  async edit(id: string, data: Partial<D>): Promise<D> {
    const entity = await this.model.findById(id)
    if (!entity) {
      throw new EntityNotFoundError(`Entity was not found ${id}`)
    }
    entity.set({ ...data, updatedAt: new Date() })
    const dbResp = await entity.save()
    return dbResp.toObject() as D
  }

  async findAll(query: mongoose.FilterQuery<D> = {}): Promise<D[]> {
    const results = await this.model.find(query, undefined)
    return results.map(r => r.toObject()) as D[]
  }

  async findByIdOrThrow(id: string): Promise<D> {
    const entity = await this.model.findById(id)
    if (!entity) {
      throw new EntityNotFoundError(`Entity was not found ${id}`)
    }
    return entity.toObject() as D
  }

  async findById(id: string): Promise<D | undefined> {
    const entity = await this.model.findById(id)
    if (!entity) {
      return undefined
    }
    return entity.toObject() as D
  }
}

// Example usage
// class ExperienceRepo extends Repository<ExperienceModel, ExperienceData> {
//   constructor() {
//     super(Experience)
//   }

//   findByUserId(userId: string) {
//     return this.findAll({
//       $or: [
//         { ownerId: userId },
//         { collaborators: userId },
//       ],
//     })
//   }
// }