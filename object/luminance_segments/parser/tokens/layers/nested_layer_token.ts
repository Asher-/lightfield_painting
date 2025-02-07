/// <reference path="../../../segment/layer/nested_segment_layer.d.ts" />

import { LayerToken } from './layer_token';

class NestedLayerToken extends LayerToken
{
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
    let segment_layer = segment.layerConstruction["NestedLayerToken"]( segment, this );
    return segment_layer.initFromActiveLayer();  
  }

}

export { NestedLayerToken };
