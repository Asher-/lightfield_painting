import { ArtLayerToken } from "./layers/art_layer_token";
import { AdjustmentLayerToken } from "./layers/adjustment_layer_token";
import { NestedLayerToken } from "./layers/nested_layer_token";

class SegmentToken
{
  number_of_segments?: number;
  segment_size?: number;
  remainder?: number;

  layers?: Array<ArtLayerToken|NestedLayerToken|AdjustmentLayerToken>;

  merge?: boolean;

  constructor()
  {
    
  }

  set_number_of_segments( number_of_segments: number )
  {
    this.number_of_segments = number_of_segments;
    this.segment_size = Math.floor( 255 / this.number_of_segments );
    this.remainder = 255 % this.number_of_segments;
  }
}

export { SegmentToken };
