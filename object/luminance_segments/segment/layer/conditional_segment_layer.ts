/// <reference path="./segment_layer.d.ts" />

import { helper as ps } from '../../../../helper';

import { ConditionalLayerToken } from '../../parser/tokens/layers/conditional_layer_token';

import { SegmentLayer } from './segment_layer';

class ConditionalSegmentLayer extends SegmentLayer
{
  declare token: ConditionalLayerToken;
  layers: Array<SegmentLayer> = new Array<SegmentLayer>;

  constructor(
    segment: Segment,
    token: ConditionalLayerToken
  )
  {
    super( segment, token );
  }

  initFromActiveLayer()
  : SegmentLayer | undefined
  {
    if ( this.token.validateConditions( this.segment.range.start, this.segment.range.end ) ) {
      super.initFromActiveLayer();
      if ( this.token.layers ) {
        for ( let this_index = this.token.layers.length - 1 ; this_index >= 0 ; --this_index ) {
          let this_layer_token = this.token.layers[ this_index ];
          let this_layer = this_layer_token.initFromActiveLayer( this.segment );
          if ( this_layer !== undefined ) {
            this.layers.push( this_layer );
          }
        }
        return ( this.layers.length > 0 ) ? this : undefined;
      }
      return undefined;
    }
    else {
      return undefined;
    }
  }

}

export { ConditionalSegmentLayer };
