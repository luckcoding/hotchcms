import fs from 'fs'
import util from 'util'
import { URL } from 'url'

export * from './cache'
export * as crypto from './crypto'
export * from './email'
export * from './error'
export * from './joi'
export * from './jwt'
export * from './lbs'
export * from './logger'
export * from './oss'
export * from './random'
export * as regx from './regx'
export * from './sms'
export * as validate from './validate'
export * from './wechat'

type PathLike = string | Buffer | URL;
type WriteFileOptions = { encoding?: string | null; mode?: number | string; flag?: string; } | string | null;
interface MakeDirectoryOptions {
  recursive?: boolean;
  mode?: number;
}

export const readFile: (path: PathLike | number, options?: { encoding?: null; flag?: string; }) => Promise<Buffer | string> = util.promisify(fs.readFile).bind(fs)
export const writeFile: (path: PathLike | number, data: any, options?: WriteFileOptions) => Promise<void> = util.promisify(fs.writeFile).bind(fs)
export const mkdir: (path: PathLike | number, options?: number | string | MakeDirectoryOptions) => Promise<void> = util.promisify(fs.mkdir).bind(fs)
export const readdir: (path: PathLike, options?: { encoding: BufferEncoding | null; withFileTypes?: false } | BufferEncoding) => Promise<(string|Buffer)[]> = util.promisify(fs.readdir).bind(fs)
export const access: (path: PathLike, mode?: number) => Promise<void> = util.promisify(fs.access).bind(fs)
export const isAccess = async (path: PathLike, mode?: number) => {
  try {
    await access(path)
    return true
  } catch (e) {
    return false
  }
}
