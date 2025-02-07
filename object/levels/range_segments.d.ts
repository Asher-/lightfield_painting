/// <reference path="./range_segment.d.ts" />

declare class RangeSegments {
  in: RangeSegment;
  out: RangeSegment;
  toString() : string;
  duplicate() : RangeSegments;

}
