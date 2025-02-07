import { helper as ps } from '../../../../helper';

import { Object } from '../../../object';

class OutputLayers extends Object
{
  soft_light_layer_set?: LayerSet;
  normal_layer_set?: LayerSet;
  normal_layer?: ArtLayer;
  multiply_layer_set?: LayerSet;
  mixback_layer?: ArtLayer;

  soft_light_opacity: number = 1;
  normal_opacity: number = 3;
  multiply_opacity: number = 1;
  mixback_opacity: number = 50;

  soft_light_layer_set_opacity: number = 75;
  normal_layer_set_opacity: number = 75;
  multiply_layer_set_opacity: number = 75;

  opacity_blend_increment: number = 10;

  setup()
  {
    ps.ensureActiveLayerIsSet();
    let active_layer_set = app.activeDocument.activeLayer as LayerSet;
    if ( active_layer_set.layerSets.length == 0 ) {
      throw "Expected Output Layers as member Layer Set.";
    }
    if ( active_layer_set.artLayers.length == 0 ) {
      throw "Expected Work Layer as member Art Layer.";
    }
    this.group = app.activeDocument.activeLayer as LayerSet;
    this.source_layer_set = this.group.layerSets[0];
    this.source_layer = this.group.artLayers[0];
  }

  action()
  {
    this.group.visible = false;

    app.activeDocument.activeLayer = this.source_layer_set;
    this.source_layer_set.move( this.source_layer, ElementPlacement.PLACEBEFORE ) as LayerSet;
    this.soft_light_layer_set = this.source_layer_set;
    this.soft_light_layer_set.name = 'Soft Light Mixback';
    this.normal_layer_set = this.soft_light_layer_set.duplicate( this.soft_light_layer_set, ElementPlacement.PLACEBEFORE ) as LayerSet;
    this.normal_layer_set.name = 'Normal Mixback';
    this.multiply_layer_set = this.normal_layer_set.duplicate( this.normal_layer_set, ElementPlacement.PLACEBEFORE ) as LayerSet;
    this.multiply_layer_set.name = 'Multiply Mixback';
    // This makes source layer invisible because group is not visible? WTF Adobe. 
    this.mixback_layer = this.source_layer.duplicate( this.multiply_layer_set, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    this.mixback_layer.name = 'Source Mixback';
    this.mixback_layer.opacity = this.mixback_opacity;

    this.configureSoftLightLayers();
    this.configureNormalLayers();
    this.configureMultiplyLayers();

    this.createOpacityBlend();

    this.fixAdobeBullshit();

    app.activeDocument.activeLayer = this.group;
    this.group.visible = true;
    this.group.merge();
  }

  fixAdobeBullshit()
  {
    for ( let this_index = 0 ; this_index < this.group.artLayers.length ; ++this_index ) {
      let this_layer = this.group.artLayers[this_index];
      this_layer.visible = true;
    }
  }

  configureSoftLightLayers()
  {
    let layer_count = this.soft_light_layer_set.artLayers.length;
    for ( let this_index = 0 ; this_index < layer_count ; ++this_index ) {
      let this_layer = this.soft_light_layer_set.artLayers[this_index];
      app.activeDocument.activeLayer = this_layer;
      this_layer.opacity = this.soft_light_opacity;
      this_layer.blendMode = BlendMode.SOFTLIGHT;
    }
    this.soft_light_layer_set.opacity = this.soft_light_layer_set_opacity;
  }

  configureNormalLayers()
  {
    let layer_count = this.normal_layer_set.artLayers.length;
    for ( let this_index = 0 ; this_index < layer_count ; ++this_index ) {
      let this_layer = this.normal_layer_set.artLayers[this_index];
      app.activeDocument.activeLayer = this_layer;
      this_layer.opacity = this.normal_opacity;
    }
    app.activeDocument.activeLayer = this.normal_layer_set;
    this.normal_layer_set.opacity = this.normal_layer_set_opacity;
    this.normal_layer = this.normal_layer_set.merge();
    app.activeDocument.activeLayer = this.normal_layer
    this.normal_layer = this.normal_layer.duplicate( this.multiply_layer_set, ElementPlacement.PLACEBEFORE ) as ArtLayer;
  }

  configureMultiplyLayers()
  {
    let layer_count = this.multiply_layer_set.artLayers.length;
    for ( let this_index = 0 ; this_index < layer_count ; ++this_index ) {
      let this_layer = this.multiply_layer_set.artLayers[this_index];
      app.activeDocument.activeLayer = this_layer;
      this_layer.opacity = this.multiply_opacity;
      this_layer.blendMode = BlendMode.MULTIPLY;
    }
    this.multiply_layer_set.opacity = this.multiply_layer_set_opacity;
  }

  createOpacityBlend()
  {
    for ( this.normal_layer_set_opacity -= 10,
          this.multiply_layer_set_opacity -= 10;  this.normal_layer_set_opacity > 0, 
                                                  this.multiply_layer_set_opacity > 0 ; this.normal_layer_set_opacity -= 10, 
                                                                                        this.multiply_layer_set_opacity -= 10 ) {
      app.activeDocument.activeLayer = this.multiply_layer_set;
      this.multiply_layer_set = this.multiply_layer_set.duplicate( this.normal_layer, ElementPlacement.PLACEBEFORE ) as LayerSet;
      this.multiply_layer_set.opacity = this.multiply_layer_set_opacity;
      app.activeDocument.activeLayer = this.normal_layer;
      this.normal_layer = this.normal_layer.duplicate( this.multiply_layer_set, ElementPlacement.PLACEBEFORE ) as ArtLayer;
      this.normal_layer.opacity = this.normal_layer_set_opacity;
    }
    this.normal_layer.opacity = this.mixback_opacity;
  }

}

export { OutputLayers };
