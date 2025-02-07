/// <reference path="../../../segment/layer/segment_layer.d.ts" />
/// <reference path="../../../segment/segment.d.ts" />

class LayerToken
{
  name?: string;
  blendMode?: string;
  opacity?: number;
  invert?: SegmentLayer | undefined; 
  merge?: boolean;

  requiresSourceLayer: boolean = true;
  requiresGroup: boolean = true;

  constructor()
  {
    
  }

  initFromActiveLayer(
    segment: Segment
  )
  : SegmentLayer | undefined
  {
    let segment_layer = new SegmentLayer( segment, this );
    return segment_layer.initFromActiveLayer();
  }


}

export { LayerToken };
