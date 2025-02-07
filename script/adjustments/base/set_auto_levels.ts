
/**@preserve
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Set Auto Levels</name>
<category>•LightfieldPainting•Adjustment•Base</category>
<enableinfo>true</enableinfo>
<eventid>FF25705B-9F82-4DE4-AFC1-280EC23B6E6B</eventid>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
**/

import { Resources } from '../../../resources';

app.activeDocument.suspendHistory(
  "Set Auto Levels",
  'ps.setAutoLevels()'
);