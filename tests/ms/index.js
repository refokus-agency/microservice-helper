import * as dbHelpers from '../../lib/db'

import * as cmdCreate from './cmds/create'
import * as cmdFind from './cmds/find'

export default function (opts) {

  let seneca = this

  const print = opts.printFunction
  const pin = opts.pin

  seneca.add(`${pin}, cmd:create`, cmdCreate.create)

  seneca.add(`${pin}, cmd:find`, cmdFind.find)
  seneca.add(`${pin}, cmd:find, action: findOr`, cmdFind.findOr)

}
