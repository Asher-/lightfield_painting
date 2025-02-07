
import { Configuration } from './configuration';

class IntereaveLayersConfiguration extends Configuration 
{
  reuseLayers: boolean = false /* If layers run out from one group, do we interleave the group again? */
  
  constructor( 
    reuse_layers: boolean = false
  )
  {
    super();
    this.reuseLayers = reuse_layers;
  }
}

export { IntereaveLayersConfiguration }