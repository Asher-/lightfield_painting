/// <reference path="../../../levels/in_out.d.ts" />
/// <reference path="../../../levels/range_segments.d.ts" />

/// <reference path="./walk_segment_layer.d.ts" />
/// <reference path="./nested_segment_layer.d.ts" />
/// <reference path="./art_segment_layer.d.ts" />

/// <reference path="../segment.d.ts" />

/// <reference path="../../parser/tokens/layers/layer_token.d.ts" />
/// <reference path="../../parser/tokens/layers/art_layer_token.d.ts" />
/// <reference path="../../parser/tokens/layers/nested_layer_token.d.ts" />
/// <reference path="../../parser/tokens/layers/adjustment_layer_token.d.ts" />

declare class SegmentLayer
{
  segment: Segment;
  token: LayerToken;
  source: ArtLayer;

  group?: LayerSet;
  layer?: ArtLayer;

  opacity: number;

  constructor( 
    segment: Segment,
    token: LayerToken
  );

  initFromActiveLayer() : SegmentLayer | undefined;
  initFromActiveLayerWithGroup() : SegmentLayer | undefined;
  initFromActiveLayerWithoutGroup() : SegmentLayer | undefined;

  updateOpacity(
    opacity?:number
  );
  referenceLayer()
  : LayerSet | ArtLayer;
  mergeIfRequired();

}
