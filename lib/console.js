import debugModule from 'debug'
import moment from 'moment'

export function printModule (scope) {

  const debug = debugModule(scope)

  const print = function(string) {

    if(process.env.NODE_ENV == 'production') {
      console.log(moment().format('YYYY/MM/DD HH:mm:ss'), string)
    } else {
      debug(moment().format('YYYY/MM/DD HH:mm:ss'), string)
    }
  }

  return print
}

export default { printModule }