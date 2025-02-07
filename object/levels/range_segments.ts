import { RangeSegment } from './range_segment';

class RangeSegments {
  in: RangeSegment = new RangeSegment;
  out: RangeSegment = new RangeSegment;

  constructor(
    in_segment?: RangeSegment,
    out_segment?: RangeSegment  
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
    let copy = new RangeSegments;
    copy.in = this.in;
    copy.out = this.out;
    return copy;
  }

}

export { RangeSegments };