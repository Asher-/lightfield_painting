/// <reference path="./layer_token.d.ts" />
/// <reference path="../in_out_token.d.ts" />
/// <reference path="./walk_layer_token.d.ts" />

declare class ArtLayerToken extends LayerToken
{
  in?: IOToken;
  out?: IOToken;

  constructor();

  initFromActiveLayer(
    segment: Segment
  )
  : SegmentLayer;
  

}
