/// <reference path="./layer_token.d.ts" />

declare class AdjustmentLayerToken extends LayerToken
{
  brightness?: number;
  contrast?: number;
  method?: Function;

  constructor();

  initFromActiveLayer(
    segment: Segment
  )
  : SegmentLayer;

}
