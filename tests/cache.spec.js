/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { addKey, getValue, removeKey } from '../lib/cache'
import { expect } from 'chai'

describe('Cache testing', function () {
  describe('Test simple operations', function () {
    it('Add key. Expect ok.', function (done) {
      const key = 'test.key'
      const value = 'testValue'
      const timeout = 360

      addKey({key, value, timeout})
      done()
    })

    it('Get value. Expect ok.', function (done) {
      const key = 'test.key'
      const value = 'testValue'
      const timeout = 360

      addKey({key, value, timeout})
        .then(() => {
          getValue({key})
            .then((result) => {
              expect(result).to.be.ok
              expect(result).to.be.equal(value)
              done()
            })
        })
    })

    it('Remove Key. Expect ok', function (done) {
      const key = 'test.key'
      const value = 'testValue'
      const timeout = 360

      addKey({key, value, timeout})
        .then(() => {
          getValue({key})
            .then((result) => {
              expect(result).to.be.ok

              removeKey({key})
                .then((result) => {
                  expect(result).to.equal(1)

                  done()
                })
            })
        })
    })

    it('Remove Key, check. Expect ok', function (done) {
      const key = 'test.key'
      const value = 'testValue'
      const timeout = 360

      addKey({key, value, timeout})
        .then(() => {
          getValue({key})
            .then((result) => {
              expect(result).to.be.ok

              removeKey({key})
                .then((result) => {
                  expect(result).to.equal(1)
                  getValue({key})
                    .then((result) => {
                      expect(result).to.not.be.ok
                      done()
                    })
                })
            })
        })
    })
  })
  it('Test Object operations. Expect ok', function (done) {
    const key = 'test.key'
    const value = {
      name: 'Full Name',
      id: 1234567890
    }
    const timeout = 360

    addKey({key, value, timeout})
      .then(() => {
        getValue({key})
          .then((result) => {
            expect(result).to.be.ok

            removeKey({key})
              .then((result) => {
                expect(result).to.equal(1)
                getValue({key})
                  .then((result) => {
                    expect(result).to.not.be.ok
                    done()
                  })
              })
          })
      })
  })
  describe('Test connection options', function () {
    it('Test Object operations. Expect ok', function (done) {
      const key = 'test.key'
      const value = {
        name: 'Full Name',
        id: 1234567890
      }
      const timeout = 360
      const options = {
        url: 'redis://localhost:6379'
      }
      addKey({key, value, timeout, options})

        .then(() => {
          getValue({key, options})
            .then((result) => {
              expect(result).to.be.ok

              removeKey({key, options})
                .then((result) => {
                  expect(result).to.equal(1)
                  getValue({key, options})
                    .then((result) => {
                      expect(result).to.not.be.ok
                      done()
                    })
                })
            })
            .catch((err) => {
              done(err)
            })
        })
    })
  })
})
