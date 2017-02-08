export function cmdFnc ($pipe, $critical, {sampleId}) {
  if (!sampleId) throw new Error('missing param')

  return {sampleId}
}

export function cmdFncPromisified ($pipe, $critical, {sampleId}) {
  return new Promise((resolve, reject) => {
    if (!sampleId) return reject(new Error('missing param'))

    resolve({sampleId})
  })
}