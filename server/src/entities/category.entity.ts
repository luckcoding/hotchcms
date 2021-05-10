import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm'
import { AbstractEntity } from './abstract.entity'
import { ArticleEntity } from './article.entity'

@Entity('category')
export class CategoryEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 30, unique: true, comment: '分类名称' })
  name: string

  @Column({ type: 'tinyint', default: 0, comment: '排序' })
  sort: number

  // 分类关联
  @OneToMany(type => ArticleEntity, article => article.category)
  articles: ArticleEntity[];

  // 目录
  // @prop({ required: true, unique: true, lowercase: true, match:  /^[A-z]+$/, minlength: 4 })
  @Column({ type: 'varchar', length: 30, unique: true, comment: '分类名称' })
  path!: string

  @Column({ type: 'boolean', default: false, comment: '是否在导航中显示' })
  display: boolean

  @Column({ type: 'simple-array', default: null, comment: '关键字' })
  keywords: string[]

  @Column('varchar', { length: 255, comment: '描述', default: null })
  description: string
}
