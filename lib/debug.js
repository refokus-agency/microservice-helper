/**
 * Debug helper module.
 * @module
 */
import debugModule from 'debug'
import moment from 'moment'
/**
 *
 * @param scope
 * @returns {print}
 */
export function printModule (scope) {
  const debug = debugModule(scope)

  const print = function (string) {
    if (process.env.NODE_ENV !== 'production') {
      debug(moment().format('YYYY/MM/DD HH:mm:ss'), string)
    }
  }

  return print
}
