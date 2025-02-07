import { helper as ps } from '../../../../helper';

import { Object } from '../../../object';

import { MixbackArtLayerOpacity } from '../art_layer/opacity';

class MixbackLayerSetOpacity extends MixbackArtLayerOpacity
{
  opacity: number = 25;

  calculate_opacity: boolean = false;

  /* Internal State */

  blend_opacity?: number;
  blend_layer_set?: LayerSet;
  blend_layer_index?: number;

  is_layer_set?: boolean;

  constructor(
    source_layer: Layer = app.activeDocument.activeLayer
  )
  {
    super( source_layer );
    this.is_layer_set = ps.isLayerSet(source_layer);
    this.history_string = 'Opacity Mixback Layer Set';
    this.prompt_string = 'Blend Opacity';
    this.prompt_default = '25';
    this.opacity = source_layer.opacity;
  }

  validateLayer()
  {
  }

  parsePrompt()
  {
    this.opacity = Number( this.prompt_result );
  }

  setup()
  {
    if ( this.is_layer_set && this.calculate_opacity ) {
      this.calculateMaxOpacity();
      app.activeDocument.activeLayer = this.source_layer_set;
    }    
  }

  calculateMaxOpacity()
  {
    let layer_count = this.source_layer_set.artLayers.length;
    let max_opacity = 0;
    for ( let this_index = 0 ; this_index < layer_count ; ++this_index ) {
      let this_layer = this.source_layer_set.artLayers[ this_index ];
      let this_opacity = Math.round(this_layer.opacity);
      max_opacity = ( max_opacity > this_opacity ) ? max_opacity : this_opacity;
    }
    this.opacity = max_opacity;
  }

  action()
  {
    if ( this.is_layer_set ) {
      this.group = ps.addGroup();
      this.group.visible = false;
      this.group.name += ' - Opacity Blend ' + Math.round(this.opacity).toString() + '%';
      this.source_layer_set.name = this.opacity.toString();
      this.blend_layer_set = this.source_layer_set;
      for ( this.blend_opacity = this.opacity - 1 ; this.blend_opacity > 0 ; --this.blend_opacity ) {
        this.createBlendLayer();
      } 
      this.group.visible = true;
      this.result_layer = this.group.merge();
    }
    else {
      super.action();
    }
  }

  createBlendLayer()
  {
    this.blend_layer_set = this.blend_layer_set.duplicate( this.blend_layer_set, ElementPlacement.PLACEBEFORE ) as LayerSet;
    this.blend_layer_set.name = this.blend_opacity.toString();
    for ( this.blend_layer_index = 0 ; this.blend_layer_index < this.blend_layer_set.artLayers.length ; ++this.blend_layer_index ) {
      this.updateBlendLayerOpacity();
    }  
  }

  updateBlendLayerOpacity()
  {
    let this_next_layer = this.blend_layer_set.artLayers[ this.blend_layer_index ];
    let this_opacity = Math.round(this_next_layer.opacity) - 1;
    if ( this_opacity >= 1  )
      this_next_layer.opacity = this_opacity;
    else {
      this_next_layer.remove();
      --this.blend_layer_index;
    }
  }

}

export { MixbackLayerSetOpacity };
