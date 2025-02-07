/// <reference path="../../../segment/segment.d.ts" />

declare class LayerToken
{
  name?: string;
  blendMode?: string;
  opacity?: number;
  invert?: SegmentLayer | undefined; 
  merge?: boolean;

  requiresSourceLayer: boolean;
  requiresGroup: boolean;

  constructor();

  initFromActiveLayer(
    segment: Segment
  )
  : SegmentLayer | undefined;

}
