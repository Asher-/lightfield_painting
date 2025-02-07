
// import { LuminanceSegments } from '../../object/luminance_segments/luminance_segments';

import { parse } from '../../object/luminance_segments/parser/syntax/parser';

let prompt = 
`segments:40, 
NORMAL( 
  BRIGHTNESS(
    SCREEN,
    BRIGHTNESS: -150,
    CONTRAST: -50
  ),
  BRIGHTNESS(
    SCREEN,
    BRIGHTNESS: -150,
    CONTRAST: -50
  ),
  BRIGHTNESS(
    SCREEN,
    BRIGHTNESS: -150,
    CONTRAST: -50
  ),
  BRIGHTNESS(
    SCREEN,
    BRIGHTNESS: -150,
    CONTRAST: -50
  ),
  BRIGHTNESS(
    SCREEN,
    BRIGHTNESS: -150,
    CONTRAST: -50
  ),
  BRIGHTNESS(
    SCREEN,
    BRIGHTNESS: -150,
    CONTRAST: -50
  ),
  BRIGHTNESS(
    SCREEN,
    BRIGHTNESS: -150,
    CONTRAST: -50
  ),
  BRIGHTNESS(
    SCREEN,
    BRIGHTNESS: -150,
    CONTRAST: -50
  ),
  BRIGHTNESS(
    SCREEN,
    BRIGHTNESS: -150,
    CONTRAST: -50
  ),
  BRIGHTNESS(
    SCREEN,
    BRIGHTNESS: -150,
    CONTRAST: -50
  )
)`
// `segments:3, 
// NORMAL( 
//   OPACITY:100,
// ),
// NORMAL( 
//   OPACITY:50,
//   out(
//     black: -10,
//     white: -10
//   ),
//   walk(          
//         opacity:25,
//         start:0,
//         end:255,
//         steps:1 
//   )
// ),
// NORMAL( 
//   OPACITY:50,
// );`;
var result = parse(prompt);

console.log('Result:');

console.dir(result, { depth: null });




// segments:15, 
// NESTED SOFTLIGHT(
//   NESTED INVERTED DIFFERENCE(
//     NORMAL( 
//       OPACITY:10,
//       out(
//         gamma: 1.5,
//         black: -10,
//         white: +35
//       )
//     ),
//     BRIGHTNESS(
//       SCREEN,
//       BRIGHTNESS: -150,
//       CONTRAST: -50
//     )
//   )
// )