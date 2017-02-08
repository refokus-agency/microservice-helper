function doPipeFunction (state) {
  return function pipe (fnc) {

  }
}

function criticalError (err) {
  throw err
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

export function doFn (fnc) {

  return function (msg, done) {

    const state = _generateState(this, msg)

    let returnData = {}

    tryFnc:
      try {
        const finalState = fnc(doPipeFunction(state), criticalError, state)

        if(!(finalState instanceof Promise)) {
          returnData = {ok : true, data : finalState}
          break tryFnc
        }

        finalState.then(finalState => {
          done(null, {ok : true, data : finalState})
        })
          .catch(err => {
            done(null, {ok : false, error : err})
          })
        return
      } catch (err) {
        returnData = {ok : false, error : err}
      }

    done(null, returnData)
  }
}