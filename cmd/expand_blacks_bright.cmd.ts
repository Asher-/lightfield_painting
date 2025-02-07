segments:15, 
if( min > 80 ) {
  NESTED SOFTLIGHT(
    NESTED INVERTED SCREEN(
      NESTED SOFTLIGHT(
        NESTED INVERTED DIFFERENCE(
          BRIGHTNESS(
            SCREEN,
            BRIGHTNESS: -150,
            CONTRAST: -50
          ),
          NORMAL( 
            OPACITY:100,
            out(
              black: -10,
              white: -15
            )
          )
        ),
        NORMAL( 
          OPACITY:100,
          out(
            black: -10,
            white: -15
          )
        )
      ),
      NORMAL( 
        OPACITY:100
      )
    ),
    NORMAL( 
      OPACITY:100
    )
  )
};
