

class RangeSegment {
  start: number;
  end: number;
  size: number;

  constructor(
    start?: number,
    end?: number  
  ) 
  {
    if ( start !== undefined ) {
      this.start = start;
    }
    if ( end !== undefined ) {
      this.setEnd( end );
    }
  }

  setStart( value: number )
  {
    this.start = (value < 0) ? 0 : value;
    if ( this.end !== undefined ) {
      this.updateSize();
    }
    return this.start
  }

  setEnd( value: number )
  {
    this.end = (value > 255) ? 255 : value;
    if ( this.start !== undefined ) {
      this.updateSize();
    }
    return this.end;
  }

  updateSize() 
  {
    return this.size = ( this.end > this.start ) ? this.end - this.start : this.start - this.end;
  } 

  offsetStart( value: number )
  {
    return this.setStart( this.start + value );
  }

  offsetEnd( value: number )
  {
    return this.setEnd( this.end + value );
  }

  toString() {
    let string = this.start + "-" + this.end;
    return string;
  }

  duplicate()
  {
    let copy = new RangeSegment;
    copy.start = this.start;
    copy.end = this.end;
    return copy;
  }

}

export { RangeSegment };