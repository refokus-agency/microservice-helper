import * as r from './reducers/save'

export function create (msg, done) {
  let seneca = this

  const state = {
    seneca: seneca,
    bundle: msg.data
  }

  r.save(state)
  .then(result => done(null, {ok: true, data: result}))
}
