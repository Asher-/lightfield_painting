/// <reference path="./layer_token.d.ts" />

declare class NestedLayerToken extends LayerToken
{
  layers?: Array<LayerToken>;

  constructor();

  initFromActiveLayer(
    segment: Segment
  )
  : SegmentLayer;

}
