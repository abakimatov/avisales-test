import * as Comlink from 'comlink'

const remoteFunction = async (callback) => {
  await callback()
}

Comlink.expose(remoteFunction)
