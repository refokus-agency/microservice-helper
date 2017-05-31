/**
 *  $pipePromise.
 * @module
 */
import _ from 'lodash'

export class $pipePromise {
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
        const fncCalled = fnc(_.cloneDeep(this.state))

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
    this.state = _.merge(this.state, nState)
    return resolve(_.cloneDeep(this.state))
  }

  _errorHandler (error, critical, reject, resolve) {
    if (critical || this.critical) {
      this.critical = true
      return reject(error)
    }

    if (process.env.NODE_ENV === 'production' || process.env.DEBUG) console.warn(error)

    this.state.error = error
    return resolve(_.cloneDeep(this.state))
  }

  then (fnc, critical) {
    this.promise = this.promise.then(fnc)
      .then(nState => {
        this.state = _.merge(this.state, nState)

        return _.cloneDeep(this.state)
      })
      .catch(error => {
        if (critical || this.critical) {
          this.critical = true
          throw error
        }

        if (process.env.NODE_ENV === 'production' || process.env.DEBUG) console.warn(error)
        this.state.error = error
        return _.cloneDeep(this.state)
      })

    return this
  }

  use (pipeFnc, critical) {
    return this.then((state) => {
      return pipeFnc($pipe, true, state)
    }, critical)
  }

  debug (...params) {
    return this.then((state) => {
      for (let param of params) {
        console.dir(state[param])
      }
      return {}
    })
  }
}

/**
 *
 * @param {Function} fnc Function to execute in the pipeline.
 * @param {Object} state Current state of the App.
 * @param {boolean} [critical] When $critical is present, an exception stop de pipe execution.
 * @returns {$pipePromise}
 */
export function $pipe (fnc, state, critical) {
  return new $pipePromise(fnc, state, critical)
}
