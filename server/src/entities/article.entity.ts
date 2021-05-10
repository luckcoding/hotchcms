import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm'
import { AbstractEntity } from './abstract.entity'
import { CategoryEntity } from './category.entity';
import { UserEntity } from './user.entity';
import { ArticleFromType, ArticleFromTypes, ArticleStatusType, ArticleStatusTypes } from '../constants';

/**
 * 文章内容
 */
@Entity({ name: 'article' })
export class ArticleEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 255, comment: '标题', default: null })
  title?: string // 标题

  @Column('varchar', { length: 255, comment: '概述', default: null })
  overview?: string // 概述

  // 文章分类
  @ManyToOne(type => CategoryEntity, category => category.articles)
  category: CategoryEntity;

  @Column('varchar', { length: 255, comment: '封面', default: null })
  cover?: string // 封面

  @Column({ type: 'simple-array', default: null, comment: '标签' })
  tags: string[] // 标签

  @Column({ type: 'text', default: null, comment: '内容' })
  content?: string

  // @Column({ type: 'tinyint', default: 0, comment: '来源类型 0: 转载, 1: 编辑(adminUser), 2: 用户(User)' })
  @Column({ type: 'enum', enum: ArticleFromType, default: ArticleFromType.official, comment: ArticleFromTypes.join(',') })
  from: ArticleFromType

  // 作者
  @ManyToOne(type => UserEntity, user => user.articles)
  author?: UserEntity;

  @Column('varchar', { length: 50, comment: '原作者', default: null })
  originalAuthor?: string

  @Column('varchar', { length: 255, comment: '转载地址', default: null })
  originalUrl?: string

  @Column({ type: 'boolean', default: false, comment: '是否置顶' })
  isTop: boolean

  @Column('int', { name: 'view_num', default: 0, comment: '浏览数量' })
  viewNum: number

  // 喜欢该文章的用户ID集合
  @ManyToMany(type => UserEntity, user => user.articleLikes)
  liked?: UserEntity;

  // 0:草稿 1:上线 2:下线 9:回收站
  // @Column({ type: 'tinyint', default: 0, comment: '0:草稿 1:上线 2:下线 9:回收站' })
  @Column({ type: 'enum', enum: ArticleStatusType, default: ArticleStatusType.draft, comment: ArticleStatusTypes.join(',') })
  status: ArticleStatusType
}
