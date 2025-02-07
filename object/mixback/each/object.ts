import { helper as ps } from '../../../helper';

import { Object } from '../../object';

class MixbackObject extends Object
{
  source_layer: ArtLayer;
  group: LayerSet;
  blend_group?: LayerSet;          // Group used for mixback
  blend_layer?: ArtLayer;
  opacity_group?: LayerSet;        // Group containing 1 copy of each layer at given opacity
  opacity_mix_group?: LayerSet;    // Group containing opacity blend groups
  blend_opacity?: number           // Current opacity for blend

  mix_group?: LayerSet;            // Group that will be merged after mixback
  mix_layer?: ArtLayer;            // Copy of source_layer inside blend_group
  final_mixback: boolean = true;
  mixback_opacity: number = 50;
  final_mixback_layer?: ArtLayer;

  input_layers: LayerSet;
  output_layers?: LayerSet;
  output_layers_name: string = 'Output Layers';
  input_layers_name: string = 'Input Layers';

  number_of_times: number = 1;
  keep_intermediates: boolean = true;

  iteration?: number;

  constructor(
    source_layer: Layer = app.activeDocument.activeLayer
  )
  {
    super( source_layer );
    this.prompt_string = "Number of times";
    this.prompt_default = "1";
  }

  parsePrompt()
  {
    this.number_of_times = Number( this.prompt_result );
  }

  setupFromPrompt()
  {
    let prompt_result = this.prompt();
    this.number_of_times = Number( prompt_result );
    this.setup();
    return this;
  }

  saveIntermediate()
  {
    if ( this.output_layers !== undefined && (this.output_layers.artLayers.length > 0) ) {
      this.result_layer.duplicate( this.output_layers.artLayers[0], ElementPlacement.PLACEBEFORE );
    }
    else {
      this.createOutputLayerSet();
    }
  }

  createOutputLayerSet()
  {
    app.activeDocument.activeLayer = this.result_layer;
    this.result_layer = this.result_layer.duplicate( this.result_layer, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    app.activeDocument.activeLayer = this.result_layer;
    this.output_layers = ps.addGroup( this.output_layers_name );
    this.source_layer.move( this.output_layers, ElementPlacement.PLACEBEFORE );
    this.output_layers.visible = false;
  }

}

export { MixbackObject };
