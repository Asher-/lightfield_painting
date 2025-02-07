/// <reference path="../../../segment/layer/conditional_segment_layer.d.ts" />

import { LayerToken } from "./layer_token";
import { ConditionToken } from "../condition_token";

class ConditionalLayerToken extends LayerToken
{
  conditions: Array<ConditionToken> = new Array<ConditionToken>;
  layers?: Array<LayerToken>;

  constructor()
  {
    super();
    this.requiresGroup = false;
  }

  initFromActiveLayer(
    segment: Segment
  )
  : SegmentLayer | undefined
  {
    let segment_layer = segment.layerConstruction["ConditionalLayerToken"]( segment, this );
    return segment_layer.initFromActiveLayer();  
  }

  validateConditions(
    start: number,
    end: number
  ) : boolean
  {
    let validates = true;
    for ( let this_condition_index = 0 ; this_condition_index < this.conditions.length ; ++this_condition_index ) {
      let this_condition = this.conditions[ this_condition_index ];
      validates = this_condition.method( start, end );
      if ( ! validates ) {
        break;
      }
    }
    return validates;
  }
}

export { ConditionalLayerToken };
