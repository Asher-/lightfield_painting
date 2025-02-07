import { Configuration } from './configuration';

class GaussianBlurConfiguration extends Configuration {
  radius: number
  constructor( radius: number )
  {
    super();
    this.radius = radius;
  }
}

export { GaussianBlurConfiguration }
