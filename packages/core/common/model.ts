import { StringID } from './common';
import { INodeModel } from './node';

export interface IDocument {
  nodes: Record<StringID, INodeModel>;
}
