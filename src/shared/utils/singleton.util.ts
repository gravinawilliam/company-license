/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
export function Singleton<T>() {
  return class Singleton {
    static instance: T; // using native private fields

    protected constructor() {}

    public static getInstance(): T {
      if (!this.instance) this.instance = new this() as T;

      return this.instance;
    }
  };
}
