export let NestedSoftLightDifferenceCmd:string = `segments:15, 
NESTED SOFTLIGHT(
  NESTED INVERTED DIFFERENCE(
    BRIGHTNESS(
      SCREEN,
      BRIGHTNESS: -150,
      CONTRAST: -50
    ),
    NORMAL( 
      OPACITY:10,
      out(
        black: -10,
        white: +35
      )
    )
  ),
  NORMAL( 
    OPACITY:10,
    out(
      black: -10,
      white: +35
    )
  )
),
NORMAL( 
  OPACITY:100
)!;`
