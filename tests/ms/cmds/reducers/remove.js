import * as dbHelpers from '../../../../lib/db'

export function removeBySampleId (state) {
  return dbHelpers.remove.call(state.seneca, { sampleId: state.bundle }, 'testcollection')
          .then(deleted => Object.assign({}, state, { deleted: deleted }))
}

export function removeAllWithRelatedId (state) {
  return dbHelpers.removeNative.call(state.seneca,
                                            { conversationId: state.data },
                                            'testcollection')
          .then((result) => Object.assign({}, state, { deleted: result.n }))
}
