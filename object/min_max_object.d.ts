/// <reference path="./comparison.d.ts" />

declare class MinMax {
  min: Comparison;
  max: Comparison;
  constructor(
    min?: Comparison,
    max?: Comparison
  );
}
