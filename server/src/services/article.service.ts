import { Transfer } from '../db/typeorm'
import { ArticleEntity } from '../entities'
import { SBError } from '../utils'

class Service {
  async findById(id: number): Promise<ArticleEntity> {
    const article = await Transfer.manager.findOne(ArticleEntity, id)
    if (!article) {
      throw new SBError('NOT_EXIST')
    }
    return article
  }

  async findOne(query = {}): Promise<ArticleEntity> {
    return await Transfer.manager.findOne(ArticleEntity, query)
  }

  async findAll(input): Promise<{ list: ArticleEntity[], count: number }>  {
    const { page = 1, pageSize = 10, ...query } = input

    const sq = Transfer.manager
      .createQueryBuilder(ArticleEntity, 'article')
      .leftJoinAndSelect('article.category', 'category')
      .where('1 = 1')

    if ('title' in query) {
      sq.andWhere('article.title LIKE :title', { title: `%${query.title}%` })
    }

    if ('category' in query) {
      sq.andWhere('article.category = :category', { category: query.category })
    }

    sq.orderBy('article.createdAt', 'DESC')

    const count = await sq.getCount()

    const list = await sq
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany()

    return { count, list }
  }

  async create(dto: any) {
    const qs = Transfer.manager
      .createQueryBuilder(ArticleEntity, 'article')
      .where('article.title = :title', { title: dto.title })

    if (await qs.getOne()) {
      throw new SBError('DUPLICATE')
    }

    let newData = new ArticleEntity()
    Object.assign(newData, dto)

    return await Transfer.manager.save(ArticleEntity, newData)
  }

  async update(id: number, dto: any) {
    let toUpdate = await this.findOne(id)
    if (!toUpdate) {
      throw new SBError('NOT_EXIST')
    }

    let updated = Object.assign(toUpdate, dto)
    return await Transfer.manager.save(ArticleEntity, updated)
  }

  async delete(id: number) {
    return await Transfer.manager.delete(ArticleEntity, id)
  }
}

export const ArticleService = new Service()
