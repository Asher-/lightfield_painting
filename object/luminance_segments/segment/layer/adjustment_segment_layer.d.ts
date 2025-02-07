/// <reference path="./segment_layer.d.ts" />
/// <reference path="../../parser/tokens/layers/adjustment_layer_token.d.ts" />

declare class AdjustmentSegmentLayer
{
  token: AdjustmentLayerToken;
  adjustmentLayer: ArtLayer;

  constructor(
    segment: Segment,
    token: AdjustmentLayerToken
  );
  initFromActiveLayer() : SegmentLayer;

}
