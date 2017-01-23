import { findBySampleId } from './reducers/find'

export function find(msg, done) {

  let seneca = this

  const bundle = { where: msg.where }

  const state = {
    seneca: seneca,
    bundle: bundle
  }

  findBySampleId(state)
  .then(result => done(null, {ok: true, data: result}))
}
