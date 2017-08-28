/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import sinon from 'sinon'
import seneca from 'seneca'
import msTest from './ms/'

const tag = 'ms-test'
const pin = `role:${tag}`
global._doFinally = () => {}

function testSeneca (fin) {
  return seneca({log: 'test'})
    .test(fin)
    .use('entity')
    .use('basic')
    .use(msTest, {printFunction: () => {}, pin: pin}) // No printing
}

describe('microservice helpers testing', () => {
  it('call a cmd function without promise', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'microservice' },
      {
        sampleId: 'testId1'
      },
                  (err, result) => {
                    if (err) return done(err)

                    expect(result.data.sampleId).to.be.ok
                    expect(result.data.sampleId).to.not.equal('testId1')
                    done()
                  }
    )
  })

  it('call a cmd function without promise and get an error', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'microservice' },
                  (err, result) => {
                    if (err) return done(err)

                    expect(result.ok).to.be.false
                    expect(result.error).to.be.ok
                    done()
                  }
    )
  })

  it('call a cmd function with promise', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'microservice', action: 'promise' },
      {
        sampleId: 'testId1'
      },
                  (err, result) => {
                    if (err) return done(err)
                    expect(result.ok).to.be.true
                    expect(result.data.sampleId).to.be.ok
                    expect(result.data.sampleId).to.not.equal('testId1')
                    done()
                  }
    )
  })

  it('call a cmd function with promise and finally shouldn\'t add a property', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'microservice', action: 'promise' },
      {
        sampleId: 'testId1'
      },
      (err, result) => {
        if (err) return done(err)

        expect(result.ok).to.be.true
        expect(result.data.finally).to.not.be.ok
        done()
      }
    )
  })

  it('call a cmd function with promise and get an error', (done) => {
    const senecaApp = testSeneca(done)
    const spy = sinon.spy(global, '_doFinally')
    senecaApp.act({ role: 'ms-test', cmd: 'microservice', action: 'promise' },
                  (err, result) => {
                    if (err) return done(err)

                    expect(result.ok).to.be.false
                    expect(result.error).to.be.ok
                    expect(spy.calledWith('finally')).to.be.ok
                    spy.restore()
                    done()
                  }
    )
  })

  it('call a cmd function with promise and get a silent error', (done) => {
    const senecaApp = testSeneca(done)

    senecaApp.act({ role: 'ms-test', cmd: 'microservice', action: 'promiseSilence' },
                  (err, result) => {
                    if (err) return done(err)

                    expect(result.ok).to.be.true
                    expect(result.data.error).to.be.ok
                    expect(result.data.sampleId).to.be.ok
                    expect(result.data.sampleId).to.not.equal('testId1')
                    done()
                  }
    )
  })

  it('return function must filter all props except for sampleId', (done) => {
    const senecaApp = testSeneca(done)

    senecaApp.act({ role: 'ms-test', cmd: 'microservice', action: 'promise' },
      {
        sampleId: 'testId1'
      },
      (err, result) => {
        if (err) return done(err)

        expect(result.ok).to.be.true
        expect(result.data.sampleId).to.be.ok
        expect(result.data.seneca).to.not.be.ok
        done()
      }
    )
  })

  it('return function must filter all props', (done) => {
    const senecaApp = testSeneca(done)

    senecaApp.act({ role: 'ms-test', cmd: 'microservice', action: 'promiseReturnNone' },
      {
        sampleId: 'testId1'
      },
      (err, result) => {
        if (err) return done(err)

        expect(result.ok).to.be.true
        expect(result.data).to.be.empty
        done()
      }
    )
  })

  it('call a cmd function with promise - if ', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'microservice', action: 'promiseIf' },
      {
        sampleId: 'testId1',
        condition: true
      },
      (err, result) => {
        if (err) return done(err)

        expect(result.ok).to.be.true
        expect(result.data.sampleId).to.be.ok
        expect(result.data.sampleId).to.equal('newId3')
        done()
      }
    )
  })

  it('call a cmd function with promise - else ', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'microservice', action: 'promiseIf' },
      {
        sampleId: 'testId1',
        condition: false
      },
      (err, result) => {
        if (err) return done(err)

        expect(result.ok).to.be.true
        expect(result.data.sampleId).to.be.ok
        expect(result.data.sampleId).to.equal('newId2')
        done()
      }
    )
  })
})
