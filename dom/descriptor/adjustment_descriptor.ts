/// <reference types="types-for-adobe/Photoshop/2015.5"/>

import { character_ids as cid } from '../ids/character_ids';
import { string_ids as sid } from '../ids/string_ids';

import { Descriptor } from '../descriptor';
import { AdjustmentLayer } from '../descriptor/../adjustment_segment_layer';

class AdjustmentDescriptor extends Descriptor
{
  list: ActionList;
  
  constructor()
  {
    super();
    this.action.putList(sid.adjustment, this.list);
  }

}

export { AdjustmentDescriptor };
