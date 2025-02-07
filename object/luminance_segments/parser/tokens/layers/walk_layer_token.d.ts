/// <reference path="./art_layer_token.d.ts" />

/// <reference path="../start_end_token.d.ts" />

declare class WalkLayerToken extends ArtLayerToken
{
  start?: StartEndToken;
  end?: StartEndToken;
  steps?: number;
  step_size?: number;

  constructor();

  initFromActiveLayer(
    segment: Segment
  )
  : SegmentLayer;

}
