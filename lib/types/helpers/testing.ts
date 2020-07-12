export type Tester<T> = {
  test: (val: T) => boolean;
};

export type Tested<T> = {
  [P in keyof T]: T[P] extends string ? RegExp | Tester<T[P]> : Tester<T[P]>;
};
