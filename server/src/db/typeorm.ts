import { join } from 'path'
import { BaseContext } from 'koa'
import { createConnection, getConnection, EntityManager } from 'typeorm'
import { MYSQL } from '../config'
import { logger } from '../utils';

declare module 'koa' {
  export interface BaseContext {
    manager: EntityManager,
  }
}

interface Transfer {
  manager: EntityManager
}


(async function () {
  try {
    await createConnection({
      type: 'mysql',
      ...MYSQL,
      extra: { 'insecureAuth': true },
      entities: [
        join(__dirname, '..', '**', '*.entity{.ts,.js}'),
      ],
      synchronize: true
    })
  } catch (e) {
    logger.error(e)
    process.exit(1)
  }
})();

// 实例中转
export const Transfer: Transfer = {
  manager: null,
}

// 事务容器
export const transaction = (fn: Function) => async (ctx: BaseContext, ...args) => {
  await getConnection().transaction(async manager => {
    Transfer.manager = manager // hack
    await fn(Object.assign(ctx, { manager }), ...args)
  })
}
