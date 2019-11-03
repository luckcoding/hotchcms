import nodemailer from 'nodemailer'
import { EMAIL } from '../config'
import { CodeType } from '../constants'

const { host, port, user, pass } = EMAIL

const Types = {
  [CodeType.register]: (text: string) => ({
    from: `lansebiji.com(蓝色笔记) <${user}>`,
    text: `验证码[${text}]`,
    html: `<p>验证码：<span style="font-size: 34px;font-weight: 600;color: #4090F5">${text}</span></p>`
  }),
}

class Email {
  transporter: any
  constructor() {
    this.transporter = nodemailer.createTransport({
      host,
      // secureConnection: true,
      port,
      auth: { user, pass },
      logger: false,
      debug: false
    })
  }

  async send(email = '', text = '', type = CodeType.register) {
    return await this.transporter.sendMail({
      to: email,
      ...Types[type](text),
    })
  }
}

export default new Email()