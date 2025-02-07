// Best so far:
segments:15, 
NORMAL( 
  OPACITY:100,
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
MULTIPLY( 
  OPACITY:25,
  out(
    black: -75,
    white: +75
  ),
  walk(          
        opacity:02,
        start:0,
        end:255,
        steps:1 
  )!
),
SCREEN( 
  OPACITY:25,
  out(
    black: -75,
    white: +75
  ),
  walk(          
        opacity:02,
        start:0,
        end:255,
        steps:1
  )!
)


// produces dissolved distribution of underlying forms
segments:15, 
NORMAL( 
  OPACITY:100,
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
SCREEN( 
  OPACITY:50,
  out(
    black: -15,
    white: +15
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
    black: -15,
    white: +15
  ),
  walk(          
        opacity:10,
        start:0,
        end:255,
        steps:1 
  )!
);

// produces dissolved distribution of underlying detail
segments:15, 
NORMAL( 
  OPACITY:100,
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
SCREEN( 
  OPACITY:50,
  out(
    black: -5,
    white: +5
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
    black: -5,
    white: +5
  ),
  walk(          
        opacity:10,
        start:0,
        end:255,
        steps:1 
  )!
);

// produces contrasty forms
// up to 45 segments has been used to smaller and smaller detail
// 40 seems to produce better outline contrasts
segments:40, 
NORMAL( 
  OPACITY:100,
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
SCREEN( 
  OPACITY:50,
  out(
    black: 0,
    white: +5
  ),
  walk(          
        opacity:5,
        start:0,
        end:255,
        steps:1
  )!
),
MULTIPLY( 
  OPACITY:50,
  out(
    black: 0,
    white: +5
  ),
  walk(          
        opacity:5,
        start:0,
        end:255,
        steps:1 
  )!
);


// paint

segments:15, 
NORMAL( 
  OPACITY:100,
)!,
INVERTEDSCREEN( 
  OPACITY:50,
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
);


// or should we invert the side too?
segments:15, 
NORMAL( 
  OPACITY:100,
)!,
INVERTEDSCREEN( 
  OPACITY:50,
  out(
    black: 238,
    white: 255
  ),
  walk(          
        opacity:5,
        start:0,
        end:255,
        steps:1
  )!
);


// screen


// paint multiply without base
segments:15, 
MULTIPLY( 
  OPACITY:100,
  out(
    black: 0,
    white: 17
  )
);


// conditional paint multiply without base
segments:15, 
if( min < 86 ) {
  MULTIPLY( 
    OPACITY:100,
    out(
      black: 0,
      white: 17
    )
  )
},
if ( min >= 86 && min < 171 ) {
  MULTIPLY( 
    OPACITY:100,
    out(
      black: 0,
      white: 17
    )
  )
},
if ( min >= 171 ) {
  MULTIPLY( 
    OPACITY:100,
    out(
      black: 0,
      white: 17
    )
  )
}
;

