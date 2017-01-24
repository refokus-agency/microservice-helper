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

describe('db helpers testing', () => {

  it('create sample document  - it should be ok', (done) => {
    const senecaApp = test_seneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
                  {
                    data: { 
                      sampleId        : 'testId1',
                      sampleData      : 'testData1',
                      sampleRelatedId : 'relatedId'
                    }
                  },
                  (err, result) => {
                    expect(result.ok).to.be.true
                    done()
                  }
    )
  })


  it('create sample document and find it with where - it should be ok', (done) => {
    const senecaApp = test_seneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
                  {
                    data: { 
                      sampleId        : 'testId2',
                      sampleData      : 'testData2',
                      sampleRelatedId : 'relatedId'
                    }
                  },
                  (err, result) => {

                    senecaApp.act({ role: 'ms-test', cmd: 'find' },
                                  {
                                    where: { 
                                      sampleId        : 'testId2',
                                      sampleRelatedId : 'relatedId'
                                    }
                                  },
                                  (err, result) => {
                                    expect(result.ok).to.be.true
                                    done()
                                  }
                    )
                  })
  })

  it('find with or select - it should be ok', (done) => {
    const senecaApp = test_seneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'find', action: 'findOr' },
                  {
                    where: { 
                      $or: [
                        { 
                          sampleId        : 'inexistentTestId1'
                          //sampleId        : 'testId1',
                        },
                        {
                          //sampleRelatedId : 'relatedTestId1'
                          sampleRelatedId : 'inexistentRelatedTestId1'
                        }
                      ]
                    }
                  },
                  (err, result) => {
                    expect(result.ok).to.be.true
                    done()
                  }
    )
  })

  it('create sample document and update it - it should be ok', (done) => {
    const senecaApp = test_seneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
                  {
                    data: { 
                      sampleId        : 'testId3',
                      sampleData      : 'testData3',
                      sampleRelatedId : 'relatedId'
                    }
                  },
                  (err, result) => {

                    senecaApp.act({ role: 'ms-test', cmd: 'update', action: 'updateBy'},
                                  {
                                    where: {
                                      sampleId        : 'testId3'
                                    },
                                    sampleData: 'newTestData3'
                                  },
                                  (err, result) => {
                                    expect(result.ok).to.be.true
                                    done()
                                  }
                    )

                  }
    )
  })

  
  it('create sample document and update multiple fields - it should be ok', (done) => {
    const senecaApp = test_seneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
                  {
                    data: { 
                      sampleId        : 'testId4',
                      sampleData      : 'testData4',
                      extraDataField  : 'extraDataField4',
                      sampleRelatedId : 'relatedId'
                    }
                  },
                  (err, result) => {

                    senecaApp.act({ role: 'ms-test', cmd: 'update', action: 'updateMultipleFieldsBy'},
                                  {
                                    where: {
                                      sampleId        : 'testId4'
                                    },
                                    update: {
                                      sampleData: 'newTestData4',
                                      extraDataField: 'newExtraDataField4'
                                    }
                                  },
                                  (err, result) => {
                                    expect(result.ok).to.be.true
                                    done()
                                  }
                    )

                  }
    )
  })

  it('create sample document, find it and populate it - it should be ok', (done) => {
    let correlatedIds = []

    const senecaApp = test_seneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
                  {
                    data: { 
                      sampleId        : 'testId5',
                      sampleData      : 'testData5',
                      extraDataField  : 'extraDataField5',
                      sampleRelatedId : 'relatedId',
                    }
                  },
                  (err, result) => {

                    correlatedIds.push(result.data.data.id)
                    senecaApp.act({ role: 'ms-test', cmd: 'create' },
                                  {
                                    data: { 
                                      sampleId        : 'testId6',
                                      sampleData      : 'testData6',
                                      extraDataField  : 'extraDataField6',
                                      sampleRelatedId : 'relatedId',
                                    }
                                  },
                                  (err, result) => {

                                    correlatedIds.push(result.data.data.id)
                                    senecaApp.act({ role: 'ms-test', cmd: 'create' },
                                                  {
                                                    data: { 
                                                      sampleId        : 'testId7',
                                                      sampleData      : 'testData7',
                                                      extraDataField  : 'extraDataField7',
                                                      sampleRelatedId : 'relatedId',
                                                      relatedFields   : correlatedIds
                                                    }
                                                  },
                                                  (err, result) => {
                                                      senecaApp.act({ role: 'ms-test', cmd: 'find', action: 'findAndPopulate' },
                                                                    {
                                                                      where: { 
                                                                        sampleId        : 'testId7',
                                                                        sampleRelatedId : 'relatedId'
                                                                      }
                                                                    },
                                                                    (err, result) => {
                                                                      expect(result.ok).to.be.true
                                                                      done()
                                                                    }
                                                      )
                                                  }
                                    )
                                  }
                    )
                  }
    )
  })

  it('create sample document and remove it - it should be ok', (done) => {
    const senecaApp = test_seneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
                  {
                    data: { 
                      sampleId        : 'testId8',
                      sampleData      : 'testData8',
                      sampleRelatedId : 'relatedId'
                    }
                  },
                  (err, result) => {

                    senecaApp.act({ role: 'ms-test', cmd: 'remove' },
                                  {
                                    sampleId        : 'testId8'
                                  },
                                  (err, result) => {
                                    expect(result.ok).to.be.true
                                    done()
                                  }
                    )
                  }
    )
  })

  it('remove all elements that match - it should be ok', (done) => {
    const senecaApp = test_seneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'remove', action: 'removeMany' },
                                  {
                                    sampleRelatedId : 'relatedId'
                                  },
                                  (err, result) => {
                                    expect(result.ok).to.be.true
                                    done()
                                  }
    )
   })
})
