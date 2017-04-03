import * as dbHelpers from '../../../../lib/db'

export function updateBy (state) {
  return dbHelpers.updatePromisified.call(state.seneca, state.dataRaw, state.bundle, ['sampleData'])
          .then(({ dataRaw, data }) => Object.assign({}, state, { dataRaw }, { data }))
}

export function updateMultipleFieldsBy (state) {
  const opFields = {
    $set: state.bundle.update
  }

  return dbHelpers.updateNativePromisified.call(state.seneca, state.bundle.where, opFields, 'testcollection')
          .then(data => Object.assign({}, state, { data }))
}
