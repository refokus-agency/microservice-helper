import root from 'app-root-path'

const errors = require(`${root}/errors`)

export function handle (id, err) {

  let key = id.replace(/^#/, "")

  if (errors[key] == undefined) return handle('unknownError', err)

  let e  = new Error(errors[key])
  e.code = `#${key}`

  if (err) {

    e.stack = err.stack

    if (err.isJoi) {
      handleJoi(err, e)
    } else {
      e.oldError = err
    }
  }

  return e
}

function handleJoi (joiError, e) {
  e.badParams       = []
  e.receivedMessage = joiError._object
  joiError.details.forEach((detail) => {

    e.badParams.push(
      {
        key  : detail.path,
        msg  : detail.message,
        type : detail.type
      })
  })
}

