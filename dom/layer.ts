
import { character_ids as cid } from './dom/ids/character_ids';
import { string_ids as sid } from './dom/ids/string_ids';

class MinMax
{
  min: number = 0;
  max: number = 255;
}

class Input extends MinMax
{

}

class Output extends MinMax
{

}

class Descriptor
{
  action: ActionDescriptor;
  reference: ActionReference;
}

class ChannelDescriptor extends Descriptor
{
  inList: ActionList;
  outList: ActionList;
}

class LevelsDescriptor extends Descriptor
{
  channel: ChannelDescriptor = new ChannelDescriptor
}

class AdjustmentLayer
{
  descriptor: LevelsDescriptor;
  kindDescriptor: Descriptor = new Descriptor;
  actionDescriptor: Descriptor = new Descriptor;
  
  constructor( 
    adjustment_type:string, 
    for_layer:ArtLayer = undefined 
  )
  {
    this.descriptor.action.putEnumerated(sid.presetKind, sid.presetKindType, sid.presetKindDefault);  
    this.descriptor.reference.putClass(cid.AdjustmentLayer);
    this.kindDescriptor.action.putObject(cid.Type, cid[adjustment_type], this.descriptor.action);

    if ( for_layer === undefined ) 
      this.createLayer();

  }

  createLayer()
  {
    let descriptor = new Descriptor;
    descriptor.action.putReference(sid.target, this.descriptor.reference);
    descriptor.action.putObject(cid.Using, cid.AdjustmentLayer, this.kindDescriptor.action);
    app.executeAction(cid.Make, descriptor.action, DialogModes.NO);      
  }

  updateFromActiveLayer(): LevelsAdjustmentLayer 
  {
    /* Adjustment Layer */
    this.descriptor.reference = new ActionReference();
    this.descriptor.reference.putEnumerated(sid.adjustmentLayer, sid.ordinal, sid.targetEnum);
    this.descriptor.action = app.executeActionGet( this.descriptor.reference );
    /* Channel */
    this.descriptor.channel.action = this.descriptor.action.getObjectValue(sid.levelsAdjustment);
    /* inBlack, inWhite */
    this.descriptor.channel.inList = this.descriptor.channel.action.getList(sid.input);
    this.input.min = this.descriptor.channel.inList.getInteger(0);
    this.input.max = this.descriptor.channel.inList.getInteger(1);
    /* outBlack, outWhite */
    this.descriptor.channel.outList = this.descriptor.channel.action.getList(sid.output);
    this.output.min = this.descriptor.channel.outList.getInteger(0);
    this.output.max = this.descriptor.channel.outList.getInteger(1);
    /* Gamma */
    this.gamma = this.descriptor.channel.action.getDouble(sid.gamma);
    return this;
  }

  update(): LevelsAdjustmentLayer {

    /* Adjustment Layer */
    let adjustment_layer_d = new ActionDescriptor();
    let adjustment_layer_r = new ActionReference();
    adjustment_layer_r.putEnumerated(sid.adjustmentLayer, sid.ordinal, sid.targetEnum);
    adjustment_layer_d.putReference(sid.target, adjustment_layer_r);

    /* Channel */
    let docModeCharID = this.getChannelID();
    let channel_d = new ActionDescriptor();
    let channel_r = new ActionReference();
    channel_r.putEnumerated(cid.Channel, cid.Channel, docModeCharID);
    channel_d.putReference(sid.channel, channel_r);

    /* inBlack, inWhite */
    let in_list = new ActionList();
    in_list.putInteger(inBlack);
    in_list.putInteger(inWhite);

    /* Gamma */
    channel_d.putList(sid.input, in_list);
    channel_d.putDouble(sid.gamma, gamma);

    /* outBlack, outWhite */
    let out_list = new ActionList();
    out_list.putInteger(outBlack);
    out_list.putInteger(outWhite);
    channel_d.putList(sid.output, out_list);

    /* Execute */
    let adjustments_d = new ActionDescriptor();
    adjustments_d.putEnumerated(sid.presetKind, sid.presetKindType, sid.presetKindCustom);
    let adjustments_list = new ActionList();
    adjustments_list.putObject(sid.levelsAdjustment, channel_d);
    adjustments_d.putList(sid.adjustment, adjustments_list);
    adjustment_layer_d.putObject(sid.to, sid.levels, adjustments_d);
    return adjustment_layer_d;
  }

  get gamma() : number
  {

  }

  set gamma( value )
  {

  }
}
