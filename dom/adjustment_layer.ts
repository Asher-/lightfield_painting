
import { character_ids as cid } from './ids/character_ids';
import { string_ids as sid } from './ids/string_ids';

import { Descriptor } from './descriptor';
import { AdjustmentDescriptor } from './descriptor/adjustment_descriptor';

class AdjustmentLayer
{
  descriptor: Descriptor = new Descriptor;
  kindDescriptor: Descriptor = new Descriptor;
  adjustmentDescriptor: AdjustmentDescriptor = new AdjustmentDescriptor;
  
  constructor( 
    adjustment_type:string, 
    for_layer:ArtLayer = undefined 
  )
  {
    this.descriptor.action.putEnumerated(sid.presetKind, sid.presetKindType, sid.presetKindDefault);  
    this.descriptor.reference.putClass(cid.AdjustmentLayer);
    this.descriptor.reference.putEnumerated(sid.adjustmentLayer, sid.ordinal, sid.targetEnum);
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

  updateFromActiveLayer(): AdjustmentLayer 
  {
    this.descriptor.action = app.executeActionGet( this.descriptor.reference );
    return this;
  }

}

export { AdjustmentLayer };
