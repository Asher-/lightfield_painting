import { helper as ps } from '../../../helper';

import { RangeSegment } from '../../levels/range_segment';

import { SegmentToken } from '../parser/tokens/segment_token';
import { ArtLayerToken } from '../parser/tokens/layers/art_layer_token';
import { NestedLayerToken } from '../parser/tokens/layers/nested_layer_token';
import { ConditionalLayerToken } from '../parser/tokens/layers/conditional_layer_token';
import { AdjustmentLayerToken } from '../parser/tokens/layers/adjustment_layer_token';

import { SegmentLayer } from "./layer/segment_layer";
import { ArtSegmentLayer } from './layer/art_segment_layer';
import { NestedSegmentLayer } from './layer/nested_segment_layer';
import { WalkSegmentLayer } from './layer/walk_segment_layer';
import { ConditionalSegmentLayer } from './layer/conditional_segment_layer';
import { AdjustmentSegmentLayer } from './layer/adjustment_segment_layer';


class Segment
{
  token: SegmentToken;
  group: LayerSet;
  source: ArtLayer;

  layers: Array<SegmentLayer> = new Array<SegmentLayer>;

  number: number;
  range: RangeSegment;

  /* 
      These indirection methods are necessary to detach the parser + tokens from segments + layers. 
      Separation permits us to test the parser without Photoshop. 
  */
  layerConstruction:Object = {
    "ArtLayerToken": ( segment, token ) => { return new ArtSegmentLayer( segment, token ); },
    "AdjustmentLayerToken": ( segment, token ) => { return new AdjustmentSegmentLayer( segment, token ); },
    "ConditionalLayerToken": ( segment, token ) => { return new ConditionalSegmentLayer( segment, token ); },
    "NestedLayerToken": ( segment, token ) => { return new NestedSegmentLayer( segment, token ); },
    "WalkLayerToken": ( segment, token ) => { return new WalkSegmentLayer( segment, token ); }
  }

  constructor( 
    token: SegmentToken,
    segment_number: number,
    segment_start: number,
    segment_end: number
  )
  {
    this.token = token;
    this.number = segment_number;
    this.range = new RangeSegment( segment_start, segment_end );
  }

  initFromArtLayer(
    source: ArtLayer
  )
  {
    ps.ensureActiveLayerIsArt();    
    this.source = source;
    let first_layer = app.activeDocument.activeLayer;
    this.group = ps.addGroup( "Segment " + this.number.toString() );
    if ( this.token.layers[0].blendMode == 'NORMAL' ) {
      this.group.blendMode = BlendMode.NORMAL;
    }
    app.activeDocument.activeLayer = first_layer;
    this.createLayers();
  }

  createLayers()
  {
    let this_source = app.activeDocument.activeLayer as ArtLayer;
    for ( let index = this.token.layers.length - 1 ; index >= 0 ; --index ) {
      let this_layer_token = this.token.layers[index];
      let this_layer = this_layer_token.initFromActiveLayer( this );
      if ( this_layer !== undefined  ) {
        this.layers.push( this_layer );
        if ( index > 0 ) {
          let next_token = this.token.layers[ index - 1 ];
          if ( next_token.requiresSourceLayer ) {
            app.activeDocument.activeLayer = this_source = this.source.duplicate( this_layer.referenceLayer(), ElementPlacement.PLACEBEFORE ) as ArtLayer;
          }
        }
    }
    }
    if ( this.layers.length == 0 ) {
      this_source.remove();
    }
  }


}

export { Segment };
