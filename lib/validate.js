import Joi from 'joi'
import JoiObjectIdModule from 'joi-objectid'

const JoiObjectId = JoiObjectIdModule(Joi)


function validateModel(incomingObject, schema, callback) {
  Joi.validate(incomingObject, schema, callback)

}

function validateElement(element, type, callback) {
  if(type === 'ObjectId') return Joi.validate(element, JoiObjectId(), callback)

  if(typeof Joi[type] === 'function') Joi.validate(element, Joi[type](), callback)

}

export { validateModel, validateElement }

export default { validateModel, validateElement}