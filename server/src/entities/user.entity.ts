import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToMany,
} from 'typeorm'
import { sha1 } from '../utils/crypto'
import { RoleType } from '../constants'
import { AbstractEntity } from './abstract.entity'
import { ArticleEntity } from './article.entity'

@Entity('user')
export class UserEntity extends AbstractEntity {
  @Column({ type: 'char', length: 11, unique: true, comment: '手机' })
  phone?: string

  @Column({ type: 'varchar', length: 40, /*select: false,*/ comment: '密码' })
  password: string

  @Column({ type: 'varchar', length: 30, unique: true, default: null, comment: '邮箱' })
  email?: string

  @Column({ type: 'varchar', length: 20, default: null, comment: '昵称' })
  nickname?: string

  @BeforeInsert()
  @BeforeUpdate()
  async sha1Password() {
    this.password && (this.password = sha1(this.password))
  }

  // 文章
  @OneToMany(type => ArticleEntity, article => article.author)
  articles: ArticleEntity[];

  // 文章喜欢合集
  @ManyToMany(type => ArticleEntity, article => article.liked)
  articleLikes: ArticleEntity[];

  @Column({ type: 'enum', enum: RoleType, default: RoleType.user, comment: 'root|operator|user' })
  role: RoleType
}
