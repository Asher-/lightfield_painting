import { helper as ps } from '../../../../helper';

import { Object } from '../../../object';

class MixbackArtLayerOpacity extends Object
{
  opacity: number = 25;
  blend_opacity?: number;

  constructor(
    source_layer: Layer = app.activeDocument.activeLayer
  )
  {
    super( source_layer );
    this.history_string = 'Opacity Mixback Art Layer';
    this.prompt_string = 'Blend Opacity';
    this.prompt_default = '35';
    this.opacity = source_layer.opacity;
  }

  validateLayer()
  {
    ps.ensureLayerIsArt();
  }

  parsePrompt()
  {
    this.opacity = Number( this.prompt_result );
  }

  setup()
  {
    ps.validateLayer();
    
  }

  action()
  {
    let parent = this.source_layer.parent as LayerSet;
    let placeholder = parent.layerSets.add();
    app.activeDocument.activeLayer = placeholder;
    placeholder.move( this.source_layer, ElementPlacement.PLACEBEFORE );
    app.activeDocument.activeLayer = this.source_layer;
    this.group = ps.addGroup();
    this.group.name += ' - Opacity Blend ' + Math.round(this.opacity).toString() + '%';
    app.activeDocument.activeLayer = this.group;
    this.group.move( placeholder, ElementPlacement.PLACEBEFORE );
    placeholder.remove();
    app.activeDocument.activeLayer = this.source_layer;
    let work_layer: ArtLayer = this.source_layer;
    work_layer.opacity = this.opacity;
    for ( this.blend_opacity = this.opacity - 1; this.blend_opacity > 0 ; --this.blend_opacity ) {
      work_layer = work_layer.duplicate( work_layer, ElementPlacement.PLACEBEFORE ) as ArtLayer;
      work_layer.opacity = this.blend_opacity;
      work_layer.name = this.source_layer.name + ' - Opacity Blend ' + Math.round(this.blend_opacity).toString() + '%';
    }
    app.activeDocument.activeLayer = this.group;
    this.result_layer = this.group.merge();
    this.source_layer = this.result_layer;
  }
  
}

export { MixbackArtLayerOpacity };
