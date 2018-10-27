interface Array<T> {
  from(arrayLike: any, mapFn?, thisArg?): Array<any>;
  find(predicate: (search: T) => boolean) : T;
}
