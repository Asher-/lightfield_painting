/// <reference path="./segment_layer.d.ts" />

import { helper as ps } from '../../../../helper';

import { InOut } from '../../../levels/in_out';
import { RangeSegments } from '../../../levels/range_segments';
import { RangeSegment } from '../../../levels/range_segment';

import { ArtLayerToken } from '../../parser/tokens/layers/art_layer_token';

import { SegmentLayer } from './segment_layer';

class ArtSegmentLayer extends SegmentLayer
{
  token: ArtLayerToken;

  range: RangeSegments = new RangeSegments;
  gamma: InOut = new InOut;
  
  blendIfGroup: LayerSet;
  source: ArtLayer;
  input: ArtLayer;
  output: ArtLayer;

  layers: Array<SegmentLayer> = new Array<SegmentLayer>;

  constructor(
    segment: Segment,
    token: ArtLayerToken
  )
  {
    super( segment, token );
    this.range.in!.setStart( this.range.out!.setStart( this.segment.range.start ) );
    this.range.in!.setEnd( this.range.out!.setEnd( this.segment.range.end ) );
    this.gamma.setDefaults( 1.0 );
  }

  adjustSegment()
  {
    if ( this.token.in !== undefined ) {
      if ( this.token.in!.black !== undefined ) {
        if ( this.token.in!.black.absolute ) {
          this.range.in!.setStart( this.token.in!.black.value! );
        }
        else {
          this.range.in!.offsetStart( this.token.in!.black.value! );
        }
      }
      if ( this.token.in!.white !== undefined ) {
        if ( this.token.in!.white.absolute ) {
          this.range.in!.setEnd( this.token.in!.white.value! );
        }
        else {
          this.range.in!.offsetEnd( this.token.in!.white.value! );
        }
      }
    }
    if ( this.token.out !== undefined ) {
      if ( this.token.out!.black !== undefined ) {
        if ( this.token.out!.black.absolute ) {
          this.range.out!.setStart( this.token.out!.black.value! );
        }
        else {
          this.range.out!.offsetStart( this.token.out!.black.value! );
        }
      }
      if ( this.token.out!.white !== undefined ) {
        if ( this.token.out!.white.absolute ) {
          this.range.out!.setEnd( this.token.out!.white.value! );
        }
        else {
          this.range.out!.offsetEnd( this.token.out!.white.value! );
        }
      }
    }

  }

  initFromActiveLayer(
    should_init_source_layer: boolean = true
  ) 
  : SegmentLayer
  {
    this.adjustSegment(); 
    super.initFromActiveLayer();

    if ( should_init_source_layer ) {
      this.initSourceLayer();
      this.mergeIfRequired();
    }

    return this;
  }

  initSourceLayer()
  {
    // Assumes activeLayer is copy of our source layer

    if ( this.group && ! this.token.name && this.token.blendMode ) {
      this.group.name = this.token.blendMode; 
    }

    app.activeDocument.activeLayer = this.source;
    this.blendIfGroup = ps.addGroup( "Blend If " + this.range.in!.toString() );
    ps.setBlendIf( this.range.in!.start, this.range.in!.start, this.range.in!.end, this.range.in!.end );
    app.activeDocument.activeLayer = this.group;
    this.input = ps.addLevels( 
      this.range.in!.start, 
      this.range.in!.end,
      this.gamma.in!.value, 
      0, 255  
    );
    this.initNestedLayers();
    app.activeDocument.activeLayer = this.group;
    this.output = ps.addLevels( 
      0, 255, 
      this.gamma.out!.value, 
      this.range.out!.start, 
      this.range.out!.end,
    ); 
    this.updateInputLayerNames();
    this.updateOutputLayerNames();

    app.activeDocument.activeLayer = this.group;
    if ( this.token.invert ) {
      this.source.invert();
    }
  }

  initNestedLayers()
  : SegmentLayer | undefined
  {
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

  updateLayerNames()
  {
    this.updateInputLayerNames();
    this.updateOutputLayerNames();
  }

  updateInputLayerNames()
  {
    this.source.name = "Source " + this.range.in!.toString();
    this.blendIfGroup.name = "Blend If " + this.range.in!.toString();
    this.input.name = "Input " + this.range.in!.toString();
  }

  updateOutputLayerNames()
  {
    this.output.name = "Output " + this.range.out!.toString();  
  }

  initFromLayerSet( source_layer_set: LayerSet = app.activeDocument.activeLayer as LayerSet )
  {
    this.group = source_layer_set;
    this.output = source_layer_set.artLayers[0];
    this.input = source_layer_set.artLayers[1];
    this.blendIfGroup = source_layer_set.layerSets[0];
    this.source = this.blendIfGroup.artLayers[0];
  }

  updateInput()
  {
    app.activeDocument.activeLayer = this.input;
    ps.setLevels( 
      this.range.in!.start,
      this.range.in!.end,
      this.gamma.in!.value,
      0, 255
    );
    this.updateInputLayerNames();
  }

  updateOutput()
  {
    app.activeDocument.activeLayer = this.output;
    ps.setLevels( 
      0, 255,
      this.gamma.out!.value,
      this.range.out!.start,
      this.range.out!.end
    );
    this.updateOutputLayerNames();
  }

  duplicate(
    reference: SegmentLayer     = this,
    placement: ElementPlacement = ElementPlacement.PLACEBEFORE
  )
  {
    let copy = new ArtSegmentLayer( this.segment, this.token );
    copy.gamma = this.gamma.duplicate();
    copy.range = this.range.duplicate();
    copy.opacity = this.opacity;
    app.activeDocument.activeLayer = copy.group = this.group.duplicate( reference.group, placement ) as LayerSet;
    copy.initFromLayerSet( copy.group );
    return copy;
  }

}

export { ArtSegmentLayer };
