/**
 *  Microservices pipeline.
 * @module
 */

// NOTE: we need to remove no-labels for this project, try to avoid this kind of fixes
/* eslint-disable no-labels */

import { printModule } from './debug'

class $pipePromise {

  /**
   * Basic Promise object that is transported across de pipeline
   * @param {Function} fnc - Function to execute in the pipeline
   * @param {Object} state - Current state of the App
   * @param {boolean} [critical] - When $critical is present, an exception stop de pipe execution
   */
  constructor (fnc, state, critical) {
    this.state = state
    this.promise = new Promise((resolve, reject) => {
      try {
        const fncCalled = fnc(this.state)

        if (!(typeof fncCalled.then === 'function')) {
          return this._successHandler(fncCalled, resolve)
        }

        return fncCalled.then(fncState => {
          return this._successHandler(fncState, resolve)
        })
          .catch(error => {
            return this._errorHandler(error, critical, reject, resolve)
          })
      } catch (error) {
        return this._errorHandler(error, critical, reject, resolve)
      }
    })
  }

  _successHandler (nState, resolve) {
    this.state = Object.assign({}, this.state, nState)
    return resolve(this.state)
  }

  _errorHandler (error, critical, reject, resolve) {
    if (critical || this.critical) {
      this.critical = true
      return reject(error)
    }
    console.warn(error)
    this.state = Object.assign({}, this.state, {error})
    return resolve(this.state)
  }

  then (fnc, critical) {
    this.promise = this.promise.then(fnc)
      .then(nState => {
        this.state = Object.assign({}, this.state, nState)

        return this.state
      })
      .catch(error => {
        if (critical || this.critical) {
          this.critical = true
          throw error
        }
        console.warn(error)
        this.state = Object.assign({}, this.state, {error})
        return this.state
      })

    return this
  }

  debug (scope = 'default') {
    return this.then(printModule(scope))
  }
}
/**
 *
 * @param {Function} fnc Function to execute in the pipeline.
 * @param {Object} state Current state of the App.
 * @param {boolean} [critical] When $critical is present, an exception stop de pipe execution.
 * @returns {$pipePromise}
 */
function $pipe (fnc, state, critical) {
  return new $pipePromise(fnc, state, critical)
}

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
          done(null, {ok: true, data: finalState})
        })
          .catch(err => {
            console.error(err)
            done(null, {ok: false, error: err})
          })
        return
      } catch (err) {
        returnData = {ok: false, error: err}
      }

    done(null, returnData)
  }
}
