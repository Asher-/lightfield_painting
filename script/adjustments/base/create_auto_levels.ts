
/**@preserve
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Create Auto Levels</name>
<category>•LightfieldPainting•Adjustment•Base</category>
<enableinfo>true</enableinfo>
<eventid>FF25705B-9F82-4DE4-AFC1-280EC23B6E6A</eventid>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
**/

import { Resources } from '../../../resources';
import { Helper } from '../../../helper';

app.activeDocument.suspendHistory(
  "Create Auto Levels",
  'ps.addAutoLevels()'
);

