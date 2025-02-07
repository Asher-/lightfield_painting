
import { StartEnd } from './start_end';

class Walk {
  start?: StartEnd = new StartEnd;
  end?: StartEnd = new StartEnd;
  steps?: number;
  step_size?: number;
  opacity?: number;

  merge?: boolean;

  toString() {
    let details:string[] = [];
    if ( this.start !== undefined ) {
      details.push( "start:" + this.start );
    }
    if ( this.end !== undefined ) {
      details.push( "end:" + this.end );
    }
    if ( this.steps !== undefined ) {
      details.push( "steps:" + this.steps );
    }
    if ( this.step_size !== undefined ) {
      details.push( "step_size:" + this.step_size );
    }
    if ( this.opacity !== undefined ) {
      details.push( "opacity:" + this.opacity );
    }
    if ( this.merge !== undefined ) {
      details.push( "merge:" + this.merge );
    }
    
    let string = "(" + details.join(" ") + ")";
    return string;
  }

  duplicate()
  {
    let copy = new Walk;
    copy.start = this.start.duplicate();
    copy.end = this.end.duplicate();
    copy.steps = this.steps;
    copy.step_size = this.step_size;
    copy.opacity = this.opacity;
    copy.merge = this.merge;
    return copy;
  }

}

export { Walk };