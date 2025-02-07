export let ScreenCmd:string = `segments:15, 
SCREEN( 
  OPACITY:25,
  out(
    black: 0,
    white: 17
  ),
  walk(          
        opacity:5,
        start:0,
        end:255,
        steps:1
  )!
),
SCREEN( 
  OPACITY:25,
  out(
    black: 0,
    white: 17
  ),
  walk(          
        opacity:5,
        start:0,
        end:255,
        steps:1
  )!
),
NORMAL( 
  OPACITY:100,
)!;`