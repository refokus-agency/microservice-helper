/**
 * Debug helper module.
 * @module
 */
import debugModule from 'debug'
import moment from 'moment'
/**
 *
 * @param scope - Scope to be added to the print function.
 * @returns {Function} Pretty print function.
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
