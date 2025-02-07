import { IOToken } from './io_token';

class InOutToken {
  in?: IOToken;
  out?: IOToken;
  constructor( 
    in_io?:IOToken, 
    out_io?:IOToken
  ) {
    this.in = in_io;
    this.out = out_io;
  }
}

export { InOutToken, IOToken };