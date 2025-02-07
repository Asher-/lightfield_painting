/// <reference types="types-for-adobe/Photoshop/2015.5"/>

import { character_ids as cid } from './dom/ids/character_ids';
import { string_ids as sid } from './dom/ids/string_ids';

import { MinMax } from './object/min_max_number';

class Helper {

  //
  // Function: createProgressPalette
  // Description: Opens up a palette window with a progress bar that can be
  //              'asynchronously' while the script continues running
  // Input:
  //   title     the window title
  //   min       the minimum value for the progress bar
  //   max       the maximum value for the progress bar
  //   parent    the parent ScriptUI window (opt)
  //   useCancel flag for having a Cancel button (opt)
  //   msg        message that can be displayed and changed in the palette (opt)
  //
  //   onCancel  This method will be called when the Cancel button is pressed.
  //             This method should return 'true' to close the progress window
  // Return: The palette window
  //
 createProgressPalette(title, min, max, parent, useCancel, msg) {
   let bar_data = {
     bar: undefined,
     win: undefined,
     parentWin: undefined,
     msg: undefined,
     recenter: undefined,
     isDone: undefined,
     onCancel: undefined,
     onClose: undefined,
     updateProgress: undefined,
     advance: undefined,
     cancel: undefined,
     value: 0,
     update: undefined
   };
    var opts = {
      closeButton: false,
      maximizeButton: false,
      minimizeButton: false
    };
    var win = new Window('palette', title, undefined, opts);
    bar_data.win = win;
    bar_data.bar = win.add('progressbar', undefined, min, max);
    if (msg) {
      bar_data.msg = win.add('statictext');
      bar_data.msg.text = msg;
    }
    bar_data.bar.preferredSize = [500, 20];
    bar_data.parentWin = undefined;
    bar_data.recenter = false;
    bar_data.isDone = false;
    if (parent) {
      if (parent instanceof Window) {
        bar_data.parentWin = parent;
      } else if (useCancel == undefined) {
        useCancel = !!parent;
      }
    }
    if (useCancel) {
      bar_data.onCancel = function() {
        bar_data.isDone = true;
        return true;  // return 'true' to close the window
      };
      bar_data.cancel = win.add('button', undefined, localize("$$$/JavaScripts/psx/Cancel=Cancel"));
      bar_data.cancel.onClick = function() {
        var win = this.parent;
        try {
          win.isDone = true;
          if (bar_data.onCancel) {
            var rc = bar_data.onCancel();
            if (rc != false) {
              if (!win.onClose || win.onClose()) {
                win.close();
              }
            }
          } else {
            if (!win.onClose || win.onClose()) {
              win.close();
            }
          }
        } catch (e) {
          alert( 'Exception: ' + e );
          // LogFile.logException(e, '', true);
        }
      };
    }
    bar_data.onClose = function() {
      this.isDone = true;
      return true;
    };
    bar_data.update = function() {
      if (bar_data.recenter) {
        win.center(bar_data.parentWin);
      }
      // win.update();
      win.show();
      // win.hide();
      // win.show();
    }
    bar_data.advance = function(val:number = 1) {
      bar_data.bar.value += val;
    }
  bar_data.updateProgress = function(val) {
      if (val != undefined) {
        bar_data.bar.value = val;
      }
    };
    bar_data.recenter = true;
    win.center(bar_data.parentWin);
    return bar_data;
  };

  getLayerByID( layer_id ): Layer
  {  
    let current_layer = app.activeDocument.activeLayer;
    let reference = new ActionReference();
    let descriptor = new ActionDescriptor();
    reference.putIdentifier(sid.layer, layer_id);
    descriptor.putReference(sid.null, reference);
    app.executeAction(sid.select, descriptor);
    let layer = app.activeDocument.activeLayer;
    app.activeDocument.activeLayer = current_layer;
    return layer;
  }; 

  getChannelID(): number
  {
    let docModeCharID = undefined;
    switch(app.activeDocument.mode.toString()) {
      case "DocumentMode.RGB":
      case "DocumentMode.CMYK":
        docModeCharID = sid.composite;
        break;
  
      case "DocumentMode.GRAYSCALE":
        docModeCharID = cid.Grayscale;
        break;
          
      case "DocumentMode.DUOTONE":
        let channelName = app.activeDocument.channels[0].name;
    
        if( channelName == "Monotone" ) {
            docModeCharID = cid.Monotone;
        } else if( channelName == "Duotone" ) {
            docModeCharID = cid.Duotone;
        } else if( channelName == "Tritone" ) {
            docModeCharID = cid.Tritone;
        } else if( channelName == "Quadtone" ) {
            docModeCharID = cid.Quadtone;
        }
        break;
          
      case "DocumentMode.LAB":
        docModeCharID = cid.LAB;
        break;
          
      default: 
        break;
    }    
    return docModeCharID;
  }

  getHistogram(): number[]
  {  
    let histogram = undefined;
    let current_layer = app.activeDocument.activeLayer;
    let layer_sets = app.activeDocument.layerSets;
    /* app.activeDocument.histogram is only valid on a non-mask layer. */
    let found_visible_layer = false;
    if ( layer_sets.length > 0 ) {
      for ( let index = layer_sets.length - 1 ; index >= 0 ; --index ) {
        let this_layer_set = layer_sets[ index ];
        if ( this_layer_set.visible ) {
          app.activeDocument.activeLayer = this_layer_set;
          found_visible_layer = true;
          break;     
        }
      }

    }
    if ( ! found_visible_layer ) {
      let art_layers = app.activeDocument.artLayers;
      for ( let index = art_layers.length - 1 ; index >= 0 ; --index ) {
        let this_layer = art_layers[ index ];
        if ( this_layer.visible ) {
          app.activeDocument.activeLayer = this_layer;
          break;     
        }
      }
    }
    switch(app.activeDocument.mode.toString()) {
      case "DocumentMode.RGB":
        histogram = app.activeDocument.histogram;
        break;
      case "DocumentMode.CMYK":
        histogram = app.activeDocument.histogram;
        break;
  
      case "DocumentMode.GRAYSCALE":
        histogram = app.activeDocument.channels[0].histogram;
        break;
          
      case "DocumentMode.DUOTONE":
        histogram = app.activeDocument.channels[0].histogram;
        break;
          
      case "DocumentMode.LAB":
        histogram = app.activeDocument.histogram;
        break;
          
      default: 
        break;
    }    
    app.activeDocument.activeLayer = current_layer;
    return histogram;
  }; 

  createSmartObjectFromActiveLayer(): ArtLayer
  {
    let name = app.activeDocument.activeLayer.name;
    app.executeAction(sid.newPlacedLayer, undefined, DialogModes.NO);    
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer as ArtLayer;
  }

  addAdjustmentLayer(
    adjustment_cid_name: string,
    adjustment_layer_d: ActionDescriptor = undefined,
    dialogMode:DialogModes = DialogModes.NO
  ): ArtLayer
  {
    if ( adjustment_layer_d === undefined ) {
      adjustment_layer_d = new ActionDescriptor();
      adjustment_layer_d.putEnumerated(sid.presetKind, sid.presetKindType, sid.presetKindDefault);
    }

    let adjustment_layer_reference = new ActionReference();
    adjustment_layer_reference.putClass(cid.AdjustmentLayer);

    let kind_descriptor = new ActionDescriptor();
    kind_descriptor.putObject(cid.Type, cid[adjustment_cid_name], adjustment_layer_d);

    let make_layer_descriptor = new ActionDescriptor();
    make_layer_descriptor.putReference(sid.target, adjustment_layer_reference);
    make_layer_descriptor.putObject(cid.Using, cid.AdjustmentLayer, kind_descriptor);

    app.executeAction(cid.Make, make_layer_descriptor, dialogMode);
    return app.activeDocument.activeLayer as ArtLayer;
  };

  // not verified to work as expected
  // setCurve(IN,OUT,chan, dialogMode = DialogModes.NO) {
  //   let curveChan = undefined;
  //   switch (chan) {
  //       case 0:
  //       case null:
  //       curveChan=cid.Composite;
  //       break;
  //       case 1:
  //       curveChan=cid.Red;
  //       break;
  //       case 2:
  //       curveChan=cid.Green;
  //       break;
  //       case 3:
  //       curveChan=cid.Blue;
  //       break;
  //   }
  //   /* Adjustment Layer */
  //   let adjustment_layer_d = new ActionDescriptor();
  //   let adjustment_layer_r = new ActionReference();
  //   adjustment_layer_r.putEnumerated(cid.AdjustmentLayer, cid.Ordinal, cid.Target);
  //   adjustment_layer_d.putReference(sid.null, adjustment_layer_r);
  //   /* Channel */
  //   let channel_d = new ActionDescriptor();
  //   let channel_r = new ActionReference();
  //   channel_r.putEnumerated(cid.Channel, cid.Channel, curveChan);
  //   channel_d.putReference(cid.Channel, channel_r);
  //   /* Min */
  //   let min_d = new ActionDescriptor();
  //   min_d.putDouble(cid.Horizontal, 0);
  //   min_d.putDouble(cid.Vertical, 0);
  //   /* Gamma */
  //   let gamma_d = new ActionDescriptor();
  //   gamma_d.putDouble(cid.Horizontal, IN);
  //   gamma_d.putDouble(cid.Vertical, OUT);
  //   /* Max */
  //   let max_d = new ActionDescriptor();
  //   max_d.putDouble(cid.Horizontal, 255);
  //   max_d.putDouble(cid.Vertical, 255);
  //   /* Point List */
  //   let point_list = new ActionList();
  //   point_list.putObject(cid.Point, min_d);
  //   point_list.putObject(cid.Point, gamma_d);
  //   point_list.putObject(cid.Point, max_d);
  //   channel_d.putList(cid.Curve, point_list);
  //   /* Execute */
  //   let action_list = new ActionList();
  //   let adjustment_list_d = new ActionDescriptor();
  //   action_list.putObject(cid.CurvesAdjustment, channel_d);
  //   adjustment_list_d.putList(cid.Adjustment, action_list);
  //   adjustment_layer_d.putObject(cid.To, cid.Curves, adjustment_list_d);
  //   app.executeAction(cid.Set, adjustment_layer_d, dialogMode);
  // }

  addBrightnessContrastAdjustmentLayerDescriptor() : ActionDescriptor {
    let adjustment_layer_d = new ActionDescriptor();
    var create_layer_r = new ActionReference();
    create_layer_r.putClass( sid.adjustmentLayer );
    adjustment_layer_d.putReference( sid.null, create_layer_r );
    var brightness_d = new ActionDescriptor();
        var adjustment_d = new ActionDescriptor();
        adjustment_d.putBoolean( sid.useLegacy, false );
        brightness_d.putObject( sid.type, sid.brightnessEvent, adjustment_d );
    adjustment_layer_d.putObject( sid.using, sid.adjustmentLayer, brightness_d );
    return adjustment_layer_d;
  }

  addBrightnessContrastAdjustmentLayer() {
    let adjustment_layer_d = this.addBrightnessContrastAdjustmentLayerDescriptor();
    app.executeAction( sid.make, adjustment_layer_d, DialogModes.NO );
    return app.activeDocument.activeLayer as ArtLayer;
  }

  setBrightnessContrastAdjustmentLayerDescriptor(
    brightness:number      = 0, 
    contrast:number        = 0
    ): ActionDescriptor {

    var adjustment_layer_d = new ActionDescriptor();
        var ref2 = new ActionReference();
        ref2.putEnumerated( sid.adjustmentLayer, sid.ordinal, sid.targetEnum );
    adjustment_layer_d.putReference( sid.null, ref2 );
        var desc232 = new ActionDescriptor();
        desc232.putInteger( sid.brightness, brightness );
        desc232.putInteger( sid.center, contrast );
        desc232.putBoolean( sid.useLegacy, false );
    adjustment_layer_d.putObject( sid.to, sid.brightnessEvent, desc232 );

    return adjustment_layer_d;
  }

  setBrightnessContrastAdjustmentLayer(
    brightness:number      = 0, 
    contrast:number        = 0
    ) {
    let action_d = this.setBrightnessContrastAdjustmentLayerDescriptor(
      brightness,
      contrast
    );
    app.executeAction( sid.set, action_d, DialogModes.NO );
  }

  addBrightnessContrast(
    brightness:number      = 0, 
    contrast:number        = 0,
    dialogMode:DialogModes = DialogModes.NO
    ) : ArtLayer
    { 
      this.addBrightnessContrastAdjustmentLayer();
      this.setBrightnessContrastAdjustmentLayer( brightness, contrast )
      return app.activeDocument.activeLayer as ArtLayer;
  }

  addInvertAdjustmentLayer()
  {
    var desc25 = new ActionDescriptor();
      var ref2 = new ActionReference();
      ref2.putClass( sid.adjustmentLayer );
    desc25.putReference( sid.null, ref2 );
    var idusing = sid.using;
      var desc26 = new ActionDescriptor();
      desc26.putClass( sid.type, sid.invert );
    desc25.putObject( idusing, sid.adjustmentLayer, desc26 );
    app.executeAction( sid.make, desc25, DialogModes.NO );
    return app.activeDocument.activeLayer as ArtLayer;
  }

  setLevelsAdjustmentLayerDescriptor(
    inBlack:number    = 0, 
    inWhite:number    = 255, 
    gamma:number      = 1.00, 
    outBlack:number   = 0, 
    outWhite:number   = 255
    ): ActionDescriptor {

    /* Adjustment Layer */
    let adjustment_layer_d = new ActionDescriptor();
    let adjustment_layer_r = new ActionReference();
    adjustment_layer_r.putEnumerated(sid.adjustmentLayer, sid.composite, sid.targetEnum);
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

    /* Assemble */
    let adjustments_d = new ActionDescriptor();
    adjustments_d.putEnumerated(sid.presetKind, sid.presetKindType, sid.presetKindCustom);
    let adjustments_list = new ActionList();
    adjustments_list.putObject(sid.levelsAdjustment, channel_d);
    adjustments_d.putList(sid.adjustment, adjustments_list);
    adjustment_layer_d.putObject(sid.to, sid.levels, adjustments_d);
    return adjustment_layer_d;
  }

  setLevelsFromDescriptor( 
    adjustment_layer_d: ActionDescriptor,
    dialogMode:DialogModes = DialogModes.NO
  ) : ArtLayer
  {
    app.executeAction(sid.set, adjustment_layer_d, dialogMode);
    return app.activeDocument.activeLayer as ArtLayer;
  }

  setLevels(
    inBlack:number    = 0, 
    inWhite:number    = 255, 
    gamma:number      = 1.00, 
    outBlack:number   = 0, 
    outWhite:number   = 255, 
    dialogMode:DialogModes = DialogModes.NO
    ) {
    let adjustment_layer_d = this.setLevelsAdjustmentLayerDescriptor(
      inBlack,
      inWhite,
      gamma,
      outBlack,
      outWhite
    );
    return this.setLevelsFromDescriptor( adjustment_layer_d, dialogMode );
  }

  setAutoLevels(
    gamma:number      = 1.00, 
    outBlack:number   = 0, 
    outWhite:number   = 255, 
    threshold:number  = 0,
    dialogMode:DialogModes = DialogModes.NO
    ) { 
    let histogram = this.getHistogram();
    let min = this.findHistogramMin(histogram, threshold);
    let max = this.findHistogramMax(histogram, threshold);
    if ( max - min > 1 )
      return this.setLevels( min, max, gamma, outBlack, outWhite );
    else
      return this.setLevels( 0, 255, gamma, outBlack, outWhite );

  }

  addLevelsWithDescriptor( 
    adjustment_layer_d: ActionDescriptor,
    dialogMode:DialogModes = DialogModes.NO
  ) : ArtLayer
  {
    let this_layer = this.addAdjustmentLayer('Levels', adjustment_layer_d, dialogMode);
    this.setLevelsFromDescriptor( adjustment_layer_d, dialogMode );
    return this_layer;
  }

  addLevels(
    inBlack:number    = 0, 
    inWhite:number    = 255, 
    gamma:number      = 1.00, 
    outBlack:number   = 0, 
    outWhite:number   = 255, 
    dialogMode:DialogModes = DialogModes.NO
    ) : ArtLayer
    { 
      let adjustment_layer_d = this.setLevelsAdjustmentLayerDescriptor(
        inBlack,
        inWhite,
        gamma,
        outBlack,
        outWhite
      );
      let levels = this.addLevelsWithDescriptor( adjustment_layer_d, dialogMode );
      this.setLevelsFromDescriptor( adjustment_layer_d, dialogMode );
      return levels;
  }

  getAutoLevelsMinMax(
    threshold:number  = 0
  )
  {
    let histogram = this.getHistogram();
    let minmax = new MinMax();
    minmax.min = this.findHistogramMin(histogram, threshold);
    if ( minmax.min < 0 )
      minmax.min =  0;
    minmax.max = this.findHistogramMax(histogram, threshold);
    if ( minmax.max > 255 )
      minmax.max = 255;
    return minmax;
  }

  addAutoLevels(
    gamma:number      = 1.00, 
    outBlack:number   = 0, 
    outWhite:number   = 255, 
    threshold:number  = 0,
    dialogMode:DialogModes = DialogModes.NO
    ) : ArtLayer
    { 
    let minmax = this.getAutoLevelsMinMax( threshold );
    return this.addAutoLevelsFromMinMax(
      minmax,
      gamma,
      outBlack,
      outWhite,
      dialogMode
    );
  }

  addAutoLevelsFromMinMax(
    minmax: MinMax,
    gamma:number      = 1.00, 
    outBlack:number   = 0, 
    outWhite:number   = 255, 
    dialogMode:DialogModes = DialogModes.NO
    ) : ArtLayer
  { 
    return this.addLevels( 
      minmax.min, 
      minmax.max, 
      gamma,
      outBlack,
      outWhite
    );
  }

  setBlendIf(
    source_black_min: number = 0,
    source_black_max: number = 0,
    source_white_min: number = 255,
    source_white_max: number = 255,
    destination_black_min: number = 0,
    destination_black_max: number = 0,
    destination_white_min: number = 255,
    desaturate: number = 255
  )
  {
    var desc245 = new ActionDescriptor();
        var ref4 = new ActionReference();
        ref4.putEnumerated( sid.layer, sid.ordinal,sid.targetEnum );
    desc245.putReference( sid.null, ref4 );
        var desc246 = new ActionDescriptor();
            var list6 = new ActionList();
                var desc247 = new ActionDescriptor();
                    var ref5 = new ActionReference();
                    ref5.putEnumerated(sid.channel,sid.channel,sid.gray );
                desc247.putReference(sid.channel, ref5 );
                desc247.putInteger(sid.srcBlackMin, source_black_min );
                desc247.putInteger(sid.srcBlackMax, source_black_max );
                desc247.putInteger(sid.srcWhiteMin, source_white_min );
                desc247.putInteger(sid.srcWhiteMax, source_white_max );
                desc247.putInteger(sid.destBlackMin, destination_black_min );
                desc247.putInteger(sid.destBlackMax, destination_black_max );
                desc247.putInteger(sid.destWhiteMin, destination_white_min );
                desc247.putInteger(sid.desaturate, desaturate );
            list6.putObject(sid.blendRange, desc247 );
        desc246.putList(sid.blendRange, list6 );
            var desc248 = new ActionDescriptor();
            desc248.putUnitDouble(sid.scale,sid.percentUnit, 1000.000000 );
        desc246.putObject(sid.layerEffects,sid.layerEffects, desc248 );
    desc245.putObject(sid.to, sid.layer, desc246 );
    app.executeAction( sid.set, desc245, DialogModes.NO );    
  }

  addGroup( 
    group_name?: string 
  ) : LayerSet
  {
    let current_layer = app.activeDocument.activeLayer as ArtLayer;
    current_layer.isBackgroundLayer = false;
    let parent_set = current_layer.parent as LayerSet;
    let new_layer_set = parent_set.layerSets.add();
    app.activeDocument.activeLayer = new_layer_set;
    new_layer_set.move( current_layer, ElementPlacement.PLACEBEFORE );
    let temp_layer = new_layer_set.artLayers.add();
    // PLACEATEND only works on ArtLayers, not LayerSets (WTF Adobe?)
    temp_layer.move( new_layer_set, ElementPlacement.PLACEATEND );
    current_layer.move( temp_layer, ElementPlacement.PLACEBEFORE );
    temp_layer.remove();
    app.activeDocument.activeLayer = new_layer_set;
    new_layer_set.name = (group_name !== undefined) ? group_name : current_layer.name;
    return new_layer_set;
  }

  addEmptyGroup( group_name: string ) : LayerSet
  {
    var desc225 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putClass( sid.layerSection );
    desc225.putReference( sid.null, ref1 );
    desc225.putInteger( sid.layerSectionStart, 2 );
    desc225.putInteger( sid.layerSectionEnd, 3 );
    desc225.putString( sid.name, group_name );
    app.executeAction( sid.make, desc225, DialogModes.NO );
    let new_group = app.activeDocument.activeLayer as LayerSet;
    new_group.name = group_name;
    return new_group;
  }

  ungroup()
  : LayerSet
  {
    let layer_set = app.activeDocument.activeLayer as LayerSet;
    let parent_layer_set = layer_set.parent as LayerSet;

    var desc287 = new ActionDescriptor();
        var ref17 = new ActionReference();
        ref17.putEnumerated( sid.layer, sid.ordinal, sid.targetEnum );
    desc287.putReference( sid.null, ref17 );
    app.executeAction( sid.ungroupLayersEvent, desc287, DialogModes.NO );

    return parent_layer_set;
  }

  addLayerMask()
  {
    var desc231 = new ActionDescriptor();
    desc231.putClass( sid.new, sid.channel );
        var ref2 = new ActionReference();
        ref2.putEnumerated( sid.channel, sid.channel, sid.mask );
    desc231.putReference( sid.at, ref2 );
    desc231.putEnumerated( sid.using, sid.userMaskEnabled, sid.revealAll );
    app.executeAction( sid.make, desc231, DialogModes.NO );
  }

  applyImage( 
    layer_name: string,
    should_invert: boolean = false,
    blend_descriptor: number = sid.normal
  )
  {
    var desc276 = new ActionDescriptor();
        var desc277 = new ActionDescriptor();
            var ref11 = new ActionReference();
            ref11.putEnumerated( sid.channel, sid.channel, sid.RGB );
            ref11.putName( sid.layer, layer_name );
        desc277.putReference( sid.to, ref11 );
        desc277.putEnumerated( sid.calculation, sid.calculationType, blend_descriptor );
        desc277.putBoolean( sid.invert, should_invert );
        desc277.putBoolean( sid.preserveTransparency, true );
        if ( blend_descriptor == sid.subtract ) {
          desc277.putDouble( sid.scale, 2.000000 );
          desc277.putInteger( sid.offset, 128 );
        }
    desc276.putObject( sid.with, sid.calculation, desc277 );
    app.executeAction( sid.applyImageEvent, desc276, DialogModes.NO );    

  }

  applyImageSubtract( 
    layer_name: string,
    scale: number = 2.000000,
    offset: number = 128
  ) {
    var desc281 = new ActionDescriptor();
        var desc282 = new ActionDescriptor();
            var ref13 = new ActionReference();
            ref13.putEnumerated( sid.channel, sid.channel, sid.RGB );
            ref13.putName( sid.layer, layer_name );
        desc282.putReference( sid.to, ref13 );
        desc282.putEnumerated( sid.calculation, sid.calculationType, sid.subtract );
        desc282.putDouble( sid.scale, 2.000000 );
        desc282.putInteger( sid.offset, 128 );
    desc281.putObject( sid.with, sid.calculation, desc282 );
    app.executeAction( sid.applyImageEvent, desc281, DialogModes.NO );
  }
  
  autoLevelObject(
    gamma:number      = 1.00, 
    outBlack:number   = 0, 
    outWhite:number   = 255, 
    dialogMode:DialogModes = DialogModes.NO
  ) : ArtLayer
  {
    let name = app.activeDocument.activeLayer.name;
    this.addGroup();
    app.activeDocument.activeLayer.name = name;
    this.addAutoLevels(
      gamma,
      outBlack,
      outWhite,
      dialogMode
    );
    app.activeDocument.activeLayer = app.activeDocument.activeLayer.parent as LayerSet;
    return this.createSmartObjectFromActiveLayer();
  }

  levelObject(
    inBlack:number    = 0, 
    inWhite:number    = 255, 
    gamma:number      = 1.00, 
    outBlack:number   = 0, 
    outWhite:number   = 255, 
    dialogMode:DialogModes = DialogModes.NO
  ) : ArtLayer
  {
    let name = app.activeDocument.activeLayer.name;
    this.addGroup();
    app.activeDocument.activeLayer.name = name;
    this.addLevels(
      inBlack,
      inWhite,
      gamma,
      outBlack,
      outWhite,
      dialogMode
    );
    app.activeDocument.activeLayer = app.activeDocument.activeLayer.parent as LayerSet;
    return this.createSmartObjectFromActiveLayer();
  }

  essentializeFeatures()
  {
    let current_layer = app.activeDocument.activeLayer as ArtLayer;
    this.addDenoise();
    current_layer.applyGaussianBlur(2.0);
    current_layer.applyMedianNoise(3.0);
    current_layer.applyMedianNoise(2.0);
    current_layer.applyMedianNoise(1.0);
    this.addDenoise();
  }

  addDenoise()
  {
    var desc321 = new ActionDescriptor();
    var idcolorNoise = sid.colorNoise;
    var idpercentUnit = sid.percentUnit;
    desc321.putUnitDouble( idcolorNoise, idpercentUnit, 75.000000 );
    var idsharpen = sid.sharpen;
    var idpercentUnit = sid.percentUnit;
    desc321.putUnitDouble( idsharpen, idpercentUnit, 15.000000 );
    var idremoveJPEGArtifact = sid.removeJPEGArtifact;
    desc321.putBoolean( idremoveJPEGArtifact, false );
    var idchannelDenoise = sid.channelDenoise;
        var list6 = new ActionList();
            var desc322 = new ActionDescriptor();
            var idchannel = sid.channel;
                var ref33 = new ActionReference();
                var idchannel = sid.channel;
                var idchannel = sid.channel;
                var idcomposite = sid.composite;
                ref33.putEnumerated( idchannel, idchannel, idcomposite );
            desc322.putReference( idchannel, ref33 );
            var idamount = sid.amount;
            desc322.putInteger( idamount, 10 );
            var idedgeFidelity = sid.edgeFidelity;
            desc322.putInteger( idedgeFidelity, 100 );
        var idchannelDenoiseParams = sid.channelDenoiseParams;
        list6.putObject( idchannelDenoiseParams, desc322 );
    desc321.putList( idchannelDenoise, list6 );
    app.executeAction( sid.denoise, desc321, DialogModes.NO );
    return app.activeDocument.activeLayer;
  }

  addExposure(
    exposure: number = 0,
    offset: number = 0,
    gamma_correction: number = 1.0
  ) {

    var desc213 = new ActionDescriptor();
        var ref36 = new ActionReference();
        ref36.putClass( sid.adjustmentLayer );
    desc213.putReference( sid.null, ref36 );
        var desc214 = new ActionDescriptor();
            var desc215 = new ActionDescriptor();
            desc215.putEnumerated( sid.presetKind, sid.presetKindType, sid.presetKindDefault );
            desc215.putDouble( sid.exposure, exposure );
            desc215.putDouble( sid.offset, offset );
            desc215.putDouble( sid.gammaCorrection, gamma_correction );
        desc214.putObject( sid.type, sid.exposure, desc215 );
    desc213.putObject( sid.using, sid.adjustmentLayer, desc214 );
    app.executeAction( sid.make, desc213, DialogModes.NO );
    return app.activeDocument.activeLayer;
  }

  findLayer( layer_name, source ) {
    let this_layer = undefined;
    try { this_layer = source.getByName( layer_name ) } 
    catch (err) { }
    finally {
      return this_layer;
    }
  }

  findArtLayer( layer_name ) : ArtLayer {
    return this.findLayer( layer_name, app.activeDocument.artLayers );
  }

  findLayerSet( layer_name ) : LayerSet {
    return this.findLayer( layer_name, app.activeDocument.layerSets );
  }

  findOrCreateLayer( layer_name, source ) {
    let this_layer = undefined;
    try { this_layer = source.getByName( layer_name ) } 
    catch (err) { 
      this_layer = source.add();
      this_layer.name = layer_name;
    }
    finally {
      return this_layer;
    }
  }

  findOrCreateArtLayer( layer_name ) : ArtLayer {
    return this.findOrCreateLayer( layer_name, app.activeDocument.artLayers );
  }

  findOrCreateLayerSet( layer_name ) : LayerSet {
    return this.findOrCreateLayer( layer_name, app.activeDocument.layerSets );
  }

  hasBackgroundLayer() { 
    let ref = new ActionReference(); 
    ref.putProperty( cid.Property, sid.hasBackgroundLayer); 
    ref.putEnumerated( cid.Document, cid.Composite, cid.Target);
    var desc =  app.executeActionGet(ref); 
    var res = desc.getBoolean(sid.hasBackgroundLayer); 
    return res;   
  }

  findHistogramMin( 
    histogram,
    threshold:number  = 0
    ): number {
    let min = undefined;
    for ( min = 0 ; min < histogram.length ; ++min ) {
      if ( histogram[min] > threshold ) {
        break;
      }
    }
    return min;
  }

  findHistogramMax( 
    histogram,
    threshold:number  = 0
  ): number {
    let max = undefined;
    for ( max = histogram.length ; max > 0 ; --max ) {
      if ( histogram[max] > threshold )
        break;
    }
    return max;
  }

  activateLayerByIndex(
    index: number,
    add: boolean = false
  )
  {
  }

  activateLayerById(
    id: number,
    add_to_selection: boolean = false,
    visible: boolean = true
  )
  {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putIdentifier(cid.Layer, id);
    desc.putReference(cid.null, ref);
    if ( add_to_selection ) {
      desc.putEnumerated(
        sid.selectionModifier,
        sid.selectionModifierType,
        sid.addToSelection
      );
    }
    if ( visible ) {
      desc.putBoolean(
        cid.MakeVisible, 
        visible
      )
    };
    app.executeAction( cid.Select, desc, DialogModes.NO );
  }

  layerID()
  {
    var ref = new ActionReference();
    ref.putEnumerated(cid.Layer, cid.Ordn, cid.Trgt); // reference is active layer
    var layerDesc = app.executeActionGet(ref);
    var layerID = layerDesc.getInteger(sid.layerID);
    return layerID;
  }

  isVisible() {
    var ref = new ActionReference();
    ref.putIdentifier(cid.Layer, app.activeDocument.activeLayer.id);
    var layer_desc = app.executeActionGet(ref);

    var is_visible = layer_desc.getBoolean(cid.Visible);

    return is_visible;
  }

  getLayerExpandedRef()
  {
    var id = app.activeDocument.activeLayer.id;
    var r = new ActionReference();    
    r.putProperty(sid.property, sid.layerSectionExpanded);
    r.putIdentifier(sid.layer, id);
    return r;
  }

  getLayerExpandedDescriptor()
  {
    var r = this.getLayerExpandedRef();
    return app.executeActionGet(r);
  }

  isOpen() : boolean 
  {
    let desc = this.getLayerExpandedDescriptor();
    var is_open = desc.getBoolean( sid.layerSectionExpanded );
    
    return is_open;
  }

  isClosed()
  {
    return ! this.isOpen();
  }

  openGroup()
  {
    let layer_expand_ref = this.getLayerExpandedRef();
    let desc = app.executeActionGet(layer_expand_ref);
    desc.putBoolean( sid.layerSectionExpanded, true );
    app.executeAction(sid.property, desc);
  }

  closeGroup()
  {
  }

  toggleGroup()
  {
    var groupname = app.activeDocument.activeLayer.name; // remember name of group
    var visible = app.activeDocument.activeLayer.visible ;
    var opacity = app.activeDocument.activeLayer.opacity ;
    var blend_mode = app.activeDocument.activeLayer.blendMode; 

    var idungroupLayersEvent = sid.ungroupLayersEvent; // this part from  Script Listene -- ungroup group
    
    var desc14 = new ActionDescriptor();
    
    var idnull = cid.null;
    
    var ref13 = new ActionReference();
    
    var idLyr = cid.Layer;
    
    var idOrdn = cid.Composite;
    
    var idTrgt = cid.Target;
    
    ref13.putEnumerated( idLyr, idOrdn, idTrgt );
    
    desc14.putReference( idnull, ref13 );
    
    app.executeAction( idungroupLayersEvent, desc14, DialogModes.NO );
    
    var idMk = cid.Make; // this part from  Script Listene --  group selected layers
    
    var desc15 = new ActionDescriptor();
    
    var idnull = cid.null;
    
    var ref14 = new ActionReference();
    
    var idlayerSection = sid.layerSection;
    
    ref14.putClass( idlayerSection );
    
    desc15.putReference( idnull, ref14 );
    
    var idFrom = cid.From;
    
    var ref15 = new ActionReference();
    
    var idLyr = cid.Layer;
    
    var idOrdn = cid.Composite;
    
    var idTrgt = cid.Target;
    
    ref15.putEnumerated( idLyr, idOrdn, idTrgt );
    
    desc15.putReference( idFrom, ref15 );
    
    app.executeAction( idMk, desc15, DialogModes.NO );
    
    app.activeDocument.activeLayer.name = groupname; // recall group name
    app.activeDocument.activeLayer.opacity = opacity; 
    app.activeDocument.activeLayer.visible = visible; 
    app.activeDocument.activeLayer.blendMode = blend_mode; 

    return app.activeDocument.activeLayer;
    

    // let is_open = undefined;
    // if ( this.isOpen() ) {
    //   this.closeGroup();
    //   is_open = false;
    // }
    // else {
    //   this.openGroup();
    //   is_open = true;
    // }
    // return is_open;
  }

  convertTo8Bit() {

    if ( app.activeDocument.bitsPerChannel != 8 ) {
      let convert_d = new ActionDescriptor();
      convert_d.putInteger( sid.depth, 8 );
      convert_d.putBoolean( sid.merge, false );
      app.executeAction( sid.convertMode, convert_d, DialogModes.NO );
    }

  }

  runFilterGallery() : ActionDescriptor {
    let filter_gallery_d = new ActionDescriptor();
    filter_gallery_d.putEnumerated( cid.GEfk, cid.GEft, sid.accentedEdges );
    let descriptor = this.executeFilterGalleryDescriptor( filter_gallery_d, DialogModes.ALL );
    return descriptor;
  }

  executeFilterGallery(
    edge_width: number,
    edge_brightness: number,
    edge_smoothness: number,
    dialog_mode = DialogModes.NO
  ) : ActionDescriptor {
    let execute_filter_gallery_d = new ActionDescriptor();
    execute_filter_gallery_d.putEnumerated( cid.GEfk, cid.GEft, sid.accentedEdges );
    execute_filter_gallery_d.putInteger( sid.edgeWidth, edge_width );
    execute_filter_gallery_d.putInteger( sid.edgeBrightness, edge_brightness );
    execute_filter_gallery_d.putInteger( sid.smoothness, edge_smoothness );
    let descriptor = this.executeFilterGalleryDescriptor( execute_filter_gallery_d, dialog_mode );
    return descriptor;
  }

  executeFilterGalleryDescriptor(
    execute_filter_gallery_d: ActionDescriptor = new ActionDescriptor(),
    dialog_mode = DialogModes.NO
  ) : ActionDescriptor {
    let descriptor = app.executeAction( cid.GEfc, execute_filter_gallery_d, dialog_mode );
    return descriptor;
  }

   applyHighPass(
    radius: number = 200,
    dialog_mode: DialogModes = DialogModes.NO
  )
  {
    var desc235 = new ActionDescriptor();
    desc235.putUnitDouble( sid.radius, sid.pixelsUnit, radius );
    app.executeAction( sid.highPass, desc235, dialog_mode );
  }

  applySmartSharpen( 
    amount:                number = 220  /* % */,
    radius:                number = 12.5 /* px */,
    reduce_noise:          number = 100  /* % */,
    shadow_fade_amount:    number = 25   /* % */,
    shadow_tonal_width:    number = 25   /* % */,
    shadow_radius:         number = 25   /* px */,
    highlight_fade_amount: number = 25   /* % */,
    highlight_tonal_width: number = 25   /* % */,
    highlight_radius:      number = 25   /* px */,
    dialog_mode:           DialogModes = DialogModes.NO 
    )
  {
    var desc237 = new ActionDescriptor();
    desc237.putEnumerated( sid.presetKind, sid.presetKindType, sid.presetKindCustom );
    desc237.putBoolean( sid.useLegacy, false );
    desc237.putUnitDouble( sid.amount, sid.percentUnit, amount );
    desc237.putUnitDouble( sid.radius, sid.pixelsUnit, radius );
    desc237.putUnitDouble( sid.noiseReduction, sid.percentUnit, reduce_noise );
    desc237.putEnumerated( sid.blur, sid.blurType, sid.lensBlur );
        var desc238 = new ActionDescriptor();
        desc238.putUnitDouble( sid.amount, sid.percentUnit, shadow_fade_amount );
        desc238.putUnitDouble( sid.width, sid.percentUnit, shadow_tonal_width );
        desc238.putInteger( sid.radius, shadow_radius );
    desc237.putObject( sid.shadowMode, sid.adaptCorrectTones, desc238 );
        var desc239 = new ActionDescriptor();
        desc239.putUnitDouble( sid.amount, sid.percentUnit, highlight_fade_amount );
        desc239.putUnitDouble( sid.width, sid.percentUnit, highlight_tonal_width );
        desc239.putInteger( sid.radius, highlight_radius );
    desc237.putObject( sid.highlightMode, sid.adaptCorrectTones, desc239 );
    app.executeAction( sid.smartSharpen, desc237, dialog_mode );
  }

  targetLayers()
  {
    let reference = new ActionReference();
    reference.putProperty(sid.property, sid.targetLayers);
    reference.putEnumerated(sid.document, sid.ordinal, sid.targetEnum);
    let layer_list =  app.executeActionGet(reference).hasKey(sid.targetLayers) ? app.executeActionGet(reference).getList(sid.targetLayers) : [];
    return layer_list;
  }

  // From https://community.adobe.com/t5/photoshop-ecosystem-discussions/get-selected-layers/td-p/3332778
  // But doesn't sem to work for count?
  // targetLayerIDs()
  // {
  //   let ref = new ActionReference();
  //   ref.putEnumerated( cid.Dcmn, cid.Ordn, cid.Trgt); 
  //   let docDesc = app.executeActionGet(ref);
  //   let targetLayersIDs = docDesc.getList(sid.targetLayersIDs);
  //   let theIDs = new Array;
  //   for (var m = 0; m < targetLayersIDs.count; m++) {
  //     theIDs.push(targetLayersIDs.getReference(m).getIdentifier())
  //   };

  // }


  isLayerSet(
    source_layer: Layer = app.activeDocument.activeLayer
  ) : boolean
  {
    let active_layer_is_set = ((source_layer as LayerSet).layerSets !== undefined );
    return active_layer_is_set;
  }

  isArtLayer(
    source_layer: Layer = app.activeDocument.activeLayer
  ) : boolean
  {
    let active_layer_is_art = ! this.isLayerSet( source_layer );
    return active_layer_is_art;
  }

  ensureActiveLayerIsSet()
  {
    let active_layer_is_set = this.isLayerSet();
    if ( ! active_layer_is_set ) {
      throw( "Error: Expected LayerSet as active layer." );
    }
  }

  ensureActiveLayerIsArt()
  {
    let active_layer_is_art = this.isArtLayer();
    if ( ! active_layer_is_art ) {
      throw( "Error: Expected ArtLayer as active layer." );
    }
  }

  convertToSmartObjectIfAppropriate( layer: ArtLayer = app.activeDocument.activeLayer as ArtLayer )
  {
    if (layer.kind !== LayerKind.SMARTOBJECT) {
      app.activeDocument.activeLayer = layer;
      let opacity = layer.opacity;
      layer.opacity = 100;
      this.createSmartObjectFromActiveLayer();
      layer = app.activeDocument.activeLayer as ArtLayer;
      layer.opacity = opacity;
    }
    return layer;
  }

}

globalThis.ps = new Helper;
let helper = globalThis.ps;

export { Helper, helper };
