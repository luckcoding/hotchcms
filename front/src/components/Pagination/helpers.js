import qs from 'qs'
import { isObject, isNumber } from 'lodash'


/**
 * 取出单位长度的数组中间的多少个
 * @param  {Number} midIndex  要取的中间下标
 * @param  {Number} arrSize 数组长度
 * @param  {Number} showSize  显示数量
 * @return {Array}           下表
 */
export function pickMidIndex(midIndex, arrSize, showSize) {
  const showIndexs = []

  for (let i = 0; i < showSize; i++) {
    // 往前推
    const prevIndex = midIndex - i
    if (prevIndex > 0 && (showIndexs.length < showSize)) {
      showIndexs.unshift(prevIndex)
    }

    // 往后推
    const nextIndex = midIndex + i
    if ((i !== 0) && (nextIndex <= arrSize) && (showIndexs.length < showSize)) {
      showIndexs.push(nextIndex)
    }
  }

  return showIndexs
}

/**
 * 取出数组中间的值
 * @param  {Array} arr      数组
 * @param  {Number} showSize 个数
 * @return {Array}          处理后的数组
 */
export function pickMidArr(arr, showSize) {
  const indexs = pickMidIndex(Math.floor((arr.length - 1) / 2), arr.length, showSize)
  return indexs.map(index => arr[index])
}

/**
 * 取逼近最大值
 */
export function handlePlus(input, plus = 0) {
  return isNumber(input)
    ? ((input >= plus) ? input : plus)
    : plus
}

/**
 * 取逼近最小值
 */
export function handleMinus(input, mins = 0) {
  return isNumber(input)
    ? ((input <= mins) ? input : mins)
    : mins
}

function Pages({
  search, currentPage, pageSize, totalSize,
}) {
  this.search = isObject(search) ? search : {}
  this.currentPage = handlePlus(currentPage)
  this.pageSize = handlePlus(pageSize)
  this.totalPage = Math.ceil(handlePlus(totalSize) / pageSize)
  return this
}

Pages.prototype.gen = function gen(page) {
  return `?${qs.stringify({ ...this.search, page })}`
}

Pages.prototype.current = function current() {
  return this.gen(this.currentPage)
}

Pages.prototype.first = function first() {
  return this.gen(1)
}

Pages.prototype.last = function last() {
  return this.gen(this.totalPage)
}

Pages.prototype.prev = function prev() {
  return this.gen(handlePlus(this.currentPage - 1, 1))
}

Pages.prototype.next = function next() {
  return this.gen(handleMinus(this.currentPage + 1, this.totalPage))
}

export { Pages }
