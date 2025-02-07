import { helper as ps } from '../../../helper';
import { MixbackArtLayer } from '../each/art_layer';

import { MixbackOpacity } from './opacity';

class ScreenMixback extends MixbackArtLayer
{
  blend_opacity: number = 25;
  mixback_opacity: number = 50;

  constructor( ) 
  {
    super();
    this.prompt_default = "25";
    this.number_of_times = 25;
    this.history_string = 'Screen Mixback (' + this.number_of_times.toString() + ')';
  }

  setup()
  {
    ps.ensureActiveLayerIsArt();
  }

  // Act on mixback layer in cycle group
  cycleAction()
  {
    this.cycleScreenMixback();
    this.cycleOpacityMixback();
  }

  cycleScreenMixback()
  {
    this.mix_layer = this.source_layer.duplicate( this.source_layer, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    app.activeDocument.activeLayer = this.mix_layer;
    this.blend_group = ps.addGroup( 'Blend Group' );
    app.activeDocument.activeLayer = this.mix_layer;
    this.blend_layer = this.mix_layer.duplicate( this.mix_layer, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    this.blend_layer.blendMode = BlendMode.SCREEN;
    let mixback_layer = this.mix_layer.duplicate( this.blend_layer, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    mixback_layer.opacity = this.mixback_opacity;
    app.activeDocument.activeLayer = this.blend_group;
    this.blend_layer = this.blend_group.merge();
  }

  cycleOpacityMixback()
  {
    this.blend_group = ps.addGroup( 'Blend Group' );
    app.activeDocument.activeLayer = this.source_layer;
    this.mix_layer = this.source_layer.duplicate( this.blend_layer, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    app.activeDocument.activeLayer = this.blend_group;
    let opacity_mixback = new MixbackOpacity( this.blend_group );
    opacity_mixback.opacity = this.blend_opacity;
    opacity_mixback.setup();
    opacity_mixback.execute();
  }

}

export { ScreenMixback };
