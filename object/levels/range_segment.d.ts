
declare class RangeSegment {
  start: number;
  end: number;
  size: number;
  setStart( value: number ) : number;
  setEnd( value: number ) : number;
  offsetStart( value: number ) : number;
  offsetEnd( value: number ) : number;
  toString() : string;
  duplicate() : RangeSegment;
  updateSize() : number;

}
