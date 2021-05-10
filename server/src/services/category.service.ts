import { Transfer } from '../db/typeorm'
import { CategoryEntity } from '../entities'
import { SBError } from '../utils'

class Service {
  async findOne(query = {}): Promise<CategoryEntity> {
    return Transfer.manager.findOne(CategoryEntity, query)
  }

  async findAll(query = {}): Promise<CategoryEntity[]> {
    const sq = Transfer.manager
      .createQueryBuilder(CategoryEntity, 'category')
      .where('1 = 1')

    sq.orderBy('category.createdAt', 'DESC')

    return await sq.getMany()
  }

  async create(dto: any) {
    const qs = Transfer.manager
      .createQueryBuilder(CategoryEntity, 'category')
      .where('category.name = :name', { name: dto.name })

    if (await qs.getOne()) {
      throw new SBError('DUPLICATE')
    }

    let newData = new CategoryEntity()
    Object.assign(newData, dto)
    return await Transfer.manager.save(CategoryEntity, newData)
  }

  async update(id: number, dto: any) {
    let toUpdate = await this.findOne(id)
    if (!toUpdate) {
      throw new SBError('NOT_EXIST')
    }

    let updated = Object.assign(toUpdate, dto)
    return await Transfer.manager.save(CategoryEntity, updated)
  }

  async delete(id: number) {
    return await Transfer.manager.delete(CategoryEntity, id)
  }
}

export const CategoryService = new Service()
