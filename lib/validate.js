import Joi from 'joi'
import JoiObjectIdModule from 'joi-objectid'

const JoiObjectId = JoiObjectIdModule(Joi)

function joiValidator (type) {
  if (type === 'ObjectId') return JoiObjectId
  if (typeof Joi[type] === 'function') return Joi[type]
}

function validatePromisified(objectToValidate, schema) {

  return new Promise ( (resolve, reject) => {

    Joi.validate(objectToValidate, schema, (err, result) => {
      if(err) return reject(err)

      resolve(result)
    })

  })

}

function validateElementPromisified(elementToValidate, type) {

  return new Promise ( (resolve, reject) => {

    let v = joiValidator(type) 

    Joi.validate(elementToValidate, v(), (err, result) => {
      if(err) return reject(err)

      resolve(result)
    })

  })
}

export default { validatePromisified, validateElementPromisified }
