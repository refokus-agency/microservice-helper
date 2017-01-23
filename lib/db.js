import async from 'async'
import lodash from 'lodash'
import lodashFp from 'lodash/fp'

function saveUpdatedPromisified(dataRaw, data) {

  return new Promise( (resolve, reject) => {

    dataRaw.data$(data).save$( (err, dataRaw) => {
      if (err) return reject(err)

      const data = dataRaw.data$()
      resolve({ dataRaw, data })
    })

  })
}

export function savePromisified(element, collection) {

  let seneca = this

  return new Promise ( (resolve, reject) => {
    const query = Object.assign(seneca.make$(collection), element)

    query.save$( (err, dataRaw) => {
      if(err) return reject(err)

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
      if(err) return reject(err)

      const data = ret ? ret.data$() : {}
      const dataRaw = ret || {}

      resolve({ dataRaw, data })
    })

  })

}

export function findOrPromisified(where, collection) {

  let seneca = this

  return new Promise ( (resolve, reject) => {
    let query = seneca.make$(collection)

    const conditionsTasks = where.map( (cond) => {
      function runQuery (next) {
        query.list$(cond, (err, data) => {
          next(null, data)
        })
      }

      return runQuery
    })

    async.series(conditionsTasks, (err, values) => {

      //Bundle all together the raw and object data
      //in order to extract them later.
      const listResult = lodash.reduce(values, (acc, v) => {
        const objs = v.map( e => Object.assign({}, {d: e.data$()}, {r: e}))
        return acc.concat(objs)
      }, [])

      //Merge the list by the id
      const listMerged = lodash.uniqBy(listResult, 'd.id')

      //Extract the raw and object data
      const listDataRaw = listMerged.map( r => r.r )
      const listData = listMerged.map( r => r.d )

      const dataRaw = listDataRaw || {}
      const data = listData || {}

      resolve({ dataRaw, data })
    })

  })
}

export function updatePromisified(dataRaw, bundle, fields) {

  return new Promise ( (resolve, reject) => {

    const originalDoc = dataRaw.data$()

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

    dataRaw.data$(updatedDoc).save$( (err, dataRaw) => {
      if (err) return reject(err)

      const data = dataRaw.data$()
      resolve({ dataRaw, data })
    })
  })
}


export function updateNativePromisified(where, opFields, collection) {

  let seneca = this

  return new Promise ( (resolve, reject) => {
    let query = seneca.make$(collection)

    query.native$( (err, db) => {
      let forms = db.collection(collection)
      db.collection(collection).findAndModify(where, [['_id','asc']], opFields, {new: true}, (err, result) => {
        if(err) return reject(err)
        resolve(result.value)
      })
    })

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

export function populatePromisified(object, keyString, select, collection) {

  let seneca = this

  return new Promise( (resolve, reject) => {

    let query = seneca.make$(collection)

    //Lodash 'at' function always returns an array.
    //That's why head is invoked, it gets the first
    //element of the array, in fact, the only one.
    const subtree = lodash.chain(object)
                          .at(keyString)
                          .head()
                          .value()

    async.map(subtree, (id, next) => {
       return _load(id, query, next)
      }, (err, values) => {

        const validValues = values.filter( (v) => v != undefined)

        let toMerge = validValues

        if(select.length > 0) {

          toMerge = lodash.reduce(validValues, (result, v) => {

            let elements = lodash.reduce(select, (acc, s) => {
              let {fieldKey, fieldValue} = _getFieldValue(v, s)
              return lodashFp.set(fieldKey, fieldValue, acc)
            }, {})

            return result.concat(elements)

          }, [])
        }

        resolve(lodashFp.set(keyString, toMerge, object))
      } 
    )
  })
}



export default {
  savePromisified,
  saveUpdatedPromisified,
  findPromisified,
  findOrPromisified,
  updatePromisified,
  updateNativePromisified,
  removePromisified,
  removeNativePromisified,
  populatePromisified
}
