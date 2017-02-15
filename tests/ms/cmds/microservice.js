import {modifySampleId, modifySampleIdAgain, modifySampleIdAgain2, modifySampleIdAgainPromise} from './reducers/microservice'

export function cmdFnc ($pipe, $critical, state) {
  return modifySampleId(state)
}

export function cmdFncPromisified ($pipe, $critical, state) {
  return $pipe(modifySampleId, state)
          .debug()
          .then(modifySampleIdAgain, $critical)
          .then(modifySampleIdAgainPromise)
          .debug('modifySampleIdAgainPromise')
          .then(modifySampleIdAgain2)
}

export function cmdFncPromisifiedSilence ($pipe, $critical, state) {

  return $pipe(modifySampleId, state)
          .then(modifySampleIdAgain)
          .then(modifySampleIdAgain2)
    
}
