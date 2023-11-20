import { EnumAndLiteral } from '../base/common/typescript';
import { StringID } from './common';
import { IBlockStyleDeclaration, IInlineStyleDeclaration } from './style';

export enum NodeType {
  Root = 'root',
  Text = 'text',
  Block = 'block',
  // Image = 'image',
  // Fragment = 'fragment'
}

export interface ITextNodeModel {
  id: StringID;
  type: EnumAndLiteral<NodeType.Text>;
  from: StringID;
  order: string;
  style: IInlineStyleDeclaration;
  content: string;
}

export interface IBlockNodeModel {
  id: StringID;
  type: EnumAndLiteral<NodeType.Block>;
  from: StringID;
  order: string;
  style: IBlockStyleDeclaration;
}

export interface IRootNodeModel {
  id: StringID;
  type: EnumAndLiteral<NodeType.Root>;
}

export type INodeModel = ITextNodeModel | IBlockNodeModel | IRootNodeModel

