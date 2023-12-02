import { Promisified } from '../../ipc/common/common';
import { IRenderServer } from '../server/render';

export type IRenderClient = Promisified<IRenderServer>;
