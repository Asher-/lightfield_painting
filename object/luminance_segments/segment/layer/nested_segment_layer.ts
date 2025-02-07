
import { helper as ps } from '../../../../helper';

import { SegmentLayer } from './segment_layer';

import { NestedLayerToken } from '../../parser/tokens/layers/nested_layer_token';

class NestedSegmentLayer extends SegmentLayer
{
  token: NestedLayerToken;
  layers: Array<SegmentLayer> = new Array<SegmentLayer>;

  constructor(
    segment: Segment,
    token: NestedLayerToken
  )
  {
    super( segment, token );
  }

  initFromActiveLayer() 
  : SegmentLayer
  {
    super.initFromActiveLayer();
    this.group.name = "NESTED " + this.token.blendMode;
    if ( this.token.layers ) {
      for ( let index = this.token.layers.length - 1 ; index >= 0 ; --index ) {
        let this_layer_token = this.token.layers[ index ];
        let this_layer = this_layer_token.initFromActiveLayer( this.segment );
        if ( this_layer !== undefined ) {
          app.activeDocument.activeLayer = this_layer.referenceLayer();
          this.layers.push( this_layer );
          if ( index > 0 ) {
            let next_token = this.token.layers[ index - 1 ];
            if ( next_token.requiresSourceLayer ) {
              app.activeDocument.activeLayer = this.source = this.segment.source.duplicate( this_layer.referenceLayer(), ElementPlacement.PLACEBEFORE ) as ArtLayer;
            }
          }
        }
      }
    }
    if ( this.token.invert ) {
      ps.addInvertAdjustmentLayer();
    }
    return this;
  }

}

export { NestedSegmentLayer };
