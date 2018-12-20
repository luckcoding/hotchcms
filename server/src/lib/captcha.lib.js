const Canvas = require('canvas')

/*
 * get random float value amount [start, end)
 */
const randFloat = function (start, end) {
  return start + (Math.random() * (end - start))
}

/*
 * get random integer value amount [start, end)
 */
const randInt = function (start, end) {
  return Math.floor(Math.random() * (end - start)) + start
}

module.exports = function () {
  let W = 90
  let H = 30
  let canvas = new Canvas(W, H)
  let ctx = canvas.getContext('2d')
  let items = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPRSTUVWXYZ23456789'.split('')
  let vcode = ''

  ctx.fillStyle = '#f3fbfe'
  ctx.fillRect(0, 0, 90, 30)
  ctx.globalAlpha = 0.8
  ctx.font = '15px sans-serif'

  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = `rgb(${randInt(150, 225)},${randInt(150, 225)},${randInt(150, 225)})`
    for (let j = 0; j < 5; j++) {
      ctx.fillText(items[randInt(0, items.length)], randFloat(-10, W + 10), randFloat(-10, H + 10))
    }
  }

  let color = `rgb(${randInt(1, 120)},${randInt(1, 120)},${randInt(1, 120)})`
  ctx.font = 'bold 24px sans-serif'

  for (let i = 0; i < 4; i++) {
    let j = randInt(0, items.length)
    ctx.fillStyle = color
    ctx.fillText(items[j], 5 + (i * 23), 30)
    ctx.fillText(items[j], 0, 0)
    vcode += items[j]
  }

  ctx.beginPath()
  ctx.strokeStyle = color
  let A = randFloat(10, H / 2)
  let b = randFloat(H / 4, (3 * H) / 4)
  let f = randFloat(H / 4, (3 * H) / 4)
  let T = randFloat(H * 1.5, W)
  let w = (2 * Math.PI) / T
  let S = function (x) {
    return (A * Math.sin((w * x) + f)) + b
  }
  ctx.lineWidth = 3
  for (let x = -20; x < 200; x += 4) {
    ctx.moveTo(x, S(x))
    ctx.lineTo(x + 3, S(x + 3))
  }

  ctx.closePath()
  ctx.stroke()

  return {
    code: vcode.toLowerCase(),
    dataURL: canvas.toDataURL(),
  }
}
