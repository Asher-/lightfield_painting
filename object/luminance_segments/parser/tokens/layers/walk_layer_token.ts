/// <reference path="../../../segment/layer/walk_segment_layer.d.ts" />

import { ArtLayerToken } from './art_layer_token';

import { StartEndToken } from '../start_end_token';

class WalkLayerToken extends ArtLayerToken
{
  start?: StartEndToken = new StartEndToken;
  end?: StartEndToken = new StartEndToken;
  steps?: number;
  step_size?: number;

  constructor()
  {
    super()
  }

  initFromActiveLayer(
    segment: Segment
  )
  : SegmentLayer
  {
    let segment_layer = segment.layerConstruction["WalkLayerToken"]( segment, this );
    return segment_layer.initFromActiveLayer();  
  }

  toString() {
    let details:string[] = [];
    if ( this.start !== undefined ) {
      details.push( "start:" + this.start );
    }
    if ( this.end !== undefined ) {
      details.push( "end:" + this.end );
    }
    if ( this.steps !== undefined ) {
      details.push( "steps:" + this.steps );
    }
    if ( this.step_size !== undefined ) {
      details.push( "step_size:" + this.step_size );
    }
    if ( this.opacity !== undefined ) {
      details.push( "opacity:" + this.opacity );
    }
    if ( this.merge !== undefined ) {
      details.push( "merge:" + this.merge );
    }
    
    let string = "(" + details.join(" ") + ")";
    return string;
  }

}

export { WalkLayerToken, StartEndToken };