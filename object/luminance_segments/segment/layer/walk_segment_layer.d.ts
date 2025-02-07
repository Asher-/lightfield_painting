/// <reference path="./segment_layer.d.ts" />
/// <reference path="../../parser/tokens/layers/walk_layer_token.d.ts" />

declare class WalkSegmentLayer extends SegmentLayer
{
  step_size?: number;
  token: WalkLayerToken;
  layers: Array<SegmentLayer>;

  constructor(
    segment: Segment,
    token:WalkLayerToken
  );
  initFromActiveLayer() : SegmentLayer;

  configureSegment();
  walk();
  walkBySteps();
  walkByStepRange();
  walkBySegmentMultiples();
  walkForwardBySegmentMultiplesStepSize();
  walkForwardBySegmentMultiples();
  walkBackwardBySegmentMultiples();
  walkByStepSize();
  walkForwardByStepSize();
  walkBackwardByStepSize();
  walkForwardByStepCount();
  walkBackwardByStepCount();  
}