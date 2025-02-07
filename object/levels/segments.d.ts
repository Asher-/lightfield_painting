/// <reference path="./segment.d.ts" />

declare class Segments {
  in: Segment;
  out: Segment;
  toString() : string;
  duplicate() : Segments;

}
