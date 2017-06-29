import * as cmdCreate from './cmds/create'
import * as cmdFind from './cmds/find'
import * as cmdRemove from './cmds/remove'
import * as cmdUpdate from './cmds/update'
import * as cmdMicroservice from './cmds/microservice'
import {doFn} from '../../lib/microservice'

export default function (opts) {
  let seneca = this

  const pin = opts.pin

  seneca.add(`${pin}, cmd:create`, cmdCreate.create)

  seneca.add(`${pin}, cmd:find,`, cmdFind.find)
  seneca.add(`${pin}, cmd:find, action: findOne`, cmdFind.findOne)
  seneca.add(`${pin}, cmd:find, action: findOr`, cmdFind.findOr)
  seneca.add(`${pin}, cmd:find, action: findAndPopulate`, cmdFind.findAndPopulate)

  seneca.add(`${pin}, cmd:update, action: updateBy`, cmdUpdate.updateBy)
  seneca.add(`${pin}, cmd:update, action: updateMultipleFieldsBy`, cmdUpdate.updateMultipleFieldsBy)

  seneca.add(`${pin}, cmd:remove`, cmdRemove.remove)
  seneca.add(`${pin}, cmd:remove, action: removeMany`, cmdRemove.removeMany)

  seneca.add(`${pin}, cmd:microservice`, doFn(cmdMicroservice.cmdFnc))

  seneca.add(`${pin}, cmd:microservice, action:promise`, doFn(cmdMicroservice.cmdFncPromisified))

  seneca.add(`${pin}, cmd:microservice, action:promiseSilence`, doFn(cmdMicroservice.cmdFncPromisifiedSilence))

  seneca.add(`${pin}, cmd:microservice, action:promiseReturnNone`, doFn(cmdMicroservice.cmdFncPromiseReturnNone))
}
