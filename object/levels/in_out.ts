class IO
{
  value?: number;
  absolute: boolean = true;
  constructor( 
    value?:number, 
    absolute?:boolean
  ) {
    this.init( value, absolute );
  }
  init( 
    value?:number, 
    absolute?:boolean
  ) {
    this.value = ( value !== undefined ) ? value : this.value;
    this.absolute = ( absolute !== undefined ) ? absolute : this.absolute;
  }
  static declare( 
    self?:IO,
    value?:number, 
    absolute?:boolean
  ) : IO
  {
    if ( self === undefined ) {
      self = new IO( value, absolute );
    }
    else {
      self.init( value, absolute );
    }
    return self;
  }
  duplicate()
  {
    let copy = new IO( this.value, this.absolute );
    return copy;
  }

  toString() {
    let details:string[] = [];
    if ( this.value !== undefined ) {
      details.push( "value:" + this.value );
    }
    if ( this.absolute !== undefined ) {
      details.push( "absolute:" + this.absolute );
    }
    
    let string = "(" + details.join(" ") + ")";
    return string;
  }
}

class InOut {
  in?: IO;
  out?: IO;

  static declare( 
    self?:InOut,
    in_io?:IO, 
    out_io?:IO
  ) : InOut
  {
    if ( self === undefined ) {
      self = new InOut( in_io, out_io );
    }
    else {
      self.init( in_io, out_io );
    }
    return self;
  }

  constructor( 
    in_io?:IO, 
    out_io?:IO
  ) {
    this.init( in_io, out_io );
  }

  init( 
    in_io?:IO, 
    out_io?:IO
  ) {
    this.in = (in_io !== undefined) ? in_io : this.in;
    this.out = (out_io !== undefined) ? out_io : this.out;
  }

  toString() {
    let details:string[] = [];
    if ( this.in !== undefined ) {
      details.push( "in:" + this.in );
    }
    if ( this.out !== undefined ) {
      details.push( "out:" + this.out );
    }
    
    let string = "(" + details.join(" ") + ")";
    return string;
  }

  declareIn( 
    value?:number, 
    absolute?:boolean
  ) : IO
  {
    return this.in = IO.declare( this.in, value, absolute );
  }

  declareOut( 
    value?:number, 
    absolute?:boolean
  ) : IO
  {
    return this.out = IO.declare( this.out, value, absolute );
  }

  setDefaults(
    in_value: number,
    out_value: number = in_value,
    absolute: boolean = true
  )
  {
    this.declareIn( in_value, absolute );
    this.declareOut( out_value, absolute );
  }

  duplicate()
  {
    let copy = new InOut;
    if ( this.in !== undefined ) {
      copy.in = this.in.duplicate();
    }
    if ( this.out !== undefined ) {
      copy.out = this.out.duplicate();
    }
    return copy;
  }
  
}

export { InOut };