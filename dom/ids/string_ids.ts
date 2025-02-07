/// <reference types="types-for-adobe/Photoshop/2015.5"/>

const string_ids = {
  layer:                    app.stringIDToTypeID( 'layer' ),
  newPlacedLayer:           app.stringIDToTypeID( 'newPlacedLayer' ),
  null:                     app.stringIDToTypeID( 'null' ),
  preset:                   app.stringIDToTypeID( 'preset' ),
  presetKind:               app.stringIDToTypeID( 'presetKind' ),
  presetKindType:           app.stringIDToTypeID( 'presetKindType' ),
  presetKindCustom:         app.stringIDToTypeID( 'presetKindCustom' ),
  presetKindDefault:        app.stringIDToTypeID( 'presetKindDefault' ),
  presetKindUserDefined:    app.stringIDToTypeID( 'presetKindUserDefined' ),
  select:                   app.stringIDToTypeID( 'select' ),
  input:                    app.stringIDToTypeID( 'input' ),
  output:                   app.stringIDToTypeID( 'output' ),
  gamma:                    app.stringIDToTypeID( 'gamma' ),
  levelsAdjustment:         app.stringIDToTypeID( 'levelsAdjustment' ),
  adjustmentLayer:          app.stringIDToTypeID( 'adjustmentLayer' ),
  adjustment:               app.stringIDToTypeID( 'adjustment' ),
  ordinal:                  app.stringIDToTypeID( 'ordinal' ),
  targetEnum:               app.stringIDToTypeID( 'targetEnum' ),
  set:                      app.stringIDToTypeID( 'set' ),
  to:                       app.stringIDToTypeID( 'to' ),
  levels:                   app.stringIDToTypeID( 'levels' ),
  target:                   app.stringIDToTypeID( 'target' ),
  channel:                  app.stringIDToTypeID( 'channel' ),
  composite:                app.stringIDToTypeID( 'composite' ),
  ID:                       app.stringIDToTypeID( 'ID' ),
  name:                     app.stringIDToTypeID( 'name' ),
  historyStateChanged:      app.stringIDToTypeID( 'historyStateChanged' ),
  documentID:               app.stringIDToTypeID( 'documentID' ),
  hasEnglish:               app.stringIDToTypeID( 'hasEnglish' ),
  itemIndex:                app.stringIDToTypeID( 'itemIndex' ),
  gray:                     app.stringIDToTypeID( 'gray' ),
  Gray:                     app.stringIDToTypeID( 'Gray' ),
  layerSection:             app.stringIDToTypeID( 'layerSection' ),
  layerSectionStart:        app.stringIDToTypeID( 'layerSectionStart' ),
  layerSectionEnd:          app.stringIDToTypeID( 'layerSectionEnd' ),
  using:                    app.stringIDToTypeID( 'using' ),
  make:                     app.stringIDToTypeID( 'make' ),
  delete:                   app.stringIDToTypeID( 'delete' ),
  previous:                 app.stringIDToTypeID( 'previous' ),
  denoise:                  app.stringIDToTypeID( 'denoise' ),
  colorNoise:               app.stringIDToTypeID( 'colorNoise' ),
  percentUnit:              app.stringIDToTypeID( 'percentUnit' ),
  removeJPEGArtifact:       app.stringIDToTypeID( 'removeJPEGArtifact' ),
  channelDenoise:           app.stringIDToTypeID( 'channelDenoise' ),
  amount:                   app.stringIDToTypeID( 'amount' ),
  sharpen:                  app.stringIDToTypeID( 'sharpen' ),
  edgeFidelity:             app.stringIDToTypeID( 'edgeFidelity' ),
  channelDenoiseParams:     app.stringIDToTypeID( 'channelDenoiseParams' ),
  ungroupLayersEvent:       app.stringIDToTypeID( 'ungroupLayersEvent' ),
  hasBackgroundLayer:       app.stringIDToTypeID( 'hasBackgroundLayer' ),
  useLegacy:                app.stringIDToTypeID( 'useLegacy' ),
  type:                     app.stringIDToTypeID( 'type' ),
  brightnessEvent:          app.stringIDToTypeID( 'brightnessEvent' ),
  brightness:               app.stringIDToTypeID( 'brightness' ),
  center:                   app.stringIDToTypeID( 'center' ),
  depth:                    app.stringIDToTypeID( 'depth' ),
  merge:                    app.stringIDToTypeID( 'merge' ),
  convertMode:              app.stringIDToTypeID( 'convertMode' ),
  isFirstParty:             app.stringIDToTypeID( 'isFirstParty' ),
  pluginRun:                app.stringIDToTypeID( 'pluginRun' ),
  accentedEdges:            app.stringIDToTypeID( 'accentedEdges' ),
  edgeWidth:                app.stringIDToTypeID( 'edgeWidth' ),
  edgeBrightness:           app.stringIDToTypeID( 'edgeBrightness' ),
  smoothness:               app.stringIDToTypeID( 'smoothness' ),
  highPass:                 app.stringIDToTypeID( 'highPass' ),
  pixelsUnit:               app.stringIDToTypeID( 'pixelsUnit' ),
  radius:                   app.stringIDToTypeID( 'radius' ),
  document:                 app.stringIDToTypeID( 'document' ),
  property:                 app.stringIDToTypeID( 'property' ),
  targetLayers:             app.stringIDToTypeID( 'targetLayers' ),
  targetLayersIDs:          app.stringIDToTypeID( 'targetLayersIDs' ),
  smartSharpen:             app.stringIDToTypeID( 'smartSharpen' ),
  noiseReduction:           app.stringIDToTypeID( 'noiseReduction' ),
  blur:                     app.stringIDToTypeID( 'blur' ),
  blurType:                 app.stringIDToTypeID( 'blurType' ),
  lensBlur:                 app.stringIDToTypeID( 'lensBlur' ),
  shadowMode:               app.stringIDToTypeID( 'shadowMode' ),
  width:                    app.stringIDToTypeID( 'width' ),
  adaptCorrectTones:        app.stringIDToTypeID( 'adaptCorrectTones' ),
  highlightMode:            app.stringIDToTypeID( 'highlightMode' ),
  blendRange:               app.stringIDToTypeID( 'blendRange' ),
  srcBlackMin:              app.stringIDToTypeID( 'srcBlackMin' ),
  srcBlackMax:              app.stringIDToTypeID( 'srcBlackMax' ),
  srcWhiteMin:              app.stringIDToTypeID( 'srcWhiteMin' ),
  srcWhiteMax:              app.stringIDToTypeID( 'srcWhiteMax' ),
  destBlackMin:             app.stringIDToTypeID( 'destBlackMin' ),
  destBlackMax:             app.stringIDToTypeID( 'destBlackMax' ),
  destWhiteMin:             app.stringIDToTypeID( 'destWhiteMin' ),
  desaturate:               app.stringIDToTypeID( 'desaturate' ),
  layerEffects:             app.stringIDToTypeID( 'layerEffects' ),
  scale:                    app.stringIDToTypeID( 'scale' ),
  exposure:                 app.stringIDToTypeID( 'exposure' ),
  offset:                   app.stringIDToTypeID( 'offset' ),
  new:                      app.stringIDToTypeID( 'new' ),
  mask:                     app.stringIDToTypeID( 'mask' ),
  at:                       app.stringIDToTypeID( 'at' ),
  gammaCorrection:          app.stringIDToTypeID( 'gammaCorrection' ),
  userMaskEnabled:          app.stringIDToTypeID( 'userMaskEnabled' ),
  calculation:              app.stringIDToTypeID( 'calculation' ),
  calculationType:          app.stringIDToTypeID( 'calculationType' ),
  multiply:                 app.stringIDToTypeID( 'multiply' ),
  normal:                   app.stringIDToTypeID( 'normal' ),
  subtract:                 app.stringIDToTypeID( 'subtract' ),
  preserveTransparency:     app.stringIDToTypeID( 'preserveTransparency' ),
  applyImageEvent:          app.stringIDToTypeID( 'applyImageEvent' ),
  apply:                    app.stringIDToTypeID( 'apply' ),
  with:                     app.stringIDToTypeID( 'with' ),
  RGB:                      app.stringIDToTypeID( 'RGB' ),
  revealAll:                app.stringIDToTypeID( 'revealAll' ),
  invert:                   app.stringIDToTypeID( 'invert' ),
  selectionModifier:        app.stringIDToTypeID( 'selectionModifier' ),
  selectionModifierType:    app.stringIDToTypeID( 'selectionModifierType' ),
  addToSelection:           app.stringIDToTypeID( 'addToSelection' ),
  hide:                     app.stringIDToTypeID( 'hide' ),
  show:                     app.stringIDToTypeID( 'show' ),
  layerID:                  app.stringIDToTypeID( 'layerID' ),
  layerSectionExpanded:     app.stringIDToTypeID( 'layerSectionExpanded' ),
  collapseAllGroupsEvent:   app.stringIDToTypeID( 'collapseAllGroupsEvent' ),
  action:                   app.stringIDToTypeID( 'action' ),
  expand:                   app.stringIDToTypeID( 'expand' ),
  toggleLayersPalette:      app.stringIDToTypeID( 'toggleLayersPalette' ),
  currentLayer:             app.stringIDToTypeID( 'currentLayer' ),
  group:                    app.stringIDToTypeID( 'group' ),
  groupEvent:               app.stringIDToTypeID( 'groupEvent' ),
  actionSet:                app.stringIDToTypeID( 'actionSet' ),
  command:                  app.stringIDToTypeID( 'command' )
    
}

export { string_ids };
export default string_ids;
