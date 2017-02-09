class $pipePromise {

  constructor (fnc, state, critical) {

    this.state   = state
    this.promise = new Promise((resolve, reject) => {
      try {
        const fncCalled = fnc(this.state)

        if (!(fncCalled instanceof Promise)) {
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
}

function $pipe (fnc, state, critical) {
  return new $pipePromise(fnc, state, critical)
}

function _generateState (seneca, msg) {
  const notAllowedKeys = ['caller$', 'meta$', 'plugin$', 'tx$']
  let nMsg             = {}

  for (let key in msg) {
    if (notAllowedKeys.indexOf(key) > -1) continue
    nMsg[key] = msg[key]
  }

  return Object.assign({}, {seneca}, nMsg)
}

export function doFn (fnc) {

  return function (msg, done) {

    const state = _generateState(this, msg)

    let returnData = {}

    tryFnc:
      try {

        const finalState = fnc($pipe, true, state)

        if (!(finalState instanceof $pipePromise)) {
          returnData = {ok : true, data : finalState}
          break tryFnc
        }

        finalState.promise.then(finalState => {
          done(null, {ok : true, data : finalState})
        })
                  .catch(err => {
                    console.error(err)
                    done(null, {ok : false, error : err})
                  })
        return
      } catch (err) {
        returnData = {ok : false, error : err}
      }
    
    done(null, returnData)
  }
}