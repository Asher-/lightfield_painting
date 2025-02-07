segments:15, 
if( min < 80 ) {
  MULTIPLY(
    opacity:50,
    out(
      black: 200,
      white: 250
    )
  ),
  WALK NORMAL( 
    opacity:25,
    start:200,
    end:255,
    steps:.25
  )
};
