segments:25, 
NORMAL( 
  OPACITY:100,
),
NORMAL( 
  OPACITY:50,
  out(
    black: -10,
    white: +35
  ),
  walk(          
        opacity:5,
        start:0,
        end:255,
        steps:1 
  )!
),
SCREEN( 
  OPACITY:50,
  out(
    black: -10,
    white: +35
  ),
  walk(          
        opacity:10,
        start:0,
        end:255,
        steps:1
  )!
),
MULTIPLY( 
  OPACITY:50,
  out(
    black: -10,
    white: +35
  ),
  walk(          
        opacity:10,
        start:0,
        end:255,
        steps:1 
  )!
);


segments:15, 
NORMAL( 
  OPACITY:100,
),
SOFTLIGHT( 
  OPACITY:50,
  out(
    black: -10,
    white: +35
  ),
  walk(          
        opacity:10,
        start:0,
        end:255,
        steps:.5 
  )!
);


segments:15, 
NORMAL( 
  OPACITY:100,
),
SCREEN( 
  OPACITY:50,
  out(
    black: -10,
    white: +35
  ),
  walk(          
        opacity:10,
        start:0,
        end:255,
        steps:.5 
  )!
);


segments:15, 
NORMAL( 
  OPACITY:100,
),
MULTIPLY( 
  OPACITY:50,
  out(
    black: -10,
    white: +35
  ),
  walk(          
        opacity:10,
        start:0,
        end:255,
        steps:.5 
  )!
);