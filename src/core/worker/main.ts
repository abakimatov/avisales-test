import * as Comlink from 'comlink'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./transform-service.worker'

import { TransformService } from '../typings/worker'

export const transformService: TransformService = Comlink.wrap(new Worker())
