import * as dbHelpers from '../../lib/db'

import * as cmdFind from './cmds/find'

export default function (opts) {

  let seneca = this

  const print = opts.printFunction
  const pin = opts.pin

  seneca.add(`${pin}, cmd:create`, create)
  seneca.add(`${pin}, cmd:find`, cmdFind.find)
  seneca.add(`${pin}, cmd:find, action: findOr`, cmdFind.findOr)

}

function create(msg, done) {

  let seneca = this

  const state = {
    seneca: seneca,
    bundle: msg.data,
  }

  dbHelpers.savePromisified.call(state.seneca, state.bundle, 'testcollection')
  .then(result => done(null, {ok: true, data: result}))
}


