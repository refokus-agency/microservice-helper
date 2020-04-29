/**
 *  Microservices pipeline.
 * @module
 */

// NOTE: we need to remove no-labels for this project, try to avoid this kind of fixes
/* eslint-disable no-labels */
import { $pipe, $pipePromise } from './pipePromise'
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node'

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

/**
 * Returns a function that when called it gets all kubernetes pods
 * with names matching 'grm-seneca' and return its IPs
 * Seneca uses that to discover the seneca bases of the mesh
 * @function serviceDiscovery
 * @param {String} namespace kubernetes namespace where to find the pods
 * @returns {Function}
 */
export function serviceDiscovery(namespace) {
  return async function serviceDiscovery(seneca, options, bases, next) {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(CoreV1Api);
  
    try {
      const {body: {items}} = await k8sApi.listNamespacedPod(namespace)
  
      const servicesIps = items.reduce((accum, {metadata: {name}, status: {podIP}}) => {
        if (name.match(/grm-seneca/i)) {
          const ip = `${podIP}:39999`
          console.log(`Adding service ${name} with IP ${ip}`)
          accum.push(ip)
        }
        return accum
      }, [])
  
      return next(servicesIps)
    } catch(error) {
      throw new Error(error)
    }
  }
}

/**
 * Meant to be used as an express get route it receives the usual params
 * and sends status code 500 if the microservice cannot find the mesh
 * @function senecaLivenessCheck
 */
export const senecaLivenessCheck = (req, res) => {
  this.act('role:mesh, get:members', (err, data) => {
    if(err){
      return res.status(500).send()
    }
    const base = data.list.find(ms => typeof ms.pin === 'string' && ms.pin.match(/role:mesh/) || ms.pin[0].match(/role:mesh/))
    if(!base){
      return res.status(500).send()
    }
    res.send('ok')
  })
}