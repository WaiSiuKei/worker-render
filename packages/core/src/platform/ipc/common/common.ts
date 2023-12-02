import { Event } from '../../../base/common/event';

type PromisifyFunction<Function extends (...arg: any) => any> =
  (...args: Parameters<Function>) => Promise<ReturnType<Function>>;

export type Promisified<Base extends { [key: string]: ((...arg: any) => any) | any }> = {
  [Key in keyof Base]: Base[Key] extends Event<any> ? Base[Key] : ReturnType<Base[Key]> extends Promise<any> ?
    Base[Key] :
    PromisifyFunction<Base[Key]>;
}
