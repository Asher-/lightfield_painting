/// <reference path="./io_token.d.ts" />

declare class InOutToken {
  in?: IOToken;
  out?: IOToken;
  constructor( 
    in_io?:IOToken, 
    out_io?:IOToken
  );
}
