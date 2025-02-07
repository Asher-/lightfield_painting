/// <reference path="layer/segment_layer.d.ts" />
/// <reference path="../parser/tokens/segment_token.d.ts" />
/// <reference path="../../levels/range_segment.d.ts" />

declare class Segment {
  token: SegmentToken;
  group: LayerSet;
  source: ArtLayer;

  layers: Array<SegmentLayer>;

  number: number;
  range: RangeSegment;

  layerConstruction:Object

}