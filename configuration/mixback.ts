/// <reference types="types-for-adobe/Photoshop/2015.5"/>

import { Configuration } from './configuration';

class Details {
  opacity: number;
  blendMode: BlendMode;

  constructor(
    opacity: number,
    blend_mode: BlendMode = BlendMode.NORMAL
  )
  {
    this.opacity = opacity;
    this.blendMode = blend_mode;
  }
}

class LayerDetails extends Details {
}

class LayerSetDetails extends Details {
}

class MixbackConfiguration {
  
  layer: LayerDetails;
  layerSet: LayerSetDetails;
  name: string;

  constructor(
    layer_opacity: number,
    layer_set_opacity: number = layer_opacity,
    layer_blend_mode: BlendMode = BlendMode.NORMAL,
    layer_set_blend_mode: BlendMode = BlendMode.NORMAL,
    name: string = undefined
  )
  {
    this.layer = new LayerDetails( layer_opacity, layer_blend_mode );
    this.layerSet = new LayerDetails( layer_set_opacity, layer_set_blend_mode );
    this.name = name;
  }

}

export { MixbackConfiguration }
