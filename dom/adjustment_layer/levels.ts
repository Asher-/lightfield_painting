/// <reference types="types-for-adobe/Photoshop/2015.5"/>

import { character_ids as cid } from '../ids/character_ids';
import { string_ids as sid } from '../ids/string_ids';

import { Descriptor } from '../descriptor';
import { ChannelDescriptor } from '../descriptor/channel_descriptor';

import { AdjustmentLayer } from '../adjustment_segment_layer';



class LevelsAdjustmentLayer extends AdjustmentLayer
{
  channel: ChannelDescriptor;
  
  constructor( 
    adjustment_type:string, 
    for_layer:ArtLayer = undefined 
  )
  {
    super( 'Levels' );
    this.channel = new ChannelDescriptor(this);
    this.descriptor.action.putObject(sid.to, sid.levels, this.adjustmentDescriptor.action);
    this.adjustmentDescriptor.list.putObject(sid.levelsAdjustment, this.channel.action);

    if ( for_layer === undefined ) 
      this.createLayer();

    this.channel.action = this.descriptor.action.getObjectValue(sid.levelsAdjustment);
  }

  update(): LevelsAdjustmentLayer {
    app.executeAction( sid.set, this.descriptor.action, DialogModes.NO );
    return this;
  }

}
