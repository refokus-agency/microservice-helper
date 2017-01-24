import * as dbHelpers from '../../../../lib/db'

export function populateField(state) {

  return dbHelpers.populatePromisified.call(
                  state.seneca,
                  state.data,
                  'relatedFields',
                  ['sampleId', 'sampleData'],
                  'testcollection')
        .then(data => Object.assign({}, state, { data }))
}

