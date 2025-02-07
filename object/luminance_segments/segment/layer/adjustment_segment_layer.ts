import { helper as ps } from '../../../../helper';

import { AdjustmentLayerToken } from '../../parser/tokens/layers/adjustment_layer_token';
import { SegmentLayer } from './segment_layer';

class AdjustmentSegmentLayer extends SegmentLayer
{
  token: AdjustmentLayerToken;
  adjustmentLayer: ArtLayer;

  constructor(
    segment: Segment,
    token: AdjustmentLayerToken
  )
  {
    super( segment, token );
  }

  initFromActiveLayer()
  : SegmentLayer
  {
    if ( ps.isLayerSet() ) {
      app.activeDocument.activeLayer = app.activeDocument.activeLayer.parent as LayerSet;
    }
    this.adjustmentLayer = this.token.method();
    super.initFromActiveLayer();
    return this;
  }

}

export { AdjustmentSegmentLayer };
