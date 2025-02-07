declare class IO
{
  value?: number;
  absolute: boolean;
  static declare( 
    self?:IO,
    value?:number, 
    absolute?:boolean
  ) : IO;
  duplicate() : IO;
  toString() : string;
}

declare class InOut {
  in?: IO;
  out?: IO;

  static declare( 
    self?:InOut,
    in_io?:IO, 
    out_io?:IO
  ) : InOut;

  toString() : string;

  declareIn( 
    value?:number, 
    absolute?:boolean
  ) : IO;

  declareOut( 
    value?:number, 
    absolute?:boolean
  ) : IO;

  setDefaults(
    in_value: number,
    out_value: number = in_value,
    absolute: boolean = true
  );

  duplicate() : InOut;
  
}
