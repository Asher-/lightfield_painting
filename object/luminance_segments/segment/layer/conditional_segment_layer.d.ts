/// <reference path="./segment_layer.d.ts" />
/// <reference path="../../parser/tokens/layers/conditional_layer_token.d.ts" />

declare class ConditionalSegmentLayer extends SegmentLayer
{
  token: ConditionalLayerToken;
  layers: Array<SegmentLayer>;

  constructor(
    segment: Segment,
    token: ConditionalLayerToken
  );

  initFromActiveLayer()
  : SegmentLayer | undefined;
}
