/// <reference path="../../../segment/layer/adjustment_segment_layer.d.ts" />

import { LayerToken } from './layer_token';

class AdjustmentLayerToken extends LayerToken
{
  adjustment_name?: String;
  method?: Function;

  config?: Object;

  constructor()
  {
   super(); 
   this.requiresSourceLayer = false;
   this.requiresGroup = false;
  }

  initFromActiveLayer(
    segment: Segment
  )
  : SegmentLayer
  {
    let segment_layer = segment.layerConstruction["AdjustmentLayerToken"]( segment, this );
    return segment_layer.initFromActiveLayer();  
  }

}

export { AdjustmentLayerToken };