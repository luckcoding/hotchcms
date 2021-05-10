/**
 * 随机数
 * @param  {Number} length [长度]
 * @return {String}
 */
 export function random(length: number = 1): string {
  const base = Math.floor(Math.random() * Math.pow(10, length))
  return (`0000000000000000${base}`).substr(-length)
}
