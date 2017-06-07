import * as dbHelpers from '../../../../lib/db'

export function findBySampleRelatedId (state) {
  return dbHelpers.find.call(state.seneca, state.bundle.where, 'testcollection')
                   .then(({ dataRaw, data }) => Object.assign({}, state, { dataRaw }, { data }))
}

export function findBySampleIdAndSampleRelatedId (state) {
  return dbHelpers.findOne.call(state.seneca, state.bundle.where, 'testcollection')
          .then(({ dataRaw, data }) => Object.assign({}, state, { dataRaw }, { data }))
}

export function findBySampleIdWithOrSelect (state) {
  return dbHelpers.findOr.call(state.seneca, state.bundle.where, 'testcollection')
          .then(({ dataRaw, data }) => Object.assign({}, state, { dataRaw }, { data }))
}
