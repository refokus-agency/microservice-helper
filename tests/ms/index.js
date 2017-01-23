import * as dbHelpers from '../../lib/db'

import * as cmdCreate from './cmds/create'
import * as cmdFind from './cmds/find'
import * as cmdRemove from './cmds/remove'
import * as cmdUpdate from './cmds/update'

export default function (opts) {

  let seneca = this

  const print = opts.printFunction
  const pin = opts.pin

  seneca.add(`${pin}, cmd:create`, cmdCreate.create)

  seneca.add(`${pin}, cmd:find`, cmdFind.find)
  seneca.add(`${pin}, cmd:find, action: findOr`, cmdFind.findOr)

  seneca.add(`${pin}, cmd:update, action: updateBy`, cmdUpdate.updateBy)
  seneca.add(`${pin}, cmd:update, action: updateMultipleFieldsBy`, cmdUpdate.updateMultipleFieldsBy)

  seneca.add(`${pin}, cmd:remove`, cmdRemove.remove)
  seneca.add(`${pin}, cmd:remove, action: removeMany`, cmdRemove.removeMany)

}
