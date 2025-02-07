/// <reference types="types-for-adobe/Photoshop/2015.5"/>

class Configuration {
  iterate = {
    reverse: false,
    recursive: true
  }
  layer = {
    before: ( layer: ArtLayer, config: Configuration ) => {},
    after: ( layer: ArtLayer, config: Configuration ) => {}
  }
  layerSet = {
    before: ( layer_set: LayerSet, config: Configuration ) => {},
    after: ( layer_set: LayerSet, config: Configuration ) => {}
  }

  dialogMode: DialogModes = DialogModes.NO 
}

export { Configuration };
