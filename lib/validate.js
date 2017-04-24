/**
 * Used to validate a basic type or schema
 * @module
 */
import Joi from 'joi'
import JoiObjectIdModule from 'joi-objectid'

const JoiObjectId = JoiObjectIdModule(Joi)

function _joiValidator (type) {
  if (type === 'ObjectId') return JoiObjectId
  if (typeof Joi[type] === 'function') return Joi[type]
}
/**
 *
 * @param {Object} objectToValidate
 * @param {Object} schema - Can be a joi type object or a plain object where every key is assigned a joi type object
 * @returns {Promise}
 */
export function validatePromisified (objectToValidate, schema) {
  return new Promise((resolve, reject) => {
    Joi.validate(objectToValidate, schema, {abortEarly: false}, (err, result) => {
      if (err) return reject(err)

      resolve(result)
    })
  })
}
/**
 *
 * @param {Object} elementToValidate
 * @param {String} type - Any of the classic basic primitive types
 * @returns {Promise}
 */
export function validateElementPromisified (elementToValidate, type) {
  return new Promise((resolve, reject) => {
    let v = _joiValidator(type)

    Joi.validate(elementToValidate, v(), {abortEarly: false}, (err, result) => {
      if (err) return reject(err)

      resolve(result)
    })
  })
}
