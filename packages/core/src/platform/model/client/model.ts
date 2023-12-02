import { Promisified } from '../../ipc/common/common';
import { IModelServer } from '../server/model';

export type IModelClient = Promisified<IModelServer>;
