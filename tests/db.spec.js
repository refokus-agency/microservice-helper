/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai'

import * as dbHelpers from '../lib/db'
import Joi from 'joi'
import JoiObjectIdModule from 'joi-objectid'

const JoiObjectId = JoiObjectIdModule(Joi)

import seneca from 'seneca'
import msTest from './ms/'

const tag = 'ms-test'
const pin = `role:${tag}`

const opts = {
  mongo: {
    uri: 'mongodb://127.0.0.1:27017/ms-test'
  }
}

function testSeneca (fin) {
  return seneca({log: 'test'})
          .test(fin)
          .use('entity')
.use('basic')
.use('mongo-store', opts.mongo)
.use(msTest, {printFunction: () => {}, pin: pin}) // No printing
}

describe('db helpers testing', () => {
  it('create sample document  - it should be ok', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
      {
        data: {
          sampleId: 'testId1',
          sampleData: 'testData1',
          sampleRelatedId: 'relatedId'
        }
      },
                  (err, result) => {
                    if (err) return done(err)
                    expect(result.ok).to.be.true
                    done()
                  }
    )
  })

  it('create sample document and find it with where - it should be ok', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
      {
        data: {
          sampleId: 'testId2',
          sampleData: 'testData2',
          sampleRelatedId: 'relatedId'
        }
      },
                  (err, result) => {
                    if (err) return done(err)
                    senecaApp.act({ role: 'ms-test', cmd: 'find', action: 'findOne' },
                      {
                        where: {
                          sampleId: 'testId2',
                          sampleRelatedId: 'relatedId'
                        }
                      },
                                  (err, result) => {
                                    if (err) return done(err)
                                    expect(result.ok).to.be.true
                                    expect(result.data.data).to.be.object
                                    done()
                                  }
                    )
                  })
  })

  it('create sample document and find an array with where - it should be ok', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
      {
        data: {
          sampleId: 'testId3',
          sampleData: 'testData3',
          sampleRelatedId: 'relatedId'
        }
      },
                  (err, result) => {
                    if (err) return done(err)
                    senecaApp.act({ role: 'ms-test', cmd: 'find' },
                      {
                        where: {
                          sampleRelatedId: 'relatedId'
                        }
                      },
                                  (err, result) => {
                                    if (err) return done(err)
                                    expect(result.ok).to.be.true
                                    expect(result.data.data).to.be.array
                                    done()
                                  }
                    )
                  })
  })

  it('find with or select - it should be ok', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'find', action: 'findOr' },
      {
        where: {
          or$: [
            {
              sampleId: 'testId1'
            },
            {
              sampleData: 'testData2'
            }
          ]
        }
      },
                  (err, result) => {
                    if (err) return done(err)
                    expect(result.ok).to.be.true

                    done()
                  }
    )
  })

  it('find with or select (limit and skip)  - it should be ok', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'find', action: 'findOr' },
      {
        where: {
          or$: [
            {
              sampleId: 'testId1'
            },
            {
              sampleData: 'testData2'
            }
          ],
          limit$: 1,
          skip$: 1
        }
      },
      (err, result) => {
        if (err) return done(err)
        expect(result.ok).to.be.true
        expect(result.data.data.length)
          .to
          .be
          .equal(1)
        expect(result.data.data[0].sampleId)
          .to
          .be
          .equal('testId2')
        done()
      }
    )
  })

  it('find with or select (sort)  - it should be ok', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'find', action: 'findOr' },
      {
        where: {
          or$: [
            {
              sampleId: 'testId1'
            },
            {
              sampleData: 'testData2'
            },
            {
              sampleId: 'testId3'
            }
          ],
          sort$: {sampleId: -1}
        }
      },
      (err, result) => {
        if (err) return done(err)

        expect(result.ok).to.be.true
        expect(result.data.data.length)
          .to
          .be
          .equal(3)
        expect(result.data.data[0].sampleId)
          .to
          .be
          .equal('testId3')
        done()
      }
    )
  })

  it('create sample document and update it - it should be ok', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
      {
        data: {
          sampleId: 'testId3',
          sampleData: 'testData3',
          sampleRelatedId: 'relatedId'
        }
      },
                  (err, result) => {
                    if (err) return done(err)
                    senecaApp.act({ role: 'ms-test', cmd: 'update', action: 'updateBy' },
                      {
                        where: {
                          sampleId: 'testId3'
                        },
                        sampleData: 'newTestData3'
                      },
                                  (err, result) => {
                                    if (err) return done(err)
                                    expect(result.ok).to.be.true
                                    done()
                                  }
                    )
                  }
    )
  })

  it('create sample document and update multiple fields - it should be ok', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
      {
        data: {
          sampleId: 'testId4',
          sampleData: 'testData4',
          extraDataField: 'extraDataField4',
          sampleRelatedId: 'relatedId'
        }
      },
                  (err, result) => {
                    if (err) return done(err)
                    senecaApp.act({ role: 'ms-test', cmd: 'update', action: 'updateMultipleFieldsBy' },
                      {
                        where: {
                          sampleId: 'testId4'
                        },
                        update: {
                          sampleData: 'newTestData4',
                          extraDataField: 'newExtraDataField4'
                        }
                      },
                                  (err, result) => {
                                    if (err) return done(err)
                                    expect(result.ok).to.be.true
                                    done()
                                  }
                    )
                  }
    )
  })

  it('create sample document, find it and populate it - it should be ok', (done) => {
    let correlatedIds = []

    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
      {
        data: {
          sampleId: 'testId5',
          sampleData: 'testData5',
          extraDataField: 'extraDataField5',
          sampleRelatedId: 'relatedId'
        }
      },
                  (err, result) => {
                    if (err) return done(err)
                    correlatedIds.push(result.data.data.id)
                    senecaApp.act({ role: 'ms-test', cmd: 'create' },
                      {
                        data: {
                          sampleId: 'testId6',
                          sampleData: 'testData6',
                          extraDataField: 'extraDataField6',
                          sampleRelatedId: 'relatedId'
                        }
                      },
                                  (err, result) => {
                                    if (err) return done(err)
                                    correlatedIds.push(result.data.data.id)
                                    senecaApp.act({ role: 'ms-test', cmd: 'create' },
                                      {
                                        data: {
                                          sampleId: 'testId7',
                                          sampleData: 'testData7',
                                          extraDataField: 'extraDataField7',
                                          sampleRelatedId: 'relatedId',
                                          relatedFields: correlatedIds
                                        }
                                      },
                                                  (err, result) => {
                                                    if (err) return done(err)
                                                    senecaApp.act({ role: 'ms-test', cmd: 'find', action: 'findAndPopulate' },
                                                      {
                                                        where: {
                                                          sampleId: 'testId7',
                                                          sampleRelatedId: 'relatedId'
                                                        }
                                                      },
                                                                    (err, result) => {
                                                                      if (err) return done(err)
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
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'create' },
      {
        data: {
          sampleId: 'testId8',
          sampleData: 'testData8',
          sampleRelatedId: 'relatedId'
        }
      },
                  (err, result) => {
                    if (err) return done(err)
                    senecaApp.act({ role: 'ms-test', cmd: 'remove' },
                      {
                        sampleId: 'testId8'
                      },
                                  (err, result) => {
                                    if (err) return done(err)
                                    expect(result.ok).to.be.true
                                    done()
                                  }
                    )
                  }
    )
  })

  it('remove all elements that match - it should be ok', (done) => {
    const senecaApp = testSeneca(done)
    senecaApp.act({ role: 'ms-test', cmd: 'remove', action: 'removeMany' },
      {
        sampleRelatedId: 'relatedId'
      },
                                  (err, result) => {
                                    if (err) return done(err)
                                    expect(result.ok).to.be.true
                                    done()
                                  }
    )
  })

  it('create a valid ObjectId', (done) => {
    const objectId = dbHelpers.mongoObjectId()
    Joi.validate(objectId, JoiObjectId(), (err) => {
      expect(err).to.not.exist
      done()
    })
  })
})
