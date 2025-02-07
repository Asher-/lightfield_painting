/// <reference types="types-for-adobe/Photoshop/2015.5"/>

import { Configuration } from './configuration';

class HighPassConfiguration extends Configuration {
  radius: number = 400 /* px */;
  constructor( radius: number = 400 /* px */ )
  {
    super();
    this.radius = radius;
    this.layer.after = ( layer: ArtLayer, config: Configuration ) => {
      layer.visible = false;
    }
    this.layerSet.after = ( layer_set: LayerSet, config: Configuration ) => {
      for ( let index = 0 ; index < layer_set.artLayers.length ; ++index ) {
        let this_layer = layer_set.artLayers[ index ];
        this_layer.visible = true;
      }      
    }
  }
}

export { HighPassConfiguration }
