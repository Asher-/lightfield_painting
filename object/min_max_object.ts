import { isNumberObject } from 'util/types';
import { Comparison } from './comparison';

class MinMax {
  min: Comparison;
  max: Comparison;
  constructor(
    min: Comparison = new Comparison,
    max: Comparison = new Comparison
  )
  {
    this.min = min;
    this.max = max;
  }

  toString()
  {
    let details:string[] = [];
    if ( this.min !== undefined ) {
      details.push( "min:" + this.min.toString() );
    }
    if ( this.max !== undefined ) {
      details.push( "max:" + this.max.toString() );
    }
    
    let string = "(" + details.join(" ") + ")";
    return string;
  }

}

export { MinMax };
