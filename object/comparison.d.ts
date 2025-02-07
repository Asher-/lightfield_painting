
declare class Comparison {
  less_than?: number;
  greater_than?: number;
  equal_to: boolean;
  compare( compare_to: number ) : boolean;
  toString();
}
