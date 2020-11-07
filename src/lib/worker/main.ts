import * as Comlink from 'comlink'
import Worker from 'worker-loader!./worker'

export const runInWorker = async (callback) => {
  const remoteFunction = Comlink.wrap(new Worker())
  //@ts-ignore
  await remoteFunction(Comlink.proxy(callback))
}
