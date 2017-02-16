const errors = require(process.env.PWD + '/errors/index')

export function handle (id, err) {

  let key = id.replace(/^#/, "")

  if (errors[key] == undefined) return handle('unknownError', err)

  let e  = new Error(errors[key])
  e.code = `#${key}`
  if (err) e.stack = err.stack
  if (key === 'unknownError') e.oldError = err

  return e

}