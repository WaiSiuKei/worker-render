import { isNumber } from './type';

export function CHECK(condition: unknown, ...msgs: any): asserts condition {
  if (isNumber(condition) ? false : !condition) {
    console.warn('!', ...msgs);
  }
}

export const DCHECK = CHECK
