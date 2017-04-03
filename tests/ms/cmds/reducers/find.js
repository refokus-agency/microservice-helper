import * as dbHelpers from '../../../../lib/db'

export function findBySampleRelatedId(state) {

  return  dbHelpers.findPromisified.call(state.seneca, state.bundle.where, 'testcollection')
                   .then( ({ dataRaw , data }) => Object.assign({}, state, { dataRaw }, { data }))
}

export function findBySampleIdAndSampleRelatedId(state) {

  return  dbHelpers.findOnePromisified.call(state.seneca, state.bundle.where, 'testcollection')
          .then( ({ dataRaw , data }) => Object.assign({}, state, { dataRaw }, { data }))
}

export function findBySampleIdWithOrSelect(state) {

  return  dbHelpers.findOrPromisified.call(state.seneca, state.bundle.where, 'testcollection')
          .then( ({ dataRaw , data }) => Object.assign({}, state, { dataRaw }, { data }))

}
