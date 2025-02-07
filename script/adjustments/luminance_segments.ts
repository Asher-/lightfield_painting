
/**@preserve
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Luminance Segments</name>
<category>•LightfieldPainting•Adjustments•Segment</category>
<enableinfo>true</enableinfo>
<eventid>107CAADE-1653-4FD6-87E2-C0A323F630378</eventid>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
**/

import { helper } from "../../helper";

// let is_open = helper.isOpen();
// let is_open_s = is_open?"Expanded":"Collapsed";
// alert( 'is Open: ' + is_open_s  );
// helper.openGroup();

import { LuminanceSegments } from '../../object/luminance_segments/luminance_segments';

import { parse } from '../../object/luminance_segments/parser/syntax/parser';

let prompt = LuminanceSegments.prompt(
`segments:15, 
NORMAL(
  INVERT,
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
);
`
);

/*
let prompt = 
`segments:3, 
NORMAL( 
  OPACITY:100,
),
NORMAL( 
  OPACITY:50,
  walk(          
        opacity:25,
        start:0,
        end:255,
        steps:1 
  )
);`;
*/
var segment_configuration = parse(prompt);

let luminance_segments = new LuminanceSegments( segment_configuration );
luminance_segments.execute();
