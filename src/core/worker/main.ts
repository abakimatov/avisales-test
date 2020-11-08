import * as Comlink from 'comlink'
/* eslint-disable */
import Worker from 'worker-loader!./transform-service.worker'

import { TransformService } from '../typings/worker'

export const transformService: TransformService = Comlink.wrap(new Worker())
