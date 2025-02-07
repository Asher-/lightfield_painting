import { Segment } from './segment';

class Segments {
  in: Segment = new Segment;
  out: Segment = new Segment;

  constructor(
    in_segment?: Segment,
    out_segment?: Segment  
  ) 
  {
    this.in = (in_segment !== undefined) ? in_segment : this.in;
    this.out = (out_segment !== undefined) ? out_segment : this.out;
  }

  toString() {
    let string = this.in + "-" + this.out;
    return string;
  }

  duplicate()
  {
    let copy = new Segments;
    copy.in = this.in;
    copy.out = this.out;
    return copy;
  }

}

export { Segments };