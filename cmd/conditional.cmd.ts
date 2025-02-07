segments:15, 
if( min < 86 ) {
  MULTIPLY( 
    OPACITY:35,
    out(
      black: 80,
      white: 140
    )
  )
},
if ( min >= 86 && min < 171 ) {
  MULTIPLY( 
    OPACITY:25,
    out(
      black: 0,
      white: 0
    )
  )
},
if ( min >= 171 ) {
  MULTIPLY( 
    OPACITY:20,
    out(
      black: 0,
      white: 17
    )
  )
}