import { WalkLayerToken } from '../../parser/tokens/layers/walk_layer_token';
import { ArtLayerToken } from '../../parser/tokens/layers/art_layer_token';
import { IOToken } from '../../parser/tokens/io_token';
import { NumericValueToken } from '../../parser/tokens/numeric_value_token';

import { SegmentLayer } from './segment_layer';
import { ArtSegmentLayer } from './art_segment_layer';

import { RangeSegment } from '../../../levels/range_segment';

import { helper as ps } from '../../../../helper';

class WalkSegmentLayer extends ArtSegmentLayer
{
  declare group: LayerSet;
  step_size?: number;
  layers: Array<SegmentLayer> = new Array<SegmentLayer>
  declare token: WalkLayerToken;
  layer_token: ArtLayerToken = new ArtLayerToken;
  walk_range:RangeSegment = new RangeSegment;
  walk_layer:ArtSegmentLayer;
  step_range = new RangeSegment;

  constructor(
    segment: Segment,
    token:WalkLayerToken
  )
  {
    super( segment, token );
    this.configureSegment();
    this.configureLayerToken();
  }
  
  configureLayerToken()
  {
    this.layer_token = new ArtLayerToken;
    this.layer_token.blendMode = this.token.blendMode;
    this.layer_token.invert = this.token.invert;
    this.layer_token.opacity = this.token.opacity;
    this.layer_token.out = new IOToken;
    this.layer_token.out.black = new NumericValueToken;
    this.layer_token.out.white = new NumericValueToken;
    this.layer_token.out.black.absolute = true;
    this.layer_token.out.white.absolute = true;
    // this.layer_token.merge = true;
  }

  initFromActiveLayer() 
  : SegmentLayer
  {
    super.initFromActiveLayer( false );

    this.group.name = "Walk " + this.token.blendMode + " " + this.token.toString();

    // start, end, steps        - steps is multiplier of segment size
    if ( this.token.steps !== undefined ) {
      this.step_size = this.range.out.size * this.token.steps;
      this.walkBySegmentMultiples();
    }
    // step_size
    else {
      this.walkBySteps();
    }
    this.mergeIfRequired();
    return this;
  }

  configureSegment()
  {    
    if ( this.token.start && this.token.start.absolute ) {
      this.walk_range.setStart( this.token.start.value as number );
    }
    else if ( this.token.start ) {
      this.walk_range.offsetStart( this.token.start.value as number );
    }
    if ( this.token.end && this.token.end.absolute ) {
      this.walk_range.setEnd( this.token.end.value as number );
    }
    else if ( this.token.end ) {
      this.walk_range.offsetEnd( this.token.end.value as number );
    }
  }

  walkBySteps()
  {
    this.step_size = this.token.step_size;
    if ( this.token.start !== undefined ) {
      this.walkByStepRange();
    }
    // end, step_size, count
    else {
      this.walkBackwardByStepCount();
    }
  }

  walkByStepRange()
  {
    // start, end, step_size    - step_size is distance between segments
    if ( this.token.end !== undefined ) {
      this.walkByStepSize();
    }
    // start, step_size, count  
    else {
      this.walkForwardByStepCount();
    }
  }

  walkBySegmentMultiples()
  {
    if ( (this.walk_range.start !== undefined) && (this.walk_range.end !== undefined) && ( this.walk_range.start < this.walk_range.end ) ) {
      this.walkForwardBySegmentMultiples();
    }
    else {
      this.walkBackwardBySegmentMultiples();
    }
  }

  calculatedStepSize() : number
  {
    let steps = Math.round( this.range.out.size * (this.token.steps as number) );
    steps = ( steps < 1 ) ? 1 : steps;
    steps = ( steps > 255 ) ? 255 : steps;
    return steps; 
  }

  walkForwardBySegmentMultiples()
  {
    /* 
        this.range is the adjusted segment range
        this.walk_range is the total span for walking
        this.step_range is the current sublayer range
    */
    
    this.walk_layer = new ArtSegmentLayer( this.segment, this.layer_token );
    for ( this.initWalkForwardLoop() ; 
          this.validateConditionForwardLoop(); 
          this.incrementWalkForwardLoop() ) {
       
      if ( this.layers.length > 0 ) { 
        this.prepareNewSourceLayer();
      }
      this.layers.push( this.walk_layer );
      
      this.walk_layer.initFromActiveLayer();

    }
    // this.mergeIfRequired();
  }

  stepString()
  {
    return this.layer_token.out!.black!.value + '-' + this.layer_token.out!.white!.value!;
  }

  initWalkForwardLoop() 
  {
    this.layer_token.out!.black!.value = this.walk_range.start;
    this.layer_token.out!.white!.value = this.walk_range.start + this.range.out.size;
    this.layer_token.name = this.token.blendMode + " " + this.stepString();
  }

  incrementWalkForwardLoop()
  {
    this.layer_token.out!.black!.value! += this.calculatedStepSize();
    this.layer_token.out!.white!.value! = this.layer_token.out!.black!.value! + this.range.out.size;
    if ( this.layer_token.out!.white!.value! > 255 ) {
      this.layer_token.out!.white!.value = 255;
    }
    this.layer_token.name = this.token.blendMode + " " + this.stepString();
  }

  validateConditionForwardLoop()
  {
    return this.layer_token.out!.black!.value! < (this.walk_range.end as number);
  }

  initWalkBackwardLoop() 
  {
    this.layer_token.out!.black!.value = this.walk_range.start;
    this.layer_token.out!.white!.value = this.walk_range.start + this.range.out.size;
    this.layer_token.name = this.token.blendMode + " " + this.stepString();
  }

  incrementWalkBackwardLoop()
  {
    this.layer_token.out!.white!.value! -= this.calculatedStepSize();
    this.layer_token.out!.black!.value! = this.layer_token.out!.white!.value! - this.range.out.size;
    if ( this.layer_token.out!.black!.value! < 0 ) {
      this.layer_token.out!.black!.value = 0;
    }
    this.layer_token.name = this.token.blendMode + " " + this.stepString();
  }

  validateConditionBackwardLoop()
  {
    return this.layer_token.out!.white!.value! > (this.walk_range.start as number);
  }

  prepareNewSourceLayer()
  {
    let reference = app.activeDocument.activeLayer;
    app.activeDocument.activeLayer = this.segment.source;
    let layer_source = this.segment.source.duplicate( reference, ElementPlacement.PLACEBEFORE );
    app.activeDocument.activeLayer = layer_source;
    this.walk_layer = new ArtSegmentLayer( this.segment, this.layer_token );
  }

  walkBackwardBySegmentMultiples()
  {
    this.walk_layer = new ArtSegmentLayer( this.segment, this.layer_token );
    for ( this.initWalkBackwardLoop() ; 
          this.validateConditionBackwardLoop(); 
          this.incrementWalkBackwardLoop() ) {
       
      if ( this.layers.length > 0 ) { 
        this.prepareNewSourceLayer();
      }
      this.layers.push( this.walk_layer );
      
      this.walk_layer.initFromActiveLayer();
    }
    
  }

  walkByStepSize()
  {
    if ( (this.walk_range.start !== undefined) && (this.walk_range.end !== undefined) && (this.walk_range.start < this.walk_range.end) ) {
      this.walkForwardByStepSize();
    }
    else {
      this.walkBackwardByStepSize();
    }
  }

  walkForwardByStepSize()
  {
    
  }

  walkBackwardByStepSize()
  {
    
  }

  walkForwardByStepCount()
  {
    
  }

  walkBackwardByStepCount()
  {
    
  }
  
}


export { WalkSegmentLayer };