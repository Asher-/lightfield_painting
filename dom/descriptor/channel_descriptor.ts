/// <reference types="types-for-adobe/Photoshop/2015.5"/>

import { character_ids as cid } from '../ids/character_ids';
import { string_ids as sid } from '../ids/string_ids';

import { Descriptor } from '../descriptor';
import { AdjustmentLayer } from '../descriptor/../adjustment_segment_layer';

class ChannelIODescriptor  
{
  descriptor: Descriptor = new Descriptor;
  list: ActionList = new ActionList;
  parentLayer: AdjustmentLayer;

  constructor( parent_layer: AdjustmentLayer )
  {
    this.parentLayer = parent_layer;
  }

  get min(): number
  {
    return this.list.getInteger(0);
  }
  set min( value: number )
  {
    let max = this.max;
    this.list.clear();
    this.list.putInteger(value);
    this.list.putInteger(max);
  }
  get max(): number
  {
    return this.list.getInteger(1);
  }
  set max( value: number )
  {
    let min = this.min;
    this.list.clear();
    this.list.putInteger(min);
    this.list.putInteger(value);
  }
}

class ChannelInputDescriptor extends ChannelIODescriptor
{
  constructor( parent_layer: AdjustmentLayer )
  {
    super(parent_layer);
    this.descriptor.action.putList( sid.input, this.list );
  }
}

class ChannelOutputDescriptor extends ChannelIODescriptor
{
  constructor( parent_layer: AdjustmentLayer )
  {
    super(parent_layer);
    this.descriptor.action.putList( sid.output, this.list );
  }
}

class ChannelDescriptor extends Descriptor
{
  input: ChannelInputDescriptor;
  output: ChannelOutputDescriptor;
  parentLayer: AdjustmentLayer;

  constructor( parent_layer: AdjustmentLayer )
  {
    super();
    this.parentLayer = parent_layer;
    this.input = new ChannelInputDescriptor(parent_layer);
    this.output = new ChannelOutputDescriptor(parent_layer);
  }

  get gamma() : number
  {
    return this.action.getDouble( sid.gamma );
  }

  set gamma( value )
  {
    this.action.putDouble( sid.gamma, value );
    this.parentLayer.update();
  }

}

export { ChannelIODescriptor, ChannelInputDescriptor, ChannelOutputDescriptor, ChannelDescriptor };
