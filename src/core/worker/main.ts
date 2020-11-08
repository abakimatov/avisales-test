import * as Comlink from 'comlink'
/* eslint-disable */
import Worker from 'worker-loader!./runner.worker'
import { TransformService } from './types'

export const transformService: TransformService = Comlink.wrap(new Worker())
