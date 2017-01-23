import * as dbHelpers from '../../../../lib/db'

export function updateBy(state) {

  return  dbHelpers.updatePromisified.call(state.seneca, state.dataRaw, state.bundle, ['sampleData'])
          .then( ({ dataRaw , data }) => Object.assign({}, state, { dataRaw }, { data }))
}
