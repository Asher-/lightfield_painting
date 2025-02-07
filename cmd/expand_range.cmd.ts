segments:12, 
if( min >= 100 && min < 170) {
  NESTED SOFTLIGHT(
    NESTED INVERTED SCREEN(
      NESTED SOFTLIGHT(
        NESTED DIFFERENCE(
          NESTED PASSTHROUGH(
            BRIGHTNESS(
              SCREEN,
              OPACITY:75,
              BRIGHTNESS: -150,
              CONTRAST: -50
            ),
            BRIGHTNESS(
              SCREEN,
              OPACITY:75,
              BRIGHTNESS: -150,
              CONTRAST: -50
            ),
            BRIGHTNESS(
              SCREEN,
              OPACITY:75,
              BRIGHTNESS: -150,
              CONTRAST: -50
            )
          ),
          INVERT,
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
