import { ExperienceData } from '@common/experience';
import * as mongoose from 'mongoose';
import { ExperienceModel } from './ExperienceModel';
import Experience = require('../schema/Experience')

export class EntityNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EntityNotFoundError'
  }
}


// The goal here is to never expose the mongoose model outside of repositories
export class Repository<T, D> {
  constructor(protected model: mongoose.Model<T>) {

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
    entity.set(id, { ...data, updatedAt: new Date() })
    const dbResp = await entity.save()
    return dbResp.toObject() as D
  }

  async findAll(query?: mongoose.FilterQuery<T>): Promise<D[]> {
    const results = this.model.find(query)
    return results.lean()
  }

  async findByIdOrThrow(id: string): Promise<D> {
    const entity = await this.model.findById(id)
    if (!entity) {
      throw new EntityNotFoundError(`Entity was not found ${id}`)
    }
    return dbResp.toObject() as D
  }
}

class ExperienceRepo extends Repository<ExperienceModel, ExperienceData> {
  constructor() {
    super(Experience)
  }

  findByUserId(userId: string) {
    return this.findAll({
      $or: [
        { ownerId: userId },
        { collaborators: userId },
      ],
    })
  }
}