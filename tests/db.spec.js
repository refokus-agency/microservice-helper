import { expect } from 'chai'

import seneca from 'seneca'
import msTest from './ms/'

const tag = 'ms-test'
const pin = `role:${tag}`

const opts = {
  mongo: {
    uri: "mongodb://127.0.0.1:27017/ms-test"
	}
}

function test_seneca(fin) {
  return  seneca({log: 'test'})
          .test(fin)
					.use('entity')
					.use('basic')
					.use('mongo-store', opts.mongo)
          .use(msTest, {printFunction: () => {}, pin: pin}) //No printing
}

describe('create crud method', () => {

  it('create sample document and find it with where - it should be ok', (done) => {
    const senecaApp = test_seneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
                  {
                    data: { 
                      sampleId        : 'testId',
                      sampleData      : 'testData',
                      sampleRelatedId : 'relatedTestId'
                    }
                  },
                  (err, result) => {

                    senecaApp.act({ role: 'ms-test', cmd: 'find' },
                                  {
                                    where: { 
                                      sampleId        : 'testId',
                                      sampleRelatedId : 'relatedTestId'
                                    }
                                  },
                                  (err, result) => {
                                    console.log(result)
                                    done()
                                  }
                    )

                  })

  })
})
