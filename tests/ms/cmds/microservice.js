import {
  modifySampleId,
  modifySampleIdAgain,
  modifySampleIdAgain2,
  modifySampleIdAgainPromise
} from './reducers/microservice'

export function cmdFnc ($pipe, $critical, state) {
  return modifySampleId(state)
}

export function cmdFncPromisified ($pipe, $critical, state) {
  return $pipe(modifySampleId, state)
    .then(modifySampleIdAgain, $critical)
    .then(modifySampleIdAgainPromise)
    .then(modifySampleIdAgain2)
    .finally(() => { global._doFinally('finally'); return {finally: true} })
    .return('sampleId')
}

export function cmdFncPromisifiedSilence2 ($pipe, $critical, state) {
  return $pipe(modifySampleIdAgain2, state)
}

export function cmdFncPromisifiedSilence ($pipe, $critical, state) {
  return $pipe(modifySampleId, state)
    .then(modifySampleIdAgain)
    .use(cmdFncPromisifiedSilence2)
    .return('sampleId')
}

export function cmdFncPromiseReturnNone ($pipe, $critical, state) {
  return $pipe(modifySampleId, state)
    .then(modifySampleIdAgain)
    .use(cmdFncPromisified)
    .return()
}

export function cmdFncPromisifiedIf ($pipe, $critical, state) {
  return $pipe(modifySampleId, state)
    .if(({condition}) => condition, modifySampleIdAgain2, modifySampleIdAgain)
    .finally(() => { global._doFinally('finally'); return {finally: true} })
    .return('sampleId')
}
