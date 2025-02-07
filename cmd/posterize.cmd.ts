export let PosterizeCmd:string = `segments:15, 
SCREEN( 
  OPACITY:25,
  out(
    black: 0,
    white: 17
  ),
  walk(          
        opacity:02,
        start:0,
        end:255,
        steps:1
  )!
),
MULTIPLY( 
  OPACITY:25,
  out(
    black: 238,
    white: 255
  ),
  walk(          
        opacity:02,
        start:0,
        end:255,
        steps:1 
  )!
),
NORMAL( 
  OPACITY:50,
  out(
    black: -5,
    white: +5
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