import { Configuration } from './configuration';

class FrequencySeparationBlendGroupConfiguration extends Configuration {
  hp: number;
  lp: number;
  constructor( 
    hp: number  = 1000,
    lp: number  = 100
  )
  {
    super();
    this.hp = hp;
    this.lp = lp;
  }
}

export { FrequencySeparationBlendGroupConfiguration }
