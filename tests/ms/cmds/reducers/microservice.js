export function modifySampleId ({sampleId}) {
  if (!sampleId) throw new Error('missing param')

  sampleId = "newId"

  return {sampleId}
}

export function modifySampleIdAgain ({sampleId}) {
  if (!sampleId) throw new Error('missing param2')

  sampleId = "newId2"

  return {sampleId}
}

export function modifySampleIdAgain2 ({sampleId}) {

  sampleId = "newId3"

  return {sampleId}
}

export function modifySampleIdAgainPromise ({sampleId}) {

  let p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({sampleId})
    }, 500)
  })

  return p.then(() => {return {sampleId: 'newId4'} })
}