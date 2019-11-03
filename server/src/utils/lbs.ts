import request from 'request'
import { md5 } from './crypto'
import { LBS } from '../config'

const { key, secret, url } = LBS

class Lbs {
  // get_poi 是否返回周边POI列表：1.返回；0不返回(默认)
  static async geocoder (lat, lng) {
    return new Promise((resolve, reject) => {
      const query = { key, location: `${lat},${lng}` }
      const qs = Object.keys(query).map(k => `${k}=${query[k]}`).sort().join('&')
      const sign = md5(`/ws/geocoder/v1?${qs}${secret}`)

      request(`${url}/ws/geocoder/v1?${qs}&sig=${sign}`, (err, { body }) => {
        if (err) return reject(err)
        const { status, message, result } = JSON.parse(body)
        if (status === 0) {
          resolve(result)
        } else {
          reject(message)
        }
      })
    })
  }
}

export default Lbs