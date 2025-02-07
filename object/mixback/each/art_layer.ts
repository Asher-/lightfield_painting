import { helper as ps } from '../../../helper';

import { MixbackObject } from './object';

class MixbackArtLayer extends MixbackObject
{

  setup()
  {
    ps.ensureActiveLayerIsSet();
    this.setupForArtLayer();
  }

  setupForArtLayer()
  {
    this.source_layer = app.activeDocument.activeLayer as ArtLayer;
    this.group = ps.addGroup();
  }

  setupForAction()
  {
    this.source_layer = app.activeDocument.activeLayer as ArtLayer;
    this.group = ps.addGroup();
    app.activeDocument.activeLayer = this.source_layer;   
  }

  action() : LayerSet
  {
    this.setupForAction();
    for ( this.iteration = 0 ; this.iteration < this.number_of_times ; ++this.iteration ) {
      this.cycle();
    }
    this.completeAction();
    app.activeDocument.activeLayer = this.group;
    return this.group;
  }

  completeAction()
  {

  }

  cycle()
  {
    this.setupForEachCycle();
    this.cycleAction();
    this.mergeCycle();
    this.saveIntermediate();
  }

  // Setup the cycle to have two layers with the mixback active on top
  setupForEachCycle()
  {
    app.activeDocument.activeLayer = this.source_layer;
    this.mix_group = ps.addGroup();
    this.mix_group.name += ' - Mixback ' + this.iteration.toString();
    app.activeDocument.activeLayer = this.source_layer;
  }

  // Act on mixback layer in cycle group
  cycleAction()
  {
    this.blend_group = ps.addGroup( 'Blend Group' );
    app.activeDocument.activeLayer = this.blend_layer;
    this.mix_layer = this.source_layer.duplicate( this.blend_layer, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    this.blend_layer.opacity = this.mixback_opacity;
  }

  mergeCycle()
  {
    this.result_layer = this.mix_group.merge();
    this.source_layer = this.result_layer;
  }


}

export { MixbackArtLayer };
