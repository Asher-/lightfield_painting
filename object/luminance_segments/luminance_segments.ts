
import { helper as ps } from '../../helper';

import { SegmentToken } from './parser/tokens/segment_token';

import { Segment } from "./segment/segment";

import * as Tokens from './parser/tokens';

import { ArtLayerToken } from './parser/tokens/layers/art_layer_token';
import { NestedLayerToken } from './parser/tokens/layers/nested_layer_token';
import { AdjustmentLayerToken } from './parser/tokens/layers/adjustment_layer_token';

import { ConditionToken } from './parser/tokens/condition_token';

import { InOutToken } from './parser/tokens/in_out_token';
import { IOToken } from './parser/tokens/io_token';
import { NumericValueToken } from './parser/tokens/numeric_value_token';
import { WalkLayerToken, StartEndToken } from './parser/tokens/layers/walk_layer_token';

import { parse } from './parser/syntax/parser';

class LuminanceSegments
{
  token: SegmentToken;

  group: LayerSet;
  source: ArtLayer;
  segments: Array<Segment> = new Array<Segment>;
  result: ArtLayer;

  static prompt(
    default_prompt: string = "segments:15, NORMAL( opacity:100 ), NORMAL( opacity:50 );"
  )
  {
    let result = prompt( "Segment descriptor or nickname (PAINT-NORMAL, PAINT-MULTIPLY, CRISP, POSTERIZE):", default_prompt );
    return result;
  }

  constructor( 
    token: SegmentToken 
  )
  {
    this.token = token;
  }

  execute() : ArtLayer
  {
    app.activeDocument.suspendHistory( this.historyString(), "this.initFromArtLayer()" );    
    return this.result;
  }

  initFromActiveLayerSet()
  {
    ps.ensureActiveLayerIsSet();    
  }

  initFromArtLayer()
  {
    ps.ensureActiveLayerIsArt();    

    this.source = ps.convertToSmartObjectIfAppropriate( app.activeDocument.activeLayer as ArtLayer );
    app.activeDocument.activeLayer = this.source
    let first_segment_layer = this.source.duplicate( this.source, ElementPlacement.PLACEBEFORE );
    app.activeDocument.activeLayer = first_segment_layer
    this.group = ps.addGroup( this.layerNameString() );
    app.activeDocument.activeLayer = first_segment_layer

    this.group.visible = false;
    this.createSegments();
    this.group.visible = true;
    // FIX - maybe add an option for segment (in SegmentToken) to keep the source or not
    if ( this.token.layers[0].blendMode == 'NORMAL' ) {
      this.source.remove();
    }
  }

  createSegments()
  {

    let segment_start = 0;
    let this_layer_source = app.activeDocument.activeLayer as ArtLayer;
    for ( let segment_number = 0 ; segment_number < this.token.number_of_segments ; ++segment_number ) {
      
      let this_segment_size = this.token.segment_size + ( segment_number < this.token.remainder ? 1 : 0 );
      let this_segment_end = segment_start + this_segment_size;
      let this_segment = this.segments[segment_number] = new Segment( 
        this.token,
        segment_number, 
        segment_start, 
        this_segment_end 
      );
      if ( segment_number > 0 ) {
        this_layer_source = this.source.duplicate( this.group.layerSets[0], ElementPlacement.PLACEBEFORE ) as ArtLayer;
        app.activeDocument.activeLayer = this_layer_source;
      }

      this_segment.initFromArtLayer( this.source );

      segment_start = this_segment_end;
    }

    app.activeDocument.activeLayer = this.group;

    if ( this.token.merge ) {
      this.result = this.group.merge();
      return this.result;
    }
    return this.group;
  }

  historyString()
  {
    let string = "Luminance Segments (" + this.token.toString() + ")";
    return string;
  }

  layerNameString()
  {
    let string = "Luminance Segments";
    return string;
  }

}

export { LuminanceSegments };
