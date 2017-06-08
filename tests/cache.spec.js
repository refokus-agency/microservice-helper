/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { addKey, getValue, removeKey } from '../lib/cache'
import { expect } from 'chai'

describe('Cache testing', function () {
  it('Add key. Expect ok.', function (done) {
    const key = 'test.key'
    const value = 'testValue'
    const timeout = 360

    addKey(key, value, timeout)
    done()
  })

  it('Get value. Expect ok.', function (done) {
    const key = 'test.key'
    const value = 'testValue'
    const timeout = 360

    addKey(key, value, timeout)
    getValue(key)
      .then((result) => {
        expect(result).to.be.ok
        expect(result).to.be.equal(value)
        done()
      })
  })

  it('Remove Key. Expect ok', function (done) {
    const key = 'test.key'
    const value = 'testValue'
    const timeout = 360

    addKey(key, value, timeout)
    getValue(key)
      .then((result) => {
        expect(result).to.be.ok

        removeKey(key)
          .then((result) => {
            expect(result).to.equal(1)

            done()
          })
      })
  })

  it('Remove Key, check. Expect ok', function (done) {
    const key = 'test.key'
    const value = 'testValue'
    const timeout = 360

    addKey(key, value, timeout)
    getValue(key)
      .then((result) => {
        expect(result).to.be.ok

        removeKey(key)
          .then((result) => {
            expect(result).to.equal(1)
            getValue(key)
              .then((result) => {
                expect(result).to.not.be.ok
                done()
              })
          })
      })
  })
})
