import * as dbHelpers from '../../../../lib/db'

export function save (state) {
  return dbHelpers.save.call(state.seneca, state.bundle, 'testcollection')
          .then(({ dataRaw, data }) => Object.assign({}, state, { dataRaw }, { data }))
}
