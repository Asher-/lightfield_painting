
/**@preserve
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Mixback Layer Set</name>
<category>•LightfieldPainting•Mixback</category>
<enableinfo>true</enableinfo>
<eventid>107CAADE-1653-4FD6-87E2-C0A323F630380</eventid>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
**/

import { helper } from "../../helper";

import { MixbackLayerSet } from '../../object/mixback/each/layer_set';

let mixback = new MixbackLayerSet;
mixback.history_string = 'Mixback Each Layer';
mixback.setupFromPrompt();
mixback.execute();
