import lodash from 'lodash'
import lodashFp from 'lodash/fp'

export function savePromisified(element, collection) {

  let seneca = this

  return new Promise ( (resolve, reject) => {
    const query = Object.assign(seneca.make$(collection), element)

    query.save$( (err, dataRaw) => {
      if(err) reject(err)

      const data = dataRaw.data$()
      resolve({ dataRaw, data })
    })

  })
}

export function saveUpdatedPromisified(dataRaw, data) {

  let seneca = this

  return new Promise( (resolve, reject) => {

    dataRaw.data$(data).save$( (err, dataRaw) => {
      const data = dataRaw.data$()
      resolve({ dataRaw, data })
    })

  })
}

export function findPromisified(where, collection) {

  let seneca = this

  return new Promise( (resolve, reject) => {
    let query = seneca.make$(collection)

    query.load$(where, (err, ret) => {
      if(err) reject(err)

      const data = ret ? ret.data$() : {}
      const dataRaw = ret || {}

      resolve({ dataRaw, data })
    })

  })

}

export function updatePromisified(formRaw, bundle, fields) {

  let seneca = this

  return new Promise ( (resolve, reject) => {

    const originalDoc = formRaw.data$()

    const updatedDoc = lodash.reduce(fields, (acc, f) => {
      const fieldToUpdate = lodashFp.set(f, lodash.get(bundle, f), acc)

      const merged = lodash.mergeWith(originalDoc, fieldToUpdate, (origValue, newValue) => {

        if(f.indexOf('.') > 0) {
          return Object.assign({}, origValue, newValue)
        }

        if (lodash.isArray(origValue) || lodash.isPlainObject(origValue)) {
          return newValue
        }
      })

      return merged


    }, {})

    resolve({ data: updatedDoc })
  })
}

export function removeNativePromisified(where, collection) {
  let seneca = this

  return new Promise( (resolve, reject) => {
    let query = seneca.make$(collection)

    query.native$( (err, db) => {
      db.collection(collection).remove(where, (err, result) => {
        if(err) return reject(err)
        resolve(result.result)
      })
    })
  })

}

export function removePromisified(where, collection) {
  let seneca = this

  return new Promise( (resolve, reject) => {
    let query = seneca.make$(collection)

    query.remove$(where, (err, data) => {
      if(err) return reject(err)
      if(!data) return reject(err)

      //It can only remove when value at a time.
      //So if it wasn't errors it means it deleted one element.
      resolve(1)
    })

  })

}

export default {
  savePromisified,
  saveUpdatedPromisified,
  findPromisified,
  updatePromisified,
  removeNativePromisified,
  removePromisified
}
