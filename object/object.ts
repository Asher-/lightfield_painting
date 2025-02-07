import { helper as ps } from '../helper';

class Object
{
  source_layer?: ArtLayer;
  source_layer_set?: LayerSet;
  result_layer?: ArtLayer;
  group: LayerSet;

  blend_group?: LayerSet;          // Group used for mixback
  blend_layer?: ArtLayer;

  mix_group?: LayerSet;            // Group that will be merged after mixback
  mix_layer?: ArtLayer;            // Copy of source_layer inside blend_group

  history_string: string = '[Object]';
  prompt_string: string = '[Object]';
  prompt_default: string = '';

  prompt_result?: string;

  constructor(
    source_layer: Layer = app.activeDocument.activeLayer
  )
  {
    if ( ps.isArtLayer(source_layer) ) {
      this.source_layer = source_layer as ArtLayer;
    }
    else {
      this.source_layer_set = source_layer as LayerSet;
    }
  }

  setupFromPrompt() : void
  {
    this.prompt_result = this.prompt();
    this.parsePrompt();
    this.setup();
  }

  parsePrompt()
  {

  }

  setup()
  {
  }

  action()
  {
    throw "Object.action() needs to be implemented by subclass.";
  }

  prompt() {
    let prompt_result = prompt( this.composePromptString(), this.composePromptDefaultString() );
    return prompt_result;
  }

  composeHistoryString() : string
  {
    return this.history_string;
  }

  composePromptString() : string
  {
    return this.prompt_string;
  }

  composePromptDefaultString() : string
  {
    return this.prompt_default;
  }

  execute() : Object
  {
    app.activeDocument.suspendHistory( this.composeHistoryString(), "this.action()" );    
    return this;
  }

}

export { Object };
