/// <reference path="./segment_layer.d.ts" />
/// <reference path="../../parser/tokens/layers/nested_layer_token.d.ts" />

declare class NestedSegmentLayer extends SegmentLayer
{
  token: NestedLayerToken;
  layers: Array<SegmentLayer>;

  constructor(
    Segment: Segment,
    token: NestedLayerToken
  );
  initFromActiveLayer() : SegmentLayer;
}
