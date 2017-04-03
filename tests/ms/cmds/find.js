import * as r from './reducers/find'
import { populateField } from './reducers/populate'

export function find (msg, done) {
  let seneca = this

  const bundle = { where: msg.where }

  const state = {
    seneca: seneca,
    bundle: bundle
  }

  r.findBySampleRelatedId(state)
   .then(result => done(null, {ok: true, data: result}))
}

export function findOne (msg, done) {
  let seneca = this

  const bundle = { where: msg.where }

  const state = {
    seneca: seneca,
    bundle: bundle
  }

  r.findBySampleIdAndSampleRelatedId(state)
  .then(result => done(null, {ok: true, data: result}))
}

export function findOr (msg, done) {
  let seneca = this

  const bundle = { where: msg.where }

  const state = {
    seneca: seneca,
    bundle: bundle
  }

  r.findBySampleIdWithOrSelect(state)
  .then(result => done(null, {ok: true, data: result}))
}

export function findAndPopulate (msg, done) {
  let seneca = this

  const bundle = { where: msg.where }

  const state = {
    seneca: seneca,
    bundle: bundle
  }

  r.findBySampleIdAndSampleRelatedId(state)
  .then(populateField)
  .then(result => done(null, {ok: true, data: result}))
}
