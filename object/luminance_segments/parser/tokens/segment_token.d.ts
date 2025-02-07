/// <reference path="./layers/art_layer_token.d.ts" />
/// <reference path="./layers/adjustment_layer_token.d.ts" />
/// <reference path="./layers/nested_layer_token.d.ts" />

declare class SegmentToken
{
  number_of_segments?: number;
  segment_size?: number;
  remainder?: number;

  layers?: Array<ArtLayer|NestedLayerToken|AdjustmentLayerToken>;

  merge?: boolean;

  constructor();

  set_number_of_segments( number_of_segments: number );
}