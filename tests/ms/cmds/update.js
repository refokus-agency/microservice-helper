import * as r from './reducers/update'
import * as rFind from './reducers/find'

export function updateBy (msg, done) {
  let seneca = this

  const state = {
    seneca: seneca,
    bundle: Object.assign({}, { where: msg.where }, { sampleData: msg.sampleData })
  }

  rFind.findBySampleIdAndSampleRelatedId(state)
  .then(nState => {
    if (!nState.dataRaw) { throw new Error('#notFound') }

    return nState
  })
  .then(r.updateBy)
  .then(result => done(null, {ok: true, data: result}))
  .catch(err => {
    const nState = Object.assign({}, state, { error: err })
    done(null, { ok: false, data: nState })
  })
}

export function updateMultipleFieldsBy (msg, done) {
  let seneca = this

  const bundle = Object.assign({}, { where: msg.where }, { update: msg.update })

  const state = {
    seneca: seneca,
    bundle: bundle
  }

  r.updateMultipleFieldsBy(state)
  .then(result => done(null, {ok: true, data: result}))
}
