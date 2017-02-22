import {expect} from 'chai'
import {handle} from '../lib/handler'
import Joi from 'joi'

describe('Error handler test', function () {

  it('Given apiFail must return a new error with correct description', function (done) {

    let e = handle('apiFail')

    expect(e)
      .to
      .be
      .an('error')
    expect(e)
      .to
      .have
      .property('code', '#apiFail')
    expect(e)
      .to
      .have
      .property('message', 'The SD API fail.')

    done()
  })

  it('Given unknownError must return a new error with correct description', function (done) {

    let e = handle('Something was unexpected.')

    expect(e)
      .to
      .be
      .an('error')
    expect(e)
      .to
      .have
      .property('code', '#unknownError')
    expect(e)
      .to
      .have
      .property('message', 'Something was unexpected.')

    done()
  })

  it('Given #apiFail must return a new error with correct description', function (done) {

    let e = handle('#apiFail')

    expect(e)
      .to
      .be
      .an('error')
    expect(e)
      .to
      .have
      .property('code', '#apiFail')
    expect(e)
      .to
      .have
      .property('message', 'The SD API fail.')

    done()
  })

  it('Given invalid123 must return Unknown error', function (done) {

    let e = handle('invalid123')

    expect(e)
      .to
      .be
      .an('error')
    expect(e)
      .to
      .have
      .property('code', '#unknownError')
    expect(e)
      .to
      .have
      .property('message', 'Something was unexpected.')

    done()
  })

  it('Given unknownError and a error, must return the old stack and the old error as a property', function (done) {

    const oldError = new Error()
    const e        = handle('invalid', oldError)

    expect(e)
      .to
      .be
      .an('error')
    expect(e)
      .to
      .have
      .property('code', '#unknownError')
    expect(e)
      .to
      .have
      .property('message', 'Something was unexpected.')

    expect(e)
      .to
      .have
      .property('stack', oldError.stack)

    expect(e)
      .to
      .have
      .property('oldError', oldError)
    done()
  })

  it('Joi error must add property badParams and receivedMessage', function (done) {

    const schema = {
      a : Joi.number(),
      b : Joi.boolean(),
      c : Joi.array()
             .required(),
      d : Joi.array()
             .min(1)
             .required(),
      e : Joi.string()
    }

    const msg = {a : 'string', b : 123, c : true, e : 'test'}

    let result = Joi.validate(msg, schema, {abortEarly : false})

    const e = handle('#schemaValidation', result.error)

    expect(e)
      .to
      .be
      .an('error')

    expect(e)
      .to
      .have
      .property('badParams')

    expect(e.badParams)
      .that
      .is
      .an('array')
      .to
      .have
      .lengthOf(4)

    expect(e.receivedMessage)
      .to
      .equal(msg)

    done()
  })

})
