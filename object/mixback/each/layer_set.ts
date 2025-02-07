import { helper as ps } from '../../../helper';

import { MixbackObject } from './object';
import { MixbackOpacity } from '../single/opacity';

class MixbackLayerSet extends MixbackObject
{
  blend_layer_index?: number;

  front_to_back: boolean = true;

  constructor()
  {
    super();
    this.blend_opacity = 25;
  }

  setup()
  {
    ps.ensureActiveLayerIsSet();
    this.setupForLayerSet();
  }

  setupForArtLayer()
  {
    /* Not yet implemented. */

    //  Get input layer from ArtLayer above source

    this.source_layer = app.activeDocument.activeLayer as ArtLayer;
    this.group = ps.addGroup();
  }

  setupForLayerSet()
  {
    this.group = app.activeDocument.activeLayer as LayerSet;
    this.source_layer = this.group.artLayers[0];
    this.input_layers = this.group.layerSets[0];
    this.input_layers.name = this.input_layers_name;
    this.input_layers.visible = false;
  }

  action() : LayerSet
  {
    if ( this.front_to_back ) {
      this.iterateActionFrontToBack();
    }
    else {
      this.iterateActionBackToFront();
    }    
    app.activeDocument.activeLayer = this.group;
    return this.group;
  }

  mixGroupName()
  {
    return 'Mix Group ' + (this.iteration+1).toString() + '/' + this.number_of_times.toString() + ' (Layer ' + this.currentLayerNumber().toString() + '/' + this.totalNumberOfLayers().toString() + ')';
  }

  blendGroupName()
  {
    return 'Blend Group ' + this.blend_layer_index.toString() + ' / ' + this.input_layers.artLayers.length.toString();
  }

  totalNumberOfLayers()
  {
    return this.number_of_times * this.input_layers.artLayers.length;
  }

  currentLayerNumber()
  {
    return this.iteration * this.input_layers.artLayers.length + this.blend_layer_index;
  }

  updateMixGroupName()
  {
    return this.mix_group.name = this.mixGroupName();
  }

  iterateActionFrontToBack()
  {
    for ( this.iteration = 0 ; this.iteration < this.number_of_times ; ++this.iteration ) {
      this.actionFrontToBack();
    }
  }

  iterateActionBackToFront()
  {
    for ( this.iteration = 0 ; this.iteration < this.number_of_times ; ++this.iteration ) {
      this.actionBackToFront();
    }
  }

  actionFrontToBack()
  {
    for ( this.blend_layer_index = 0 ; this.blend_layer_index < this.input_layers.artLayers.length ; ++this.blend_layer_index ) {

      this.blend_layer = this.input_layers.artLayers[this.blend_layer_index];
      this.actionOnArtLayer();
    }  
  }

  actionBackToFront()
  {
    for ( this.blend_layer_index = this.input_layers.artLayers.length - 1 ; this.blend_layer_index >= 0 ; --this.blend_layer_index ) {
      this.blend_layer = this.input_layers.artLayers[this.blend_layer_index];
      this.actionOnArtLayer();
    }
  }

  actionOnArtLayer()
  {
    this.setupForAction();
    this.opacityMixback();
    this.mergeMixGroup();
    this.saveIntermediate();
  }

  // intermediateLayerName()
  // {
  //   let this_blend_layer = this.input_layers.artLayers[ this.blend_layer_index ];
  //   layer_name += '-' + this_blend_layer.name;
  //   return layer_name;
  // }

  setupForAction()
  {
    app.activeDocument.activeLayer = this.source_layer;
    this.mix_group = ps.addGroup( this.mixGroupName() );
    app.activeDocument.activeLayer = this.source_layer;
    let original_name = this.blend_layer.name;
    this.blend_layer = this.blend_layer.duplicate( this.source_layer, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    this.blend_layer.name = original_name;
    app.activeDocument.activeLayer = this.blend_layer;    
  }

  opacityMixback()
  {
    this.opacity_group = ps.addGroup();
    this.opacity_group.name += ' - Opacity Group';

    app.activeDocument.activeLayer = this.source_layer;
    this.mix_layer = this.source_layer.duplicate( this.blend_layer, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    this.mix_layer.name = this.source_layer.name;

    let opacity_mixback = new MixbackOpacity( this.opacity_group );
    opacity_mixback.opacity = this.blend_opacity;
    opacity_mixback.setup();
    opacity_mixback.execute();

  }

  mergeMixGroup()
  {
    app.activeDocument.activeLayer = this.mix_group;
    this.result_layer = this.mix_group.merge();
    this.source_layer = this.result_layer;
  }


  mixbackNumber()
  {
    let number = ((this.iteration + 1)*this.input_layers.artLayers.length) + this.blend_layer_index + 1; 
    return number;
  }



}

export { MixbackLayerSet };
