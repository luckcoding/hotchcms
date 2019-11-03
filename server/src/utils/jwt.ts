import jsonwebtoken from 'jsonwebtoken'
import { JWT } from '../config'

const { secret, expiresIn } = JWT

interface User {
  [key:string]: any
}

export default class Jwt {
  /**
   * 生成jwt
   * @param  {Object} user 用户信息
   * @return {String}       jwt str
   */
  static sign(user: User = {}): string {
    const { _id } = user
    return jsonwebtoken.sign({ _id }, secret, { expiresIn })
  }
}