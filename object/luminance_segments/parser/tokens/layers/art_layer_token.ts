/// <reference path="../../../segment/layer/segment_layer.d.ts" />
/// <reference path="../../../segment/layer/art_segment_layer.d.ts" />

import { InOutToken, IOToken } from '../in_out_token';
import { LayerToken } from './layer_token';

class ArtLayerToken extends LayerToken
{
  in?: IOToken;
  out?: IOToken;

  layers?: Array<LayerToken>;

  constructor()
  {
    super();
  }

  initFromActiveLayer(
    segment: Segment
  )
  : SegmentLayer
  {
    let segment_layer = segment.layerConstruction["ArtLayerToken"]( segment, this );
    return segment_layer.initFromActiveLayer();  
  }



}

export { ArtLayerToken };
