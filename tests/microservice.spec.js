import { expect } from 'chai'

import seneca from 'seneca'
import msTest from './ms/'


const tag = 'ms-test'
const pin = `role:${tag}`

function test_seneca(fin) {
  return  seneca({log: 'test'})
    .test(fin)
    .use('entity')
    .use('basic')
    .use(msTest, {printFunction: () => {}, pin: pin}) //No printing
}

describe('microservice helpers testing', () => {

  it('call a cmd function without promise', (done) => {
    const senecaApp = test_seneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'microservice' },
                  {
                    sampleId        : 'testId1'
                  },
                  (err, result) => {
                    expect(result.ok).to.be.true
                    expect(result.data.sampleId).to.be.ok
                    done()
                  }
    )
  })

  it('call a cmd function without promise and get an error', (done) => {
    const senecaApp = test_seneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'microservice', action: 'promise' },
                  (err, result) => {
                    expect(result.ok).to.be.false
                    expect(result.error).to.be.ok
                    done()
                  }
    )
  })

  it('call a cmd function with promise', (done) => {
    const senecaApp = test_seneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'microservice', action: 'promise' },
                  {
                    sampleId        : 'testId1'
                  },
                  (err, result) => {
                    expect(result.ok).to.be.true
                    expect(result.data.sampleId).to.be.ok
                    done()
                  }
    )
  })

  it('call a cmd function with promise and get an error', (done) => {
    const senecaApp = test_seneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'microservice', action: 'promise' },
                  (err, result) => {
                    expect(result.ok).to.be.false
                    expect(result.error).to.be.ok
                    done()
                  }
    )
  })
})
