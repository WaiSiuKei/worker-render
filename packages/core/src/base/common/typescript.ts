export type ValueOf<T> = T[keyof T];
export type EnumToString<T> = T extends `${infer S & string}` ? S : never;
export type EnumValues<T extends string> = ValueOf<{ [K in T]: EnumToString<K> }>;
export type EnumAndLiteral<T extends string> = T | EnumValues<T>;

export type RequiredKeys<T> = {
  [K in keyof T]-?:
  ({} extends { [P in K]: T[K] } ? never : K)
}[keyof T]

// export type Required<T> = {
//   [P in keyof T]-?: T[P]
// }

export type OptionalKeys<T> = {
  [K in keyof T]-?:
  ({} extends { [P in K]: T[K] } ? K : never)
}[keyof T]

export type ExcludeOptionalProps<T> = Pick<T, RequiredKeys<T>>

export type Optional<T> = T | undefined

export type Nullable<T> = T | null

export type Ptr<T> = T | undefined

export type Constructor = new (...args: any[]) => {};

export interface ConstructorSignature<T> {
  new(...args: any[]): T;
}

type Data  = any
interface Result {}
interface DataService {
  cache: Map<string, Data>;
  invalidateCache(): void;
  processData( data: Data ): Promise<Result>;
  compressData( data: Data ): Result;
}

type FilterOutAttributes<Base> = {
  [Key in keyof Base]: Base[Key] extends (...arg: any) => any ? Base[Key] : never;
}
type PromisifyFunction<Function extends (...arg: any) => any> =
  (...args: Parameters<Function>) => Promise<ReturnType<Function>>;

type PromisifyObject<Base extends { [key: string]: (...arg: any) => any }> = {
  [Key in keyof Base]: ReturnType<Base[Key]> extends Promise<any> ?
    Base[Key] :
    PromisifyFunction<Base[Key]>;
}

type DataServicePromisified = PromisifyObject<FilterOutAttributes<DataService>>;
const a: DataServicePromisified = Object.create(null);
a.compressData({}).then(console.log)
