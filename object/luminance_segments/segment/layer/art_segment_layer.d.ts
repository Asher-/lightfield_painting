/// <reference path="./segment_layer.d.ts" />

/// <reference path="../../../levels/range_segment.d.ts" />
/// <reference path="../../../levels/range_segments.d.ts" />

/// <reference path="../../parser/tokens/layers/art_layer_token.d.ts" />

declare class ArtSegmentLayer extends SegmentLayer
{
  token: ArtLayerToken;

  range: RangeSegment;
  gamma: InOut;

  blendIfGroup: LayerSet;
  input: ArtLayer;
  output: ArtLayer;

  constructor(
    Segment: Segment,
    token: ArtLayerToken
  );

  initFromActiveLayer(
    should_init_source_layer: boolean = true
  ) 
  : SegmentLayer;
  
  duplicate(
    reference?: SegmentLayer,
    placement?: ElementPlacement
  );

  updateLayerNames();
  updateInputLayerNames();
  updateOutputLayerNames();

}
