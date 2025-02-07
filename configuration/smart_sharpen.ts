
import { Configuration } from './configuration';

class SmartSharpenConfiguration extends Configuration 
{
  amount:                number = 220  /* % */
  radius:                number = 12.5 /* px */
  reduceNoise:           number = 100  /* % */
  shadowFadeAmount:      number = 25   /* % */
  shadowTonalWidth:      number = 25   /* % */
  shadowRadius:          number = 25   /* px */
  highlightFadeAmount:   number = 25   /* % */
  highlightTonalWidth:   number = 25   /* % */
  highlightRadius:       number = 25   /* px */
  
  constructor( 
    amount:                number = 220  /* % */,
    radius:                number = 12.5 /* px */,
    reduce_noise:          number = 100  /* % */,
    shadow_fade_amount:    number = 25   /* % */,
    shadow_tonal_width:    number = 25   /* % */,
    shadow_radius:         number = 25   /* px */,
    highlight_fade_amount: number = 25   /* % */,
    highlight_tonal_width: number = 25   /* % */,
    highlight_radius:      number = 25   /* px */
  )
  {
    super();
    this.amount = amount;
    this.radius = radius;
    this.reduceNoise = reduce_noise;
    this.shadowFadeAmount = shadow_fade_amount;
    this.shadowTonalWidth = shadow_tonal_width;
    this.shadowRadius = shadow_radius;
    this.highlightFadeAmount = highlight_fade_amount;
    this.highlightTonalWidth = highlight_tonal_width;
    this.highlightRadius = highlight_radius;

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

export { SmartSharpenConfiguration }