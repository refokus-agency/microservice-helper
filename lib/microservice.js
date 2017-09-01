/**
 *  Microservices pipeline.
 * @module
 */

// NOTE: we need to remove no-labels for this project, try to avoid this kind of fixes
/* eslint-disable no-labels */
import { $pipe, $pipePromise } from './pipePromise'

function _generateState (seneca, msg) {
  const notAllowedKeys = ['caller$', 'meta$', 'plugin$', 'tx$']
  let nMsg = {}

  for (let key in msg) {
    if (notAllowedKeys.indexOf(key) > -1) continue
    nMsg[key] = msg[key]
  }

  return Object.assign({}, {seneca}, nMsg)
}
/**
 * Wrapper function. If all is ok, the result will be { ok : true , data : {result} }
 * When is an error in business logic, the result will be { ok : false, err : Error }.
 * @param {Function} fnc Command function that must be executed.
 * @returns {Object}
 */
export function doFn (fnc) {
  return function (msg, done) {
    const state = _generateState(this, msg)

    let returnData = {}

    tryFnc:
      try {
        const finalState = fnc($pipe, true, state)

        if (!(finalState instanceof $pipePromise)) {
          returnData = {ok: true, data: finalState}
          break tryFnc
        }

        finalState.promise.then(finalState => {
          let ret = {ok: true, data: finalState}

          if (finalState.error) {
            const error = Object.assign({}, finalState.error)
            delete finalState.error
            ret.error = error
          }

          done(null, ret)
        })
          .catch(err => {
            if (process.env.NODE_ENV === 'production' || process.env.DEBUG) console.error(err)
            done(null, {ok: false, error: err})
          })
        return
      } catch (err) {
        returnData = {ok: false, error: err}
      }

    done(null, returnData)
  }
}
