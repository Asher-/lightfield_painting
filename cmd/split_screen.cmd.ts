export let SplitScreenCmd:string = `segments:15, 
if( min < 86 ) {
  SCREEN( 
    OPACITY:15,
    out(
      black: 171,
      white: 255
    )
  )
},
if ( min >= 86 && min < 171 ) {
  SCREEN( 
    OPACITY:25,
    out(
      black: +10,
      white: -10
    )
  )
},
if ( min >= 171 ) {
  SCREEN( 
    OPACITY:100,
    out(
      black: 0,
      white: 17
    )
  )
};`