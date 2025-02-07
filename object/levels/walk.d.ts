/// <reference path="./start_end.d.ts" />

declare class Walk {
  start?: StartEnd;
  end?: StartEnd;
  steps?: number;
  step_size?: number;
  opacity?: number;

  merge?: boolean;

  toString();
  duplicate();

}
