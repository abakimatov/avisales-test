import * as Comlink from 'comlink'
import Worker from './runner.worker'

export const transformService = Comlink.wrap(new Worker())
