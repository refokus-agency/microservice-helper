import root from 'app-root-path'

const errors = require(`${root}/errors`)

export function handle (id, err) {

  let key = id.replace(/^#/, "")

  if (errors[key] == undefined) return handle('unknownError', err)

  let e  = new Error(errors[key])
  e.code = `#${key}`

  if (err) {
    e.stack = err.stack
    e.oldError = err
  }

  return e

}