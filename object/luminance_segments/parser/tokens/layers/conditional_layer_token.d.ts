
/// <reference path="./layer_token.d.ts" />
/// <reference path="../condition_token.d.ts" />

declare class ConditionalLayerToken extends LayerToken
{
  conditions: Array<ConditionToken>;
  layers?: Array<LayerToken>;

  constructor();

  initFromActiveLayer(
    segment: Segment
  )
  : SegmentLayer | undefined;

  validateConditions(
    start: number,
    end: number
  ) : boolean;

}
