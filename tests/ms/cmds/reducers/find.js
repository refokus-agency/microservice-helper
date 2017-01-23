import * as dbHelpers from '../../../../lib/db'

export function findBySampleId(state) {

  return dbHelpers.findPromisified.call(state.seneca, state.bundle.where, 'testcollection')
  .then( ({ dataRaw , data }) => Object.assign({}, state, { dataRaw }, { data }))
}
