import * as shortid from "shortid";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

export abstract class AbstractEntity {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string

  @BeforeInsert()
  setId() {
    this.id = shortid.generate()
  }

  /** 创建时间 **/
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date

  /** 更新时间 **/
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    comment: '更新时间',
  })
  updatedAt: Date

  /** 删除时间 **/
  @Column({
    type: 'timestamp',
    name: 'deleted_at',
    comment: '删除时间',
    default: null,
  })
  deletedAt?: Date

  /** 是否删除 **/
  @Column({
    type: 'boolean',
    name: 'is_deleted',
    default: false,
    comment: '是否删除',
  })
  isDeleted: boolean

  /** 版本 **/
  @Column({
    type: 'int',
    default: 1,
    comment: '版本',
  })
  version: number
}
