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
    this.state = _.cloneDeep(state)
    this.promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const fncReturn = fnc(_.cloneDeep(this.state))

          if (!fncReturn || typeof fncReturn.then !== 'function' || typeof fncReturn.catch !== 'function') {
            return this._successHandler(fncReturn, resolve)
          }

          return fncReturn.then(fncState => {
            return this._successHandler(fncState, resolve)
          })
            .catch(error => {
              return this._errorHandler(error, critical, reject, resolve)
            })
        } catch (error) {
          return this._errorHandler(error, critical, reject, resolve)
        }
      })
    })
  }

  _successHandler (nState, resolve) {
    this.state = _.merge(this.state, nState)
    return resolve(this.state)
  }

  _errorHandler (error, critical, reject, resolve) {
    if (critical || this.critical) {
      this.critical = true
      return reject(error)
    }

    if (process.env.NODE_ENV === 'production' || process.env.DEBUG) console.warn(error)

    this.state.error = error
    return resolve(this.state)
  }

  then (fnc, critical) {
    this.promise = this.promise.then((state) => {
      return (new $pipePromise(fnc, state, critical)).promise
    })
      .then(nState => {
        this.state = _.merge(this.state, nState)

        return this.state
      })
      .catch(error => {
        if (critical || this.critical) {
          this.critical = true
          throw error
        }

        if (process.env.NODE_ENV === 'production' || process.env.DEBUG) console.warn(error)
        this.state.error = error
        return this.state
      })

    return this
  }

  use (pipeFnc, critical) {
    return this.then((state) => {
      return pipeFnc($pipe, true, state).promise
    }, critical)
  }

  debug (...params) {
    return this.then((state) => {
      if (params.length === 0) {
        console.dir(state)
        return {}
      }

      for (let param of params) {
        console.dir(_.get(state, param))
      }
      return {}
    })
  }

  finally (fnc) {
    let err

    this.promise = this.promise.catch((error) => {
      err = error
      return error
    }).then(() => {
      return (new $pipePromise(fnc, this.state, true)).promise
        .then(() => {
          if (err) throw err

          return this.state
        })
    })

    return this
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
