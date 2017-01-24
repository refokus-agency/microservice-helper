import * as r from './reducers/remove'

export function remove(msg, done) {

  let seneca = this

  const bundle = msg.sampleId

  const state = {
    seneca: seneca,
    bundle: bundle
  }

  r.removeBySampleId(state)
  .then(nState => {
      if(nState.deleted < 1)
        throw new Error('#notFound')

      return nState
    })
  .then(result => done(null, {ok: true, data: result}))
  .catch(err => {
      const nState = Object.assign({}, state, { error: err })
      done(null, { ok: false, data: nState })
    })
}


export function removeMany(msg, done) {

  let seneca = this

  const state = {
    seneca: seneca,
    data  : msg.conversationId
  }

  r.removeAllWithRelatedId(state)
   .then(nState => {
      if(nState.deletedMessages < 1)
      throw new Error('#notFound')

      return nState
    })
    .then(result => done(null, {ok: true, data: result}))
    .catch(err => {
      const nState = Object.assign({}, state, { error: err })
      done(null, { ok: false, data: nState })
    })

}
