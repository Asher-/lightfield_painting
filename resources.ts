/// <reference types="types-for-adobe/Photoshop/2015.5"/>

import { helper as ps } from './helper';
import { character_ids as cid } from './dom/ids/character_ids';
import { string_ids as sid } from './dom/ids/string_ids';

import { Configuration } from './configuration/configuration';
import { GaussianBlurConfiguration } from './configuration/gaussian_blur';
import { FrequencySeparationBlendGroupConfiguration } from './configuration/frequency_separation_blend_group';
import { HighPassConfiguration } from './configuration/high_pass';
import { SmartSharpenConfiguration } from './configuration/smart_sharpen';
import { IntereaveLayersConfiguration } from './configuration/interleave_layers';
import { MixbackConfiguration } from './configuration/mixback';

import { MinMax } from './object/min_max_number';
import { ScreenInterleavePrompt } from './object/screen_interleave_prompt';

class Resources 
{
  base: ArtLayer
  original: ArtLayer
  resources: LayerSet
  adjustmentsLayerSet: LayerSet
  hardLightLayerSet: LayerSet
  hardLightContentLayerSet: LayerSet
  linearLightLayerSet: LayerSet
  linearLightContentLayerSet: LayerSet
  multiplyLayerSet: LayerSet
  multiplyContentLayerSet: LayerSet
  normalLayerSet: LayerSet
  normalContentLayerSet: LayerSet
  workLayerSet: LayerSet
  essentializedBase: ArtLayer
  static layerName: string = 'Resources'
  static baseName: string = 'Base'
  static originalName: string = 'Original'
  static adjustmentsLayerName: string = 'Adjustments'

  constructor()
  {
  }

  initBase()
  {
    if ( this.base === undefined ) {
      if ( ps.hasBackgroundLayer() && ((app.activeDocument.activeLayer as LayerSet).layerSets === undefined ) )
        this.base = app.activeDocument.activeLayer as ArtLayer;
      else 
        this.base = app.activeDocument.artLayers[app.activeDocument.artLayers.length-1];
      app.activeDocument.activeLayer = this.base;
      if (this.base.kind !== LayerKind.SMARTOBJECT) {
        ps.createSmartObjectFromActiveLayer();
        this.base = app.activeDocument.activeLayer as ArtLayer;
        this.base.name = Resources.baseName;
      }
    }
    return this.base;
  }

  initOriginal() {
    this.initBase();
    this.initResources();
    this.original = ps.findLayer( Resources.originalName, this.resources.artLayers );
    if ( this.original === undefined ) {
      let temp_layer = this.resources.artLayers.add();
      this.original = this.base.duplicate(
        temp_layer,
        ElementPlacement.PLACEBEFORE
      ) as ArtLayer;
      temp_layer.remove();
      this.original.name = Resources.originalName;
    }
    return this.original;
  }
  
  initResources()
  {
    this.resources = ps.findOrCreateLayerSet( Resources.layerName );
    return this.resources;
  }

  select()
  {
    app.activeDocument.activeLayer = this.resources;
  }

  selectBase()
  {
    if ( this.base !== undefined ) { 
      app.activeDocument.activeLayer = this.base;
      return true;
    }
    else if ( this.base = ps.findArtLayer( Resources.baseName ) ) {
      return true;
    }
    else {
      this.initBase();
      return false;
    }
  }

  selectEssentializedBase()
  {
    app.activeDocument.activeLayer = this.essentializedBase;
  }

  selectAdjustments()
  {
    app.activeDocument.activeLayer = this.adjustmentsLayerSet;
  }

  selectHardLight()
  {
    app.activeDocument.activeLayer = this.hardLightLayerSet;
  }

  selectHardLightContent()
  {
    app.activeDocument.activeLayer = this.hardLightContentLayerSet;
  }

  selectLinearLight()
  {
    app.activeDocument.activeLayer = this.linearLightLayerSet;
  }

  selectLinearLightContent()
  {
    app.activeDocument.activeLayer = this.linearLightContentLayerSet;
  }

  selectMultiply()
  {
    app.activeDocument.activeLayer = this.multiplyLayerSet;
  }

  selectMultiplyContent()
  {
    app.activeDocument.activeLayer = this.multiplyContentLayerSet;
  }

  selectNormal()
  {
    app.activeDocument.activeLayer = this.normalLayerSet;
  }

  selectNormalContent()
  {
    app.activeDocument.activeLayer = this.normalContentLayerSet;
  }


  initAdjustments()
  {
    this.initResources();
    this.initBase();
    if ( this.adjustmentsLayerSet !== null )
      this.adjustmentsLayerSet = ps.findOrCreateLayer( 
        Resources.adjustmentsLayerName, 
        this.resources.layerSets 
      );
    this.selectAdjustments();
  }

  initHardLightResources(
    levels_adjustment_d = ps.setLevelsAdjustmentLayerDescriptor(
      0,
      255,
      4.0,
      0,
      255
    )
  )
  {
    this.initAdjustments();
    this.initAutoLeveledBase();
    this.resources.visible = true;
    this.initEssentializedBase();
    this.hardLightLayerSet = this.adjustmentsLayerSet.layerSets.add();
    this.hardLightLayerSet.name = 'Hard Light';
    this.hardLightContentLayerSet = this.hardLightLayerSet.layerSets.add();
    this.hardLightContentLayerSet.name = 'Hard Light Content';
    this.hardLightContentLayerSet.opacity = 25;
    this.hardLightContentLayerSet.blendMode = BlendMode.HARDLIGHT;
    let content_levels = ps.addLevelsWithDescriptor( levels_adjustment_d );
    this.selectEssentializedBase();
    app.activeDocument.activeLayer.duplicate( 
      content_levels, 
      ElementPlacement.PLACEAFTER 
    ) as ArtLayer;
    this.selectHardLight();
    ps.addLevels();
    this.selectHardLight();
    ps.toggleGroup();
  }

  initLinearLightResources(
    levels_adjustment_d = ps.setLevelsAdjustmentLayerDescriptor(
      0,
      255,
      4.0,
      0,
      255
    )
  )
  {
    this.initAdjustments();
    this.linearLightLayerSet = this.adjustmentsLayerSet.layerSets.add();
    this.linearLightLayerSet.name = 'Linear Light';
    this.linearLightContentLayerSet = this.linearLightLayerSet.layerSets.add();
    this.linearLightContentLayerSet.name = 'Linear Light Content';
    this.linearLightContentLayerSet.opacity = 25;
    this.linearLightContentLayerSet.blendMode = BlendMode.HARDLIGHT;
    let content_levels = ps.addLevelsWithDescriptor( levels_adjustment_d );
    this.selectEssentializedBase();
    app.activeDocument.activeLayer.duplicate( 
      content_levels, 
      ElementPlacement.PLACEAFTER 
    ) as ArtLayer;
    this.selectLinearLight();
    ps.addLevels();
    this.selectLinearLight();
    ps.toggleGroup();
  }

  initNormalResources(
    levels_adjustment_d = ps.setLevelsAdjustmentLayerDescriptor(
      0,
      255,
      1.0,
      0,
      255
    )
  )
  {
    this.initAdjustments();
    this.normalLayerSet = this.adjustmentsLayerSet.layerSets.add();
    this.normalLayerSet.name = 'Normal';
    this.normalContentLayerSet = this.normalLayerSet.layerSets.add();
    this.normalContentLayerSet.name = 'Normal Content';
    this.normalContentLayerSet.opacity = 25;
    this.normalContentLayerSet.blendMode = BlendMode.NORMAL;
    let content_levels = ps.addLevelsWithDescriptor( levels_adjustment_d );
    this.selectBase();
    app.activeDocument.activeLayer.duplicate( 
      content_levels, 
      ElementPlacement.PLACEAFTER 
    ) as ArtLayer;
    this.selectNormal();
    ps.addLevels();    
    this.selectNormal();
    ps.toggleGroup();
  }

  initMultiplyResources(
    levels_adjustment_d = ps.setLevelsAdjustmentLayerDescriptor(
      0,
      255,
      0.75,
      0,
      255
    )
  )
  {
    this.initAdjustments();
    this.initAutoLeveledBase();
    this.resources.visible = true;
    this.initEssentializedBase();
    this.multiplyLayerSet = this.adjustmentsLayerSet.layerSets.add();
    this.multiplyLayerSet.name = 'Multiply';
    this.multiplyContentLayerSet = this.multiplyLayerSet.layerSets.add();
    this.multiplyContentLayerSet.name = 'Multiply Content';
    this.multiplyContentLayerSet.opacity = 25;
    this.multiplyContentLayerSet.blendMode = BlendMode.MULTIPLY;
    let content_levels = ps.addLevelsWithDescriptor( levels_adjustment_d );
    this.selectEssentializedBase();
    app.activeDocument.activeLayer.duplicate( 
      content_levels, 
      ElementPlacement.PLACEAFTER 
    ) as ArtLayer;
    this.selectMultiply();
    ps.addLevels();    
    this.selectMultiply();
    ps.toggleGroup();
  }

  initAutoLeveledBase()
  {
    if ( ! this.selectBase() ) {
      ps.autoLevelObject();    
      app.activeDocument.activeLayer.name = 'Base';
    }
  }

  initEssentializedBase()
  {
    if ( this.essentializedBase === undefined ) {
      this.essentializedBase = app.activeDocument.activeLayer.duplicate( 
        this.adjustmentsLayerSet, 
        ElementPlacement.PLACEBEFORE 
      ) as ArtLayer;
      app.activeDocument.activeLayer = this.essentializedBase;
      app.activeDocument.activeLayer.name = 'Essentialized Base';
      // ps.essentializeFeatures();
    }
  }

  initWorkingGroup() 
  {
    this.workLayerSet = app.activeDocument.layerSets.add();
    this.workLayerSet.move( this.resources, ElementPlacement.PLACEAFTER );
    this.workLayerSet.name = 'Work';
  }

  initChannelIntensityCycle()
  {
    /*
      Channel Luminance: from RGB Channel Split

      Adjustments 
        Multiply
          Limits
          Multiply Content (75%)
            Limits
            Base
        Normal
          Limits
          Normal Content (75%)
            Limits
            Base
        Hard Light
          Limits
          Hard Light Content (75%)
            Limits
            Base

    */
    this.initAdjustments();
    this.initAutoLeveledBase();
    this.initEssentializedBase();
    this.initHardLightResources(ps.setLevelsAdjustmentLayerDescriptor(
      0,
      255,
      4.0,
      105,
      150
    ));
    this.initNormalResources(ps.setLevelsAdjustmentLayerDescriptor(
      0,
      255,
      1.15,
      15,
      195
    ));
    this.initMultiplyResources(ps.setLevelsAdjustmentLayerDescriptor(
      0,
      255,
      5.0,
      170,
      235
    ));
    this.initWorkingGroup();
    this.resources.visible = false;
    this.adjustmentsLayerSet.layerSets[0].visible = false;
    this.adjustmentsLayerSet.layerSets[1].visible = false;
  }

  initChannelIntensityMap()
  {
    this.initAdjustments();
    this.initAutoLeveledBase();
    this.resources.visible = true;
    this.initEssentializedBase();
    this.initHardLightResources(ps.setLevelsAdjustmentLayerDescriptor(
      0,
      255,
      0.25,
      0,
      255
    ));
    this.initHardLightResources(ps.setLevelsAdjustmentLayerDescriptor(
      0,
      255,
      4.0,
      0,
      255
    ));
    this.initNormalResources();
    this.initLinearLightResources(ps.setLevelsAdjustmentLayerDescriptor(
      0,
      255,
      0.25,
      0,
      255
    ));
    this.initLinearLightResources(ps.setLevelsAdjustmentLayerDescriptor(
      0,
      255,
      5.0,
      0,
      255
    ));
    this.initMultiplyResources(ps.setLevelsAdjustmentLayerDescriptor(
      0,
      255,
      0.25,
      0,
      255
    ));
    this.initMultiplyResources(ps.setLevelsAdjustmentLayerDescriptor(
      0,
      255,
      5.0,
      0,
      255
    ));
    this.initNormalResources();
    this.initWorkingGroup();
    this.resources.visible = false;
    for ( let index = 0 ; index < this.adjustmentsLayerSet.layerSets.length - 1 ; ++index ) {
      this.adjustmentsLayerSet.layerSets[index].visible = false;
    }
  }

  autoGammaStackCycle(
    cycle_count:number = 10,
    opacity:number = 10,
    min_gamma: number = .5,
    max_gamma: number = 1.0,
    interval: number = .025
  )
  {
    for ( let this_time = 0 ; this_time < cycle_count ; ++this_time ) {
      this.autoGammaStackHighToLow(
        opacity,
        min_gamma,
        max_gamma,
        interval
      );
      this.selectBase();
      this.autoGammaStackLowToHigh(
        opacity,
        min_gamma,
        max_gamma,
        interval
      );
      app.activeDocument.flatten();
    }
  }

  autoGammaStackAlternating(
    opacity:number = 10,
    min_gamma: number = .5,
    max_gamma: number = 1.0,
    interval: number = .025
  )
  {
    let gammas = [];
    let this_low_gamma = min_gamma - interval;
    let this_high_gamma = max_gamma + interval;
    let index = undefined;
    while ( (this_low_gamma += interval) < (this_high_gamma -= interval) )
      gammas.push( this_low_gamma, this_high_gamma );
    return this.initGammaStack( opacity, gammas, 2 );
  }

  autoGammaStackHighToLow(
    opacity:number = 10,
    min_gamma: number = .5,
    max_gamma: number = 1.0,
    interval: number = .025
  )
  {
    let gammas = [];
    let this_gamma = min_gamma - interval;
    let index = undefined;
    while ( (this_gamma+=interval) <= max_gamma )
      gammas.push( this_gamma );
    return this.initGammaStack( opacity, gammas, 1, false );
  }

  autoGammaStackLowToHigh(
    opacity:number = 10,
    min_gamma: number = .5,
    max_gamma: number = 1.0,
    interval: number = .025
  )
  {
    let gammas = [];
    let this_gamma = max_gamma + interval;
    let index = undefined;
    while ( (this_gamma-=interval) > min_gamma )
      gammas.push( this_gamma );
    return this.initGammaStack( opacity, gammas, 1, false );
  }

  initGammaStack(
    opacity:number = 10,
    gammas:number[] = [
      .6,
      1.0,
      .7,
      3.0,
      .8,
      2.0,
      .9
    ],
    interval: number = 1,
    wrap_ends: boolean = false,
    auto_level: boolean = false
  )
  {
    let stack_source_layer_set = app.activeDocument.activeLayer as LayerSet;
    if ( stack_source_layer_set.layerSets === undefined )
      this.initGammaStackFromArtLayer(opacity, gammas, interval, auto_level);
    else
      this.initGammaStackFromLayerSet(opacity, gammas, interval, auto_level);
  
    if ( wrap_ends ) {
      let number_of_adjustment_layers = 2; /* levels, brightness/contrast, [levels] */
      var last_index = this.workLayerSet.artLayers.length - 1; /* bottom layer */
      let first_unwrapped_layer = this.workLayerSet.artLayers[number_of_adjustment_layers];
      let last_unwrapped_layer = this.workLayerSet.artLayers[last_index];
      let final_layer = first_unwrapped_layer.duplicate(
        last_unwrapped_layer,
        ElementPlacement.PLACEAFTER 
      );
      let slice_length = final_layer.name.length - " copy".length ;
      final_layer.name = final_layer.name.slice( 0, slice_length );
      let first_layer = last_unwrapped_layer.duplicate(
        first_unwrapped_layer,
        ElementPlacement.PLACEBEFORE 
      );
      slice_length = first_layer.name.length - " copy".length ;
      first_layer.name = first_layer.name.slice( 0, slice_length );
      app.activeDocument.activeLayer = first_layer;
      ps.addLevels();
      app.activeDocument.activeLayer = final_layer;
      final_layer.opacity = 0;
      ps.addLevels();
      app.activeDocument.activeLayer = final_layer;
    }
  }

  initGammaStackFromArtLayer(
    opacity: number,
    gammas: number[],
    interval: number,
    auto_level: boolean = false
  )
  {
    let stack_source_layer = app.activeDocument.activeLayer as ArtLayer;
    this.initBase();
    stack_source_layer = ps.autoLevelObject();
    this.initResources();
    this.resources.visible = false;
    this.initWorkingGroup();
    app.activeDocument.activeLayer = stack_source_layer;
    for ( let gamma_index = gammas.length - interval ; gamma_index > 0 ; gamma_index -= interval ) {
      for ( let interval_index = 0 ; interval_index < interval ; ++interval_index ) {
        let this_gamma = gammas[gamma_index + interval_index];
        this.initGammaLayer( stack_source_layer, this_gamma, opacity, auto_level );
      }
    }
  }

  initGammaStackFromLayerSet(
    opacity:number,
    gammas:number[],
    interval: number,
    auto_level: boolean = false
  )
  {
    let stack_source_layer_set = app.activeDocument.activeLayer as LayerSet;
    stack_source_layer_set.name = Resources.layerName;
    let layer_index = undefined;
    for ( layer_index = 0 ; layer_index < stack_source_layer_set.artLayers.length ; ++layer_index ) {
      let this_layer = stack_source_layer_set.artLayers[layer_index];
      app.activeDocument.activeLayer = this_layer;
      ps.autoLevelObject();
    }
    this.initResources();
    this.resources.visible = false;
    this.initWorkingGroup();
    for ( let gamma_index = gammas.length - interval ; gamma_index > 0 ; gamma_index -= interval ) {
      for ( layer_index = 0 ; layer_index < stack_source_layer_set.artLayers.length ; ++layer_index ) {
        let this_layer = stack_source_layer_set.artLayers[layer_index];
        for ( let interval_index = 0 ; interval_index < interval ; ++interval_index ) {
          let this_gamma = gammas[gamma_index + interval_index];
          this.initGammaLayer( this_layer, this_gamma, opacity, auto_level );
        }
      }
    }

    for ( layer_index = 0 ; layer_index < stack_source_layer_set.artLayers.length ; ++layer_index ) {
      let this_layer = stack_source_layer_set.artLayers[layer_index];
      app.activeDocument.activeLayer = this_layer;
      this_layer.visible = true;
      let layer_group = ps.addGroup();
      app.activeDocument.activeLayer = layer_group.artLayers[0];
      this.initGammaLayerGroup();
      --layer_index; /* We moved an ArtLayer to a LayerSet */
    }

    let last_gamma_set = this.workLayerSet.layerSets[ this.workLayerSet.layerSets.length - 1 ]
    app.activeDocument.activeLayer = last_gamma_set;
  }

  initGammaLayer( 
    source_layer: ArtLayer, 
    gamma: number, 
    opacity: number = 10,
    auto_level: boolean = false
  )
  {
    // app.activeDocument.activeLayer = source_layer;
    let this_layer = undefined;
    let this_name = source_layer.name;
    if ( this.workLayerSet.artLayers.length == 0 )
      this_layer = source_layer.duplicate( 
        this.workLayerSet, 
        ElementPlacement.PLACEATEND 
      ) as ArtLayer;
    else {
      this_layer = source_layer.duplicate( 
        this.workLayerSet.artLayers[0], 
        ElementPlacement.PLACEBEFORE 
      ) as ArtLayer;
    }
    app.activeDocument.activeLayer = this_layer;
    app.activeDocument.activeLayer.name = this_name + ' - Gamma ' + gamma;
    ps.levelObject( 0, 255, gamma );
    this.initGammaLayerGroup();
  }

  initGammaLayerGroup()
  {
    let gamma_group = ps.addGroup();
    gamma_group.blendMode = BlendMode.NORMAL;
    gamma_group.opacity = 0;  
    app.activeDocument.activeLayer = gamma_group.artLayers[0];
    this.initGammaModifierGroup();
    app.activeDocument.activeLayer = gamma_group;
    this.initGammaModifierGroup( true );    
  }

  initGammaModifierGroup( 
    move_to_parent_layer_set : boolean = false
  ) 
  {
    let first_levels = ps.addLevels();
    if ( move_to_parent_layer_set ) {
      first_levels.move( first_levels.parent, ElementPlacement.PLACEBEFORE );
      app.activeDocument.activeLayer = first_levels;
    }
    let bc_layer = ps.addBrightnessContrast();
    bc_layer.opacity = 50;
    ps.addLevels();
  }

  initGammaShake(
    step_count: number = 5,
    step_size: number = 0.1,
    opacity: number = .5,
    up_multiplier: number = 1.25
  )
  {
    let current_layer = app.activeDocument.activeLayer as ArtLayer;
    let parent_set = current_layer.parent as LayerSet;
    let new_layer_set = parent_set.layerSets.add();
    new_layer_set.name = "Gamma Shake";
    app.activeDocument.activeLayer = new_layer_set;
    for ( let this_step = 0 ; this_step < step_count ; ++this_step ) {
      let shake_distance = this_step * step_size;
      let down_shake = 1 - shake_distance;
      let up_shake = 1 + (shake_distance * up_multiplier);
      let down_levels = ps.addLevels(
        0,
        255,
        down_shake,
        0,
        255
      );
      down_levels.opacity = opacity;
      let up_levels = ps.addLevels(
        0,
        255,
        up_shake,
        0,
        255
      );
      up_levels.opacity = opacity;
        
    }
  }

  initGammaFolding(
    fold_count: number = 5,
    outBlack: number = 0,
    outWhite: number = 25,
    gamma: number = 4,
    threshold: number = 0,
    opacity: number = 25
  )
  {
    this.initOriginal();
    this.selectBase();
    this.initWorkingGroup();
    this.resources.visible = false;
    this.workLayerSet.opacity = 75;

    let parent_set = this.workLayerSet;
    let new_layer_set = this.workLayerSet.layerSets.add();
    new_layer_set.name = "Gamma Folding";
    app.activeDocument.activeLayer = new_layer_set;
    let compressed_distance = outWhite - outBlack;
    let max_outblack = 255 - compressed_distance;
    for ( let this_fold = 0 ; this_fold < fold_count ; ++this_fold ) {
      let out_black = Math.floor(Math.random() * max_outblack);
      let out_white = out_black + compressed_distance;
      let new_fold_layer_set = new_layer_set.layerSets.add();
      new_fold_layer_set.name = "Gamma Fold " + (this_fold + 1);
      app.activeDocument.activeLayer = new_fold_layer_set;

      let fold_levels = ps.addAutoLevels(
        gamma,
        out_black,
        out_white,
        threshold
      );
      fold_levels.opacity = opacity;
      ps.addBrightnessContrast( 0, 75 ).opacity = 75;
      let blendback_layer = this.base.duplicate(
        fold_levels,
        ElementPlacement.PLACEBEFORE
      );
      blendback_layer.opacity = 25;
      let stretch_levels = ps.addAutoLevels(
        1.0,
        0,
        255,
        threshold
      );
      app.activeDocument.activeLayer = new_layer_set;
      // ps.toggleGroup();
    }

    let blendback_layer = this.original.duplicate(
      app.activeDocument.activeLayer,
      ElementPlacement.PLACEBEFORE
    ) as ArtLayer;
    blendback_layer.opacity = 25;
    app.activeDocument.activeLayer = blendback_layer;
    ps.addAutoLevels( 1.2, 6, 249, threshold );

  }

  initGammaStretch(
    low_gamma_opacity:number = 50,
    high_gamma_opacity:number = 25,
    gammas:number[] = [
      5.0,
      .6,
      4.0,
      .7,
      3.0,
      .8,
      2.0,
      .9,
      1.0
    ],
    interval: number = 1,
    wrap_ends: boolean = true,
    auto_level: boolean = false
  )
  {
    let stack_source_layer_set = app.activeDocument.activeLayer as LayerSet;
    if ( stack_source_layer_set.layerSets === undefined )
      this.initGammaStretchFromArtLayer(low_gamma_opacity, high_gamma_opacity, gammas, auto_level);
    else
      this.initGammaStretchFromLayerSet(low_gamma_opacity, high_gamma_opacity, gammas, auto_level);
  
    ps.addAutoLevels();
    ps.addLevels( 0, 255, 1);
    ps.addBrightnessContrast( -10, 45 );
  }

  initGammaStretchFromArtLayer(
    low_gamma_opacity:number = 50,
    high_gamma_opacity:number = 25,
    gammas: number[],
    auto_level: boolean = false
  )
  {
    let stack_source_layer = app.activeDocument.activeLayer as ArtLayer;
    this.initBase();
    stack_source_layer = ps.autoLevelObject();
    this.initResources();
    this.resources.visible = false;
    this.initWorkingGroup();
    let low_gamma_layer = false;
    app.activeDocument.activeLayer = stack_source_layer;
    for ( let gamma_index = gammas.length - 1 ; gamma_index > 0 ; gamma_index -= 1 ) {
      let this_gamma = gammas[gamma_index];
      low_gamma_layer = ! low_gamma_layer;
      this.initGammaStretchLayer( stack_source_layer, this_gamma, low_gamma_layer, low_gamma_opacity, high_gamma_opacity, auto_level );
    }
  }

  initGammaStretchFromLayerSet(
    low_gamma_opacity:number = 50,
    high_gamma_opacity:number = 25,
    gammas:number[],
    auto_level: boolean = false
  )
  {
    let stack_source_layer_set = app.activeDocument.activeLayer as LayerSet;
    stack_source_layer_set.name = Resources.layerName;
    let layer_index = undefined;
    for ( layer_index = 0 ; layer_index < stack_source_layer_set.artLayers.length ; ++layer_index ) {
      let this_layer = stack_source_layer_set.artLayers[layer_index];
      app.activeDocument.activeLayer = this_layer;
      ps.autoLevelObject();
    }
    this.initResources();
    this.resources.visible = false;
    this.initWorkingGroup();
    let low_gamma_layer = false;
    for ( let gamma_index = gammas.length - 1 ; gamma_index > 0 ; gamma_index -= 1 ) {
      for ( layer_index = 0 ; layer_index < stack_source_layer_set.artLayers.length ; ++layer_index ) {
        let this_layer = stack_source_layer_set.artLayers[layer_index];
        let this_gamma_index = (gamma_index + layer_index) % (gammas.length-1);
        let this_gamma = gammas[this_gamma_index];
        low_gamma_layer = ! low_gamma_layer;
        this.initGammaStretchLayer( this_layer, this_gamma, low_gamma_layer, low_gamma_opacity, high_gamma_opacity, auto_level );
      }
    }

    app.activeDocument.mergeVisibleLayers();
    let merged_copy = app.activeDocument.activeLayer.duplicate( this.resources.artLayers[0], ElementPlacement.PLACEBEFORE );
    app.activeDocument.activeLayer = merged_copy;
    app.activeDocument.activeLayer.opacity = 0;
    app.activeDocument.activeLayer = this.resources;
    for ( let work_layer_index = this.resources.artLayers.length - 1 ; work_layer_index >= 0 ; --work_layer_index ) {
      let work_layer = this.resources.artLayers[ work_layer_index ];
      app.activeDocument.activeLayer = work_layer;
      let compression_auto_levels = ps.addAutoLevels();// 1.5, 0, 128 );
      compression_auto_levels.move( work_layer, ElementPlacement.PLACEAFTER );
      app.activeDocument.activeLayer = work_layer;
      work_layer.opacity = low_gamma_opacity;
    }

  }

  initGammaStretchLayer(
    source_layer: ArtLayer, 
    gamma: number, 
    is_low_gamma_layer: boolean = true,
    low_gamma_opacity:number = 50,
    high_gamma_opacity:number = 25,
    auto_level: boolean = false
  )
  {
    app.activeDocument.activeLayer = this.workLayerSet;
    let compress_gamma = is_low_gamma_layer ? 1.5 : .9;
    ps.addAutoLevels( compress_gamma, 0, 96 );
    let stretch_opacity = is_low_gamma_layer ? low_gamma_opacity : high_gamma_opacity;
    this.initGammaLayer( source_layer, gamma, stretch_opacity, auto_level ); 
  }

  createAccentedEdgesGradient(
    steps: number = 3, /* steps on each side of median */
    width_interval: number = 2,
    brightness_interval: number = 5,
    smoothness_interval: number = 0
  )
  {
    let setup_layer = this.initAccentedEdgesSetup( 'Accented Edges Gradient' );
    let filter_gallery_d = ps.executeFilterGallery( 15, 15, 15, DialogModes.ALL ); /* Select brightness above the median. */
    let input_edge_width = filter_gallery_d.getInteger( sid.edgeWidth );
    let input_edge_brightness = filter_gallery_d.getInteger( sid.edgeBrightness );
    let input_edge_smoothness = filter_gallery_d.getInteger( sid.smoothness );
    setup_layer.name = input_edge_width + ' - ' + input_edge_brightness + ' - ' + input_edge_smoothness;

    let max_edge_width = input_edge_width;
    let min_edge_brightness = input_edge_brightness - steps * brightness_interval;

    let stack_size = steps * 2;
    for ( let offset = 0 ; offset < stack_size ; ++offset ) {
      let edge_width = max_edge_width - (width_interval * offset);
      let edge_brightness = min_edge_brightness + (brightness_interval * offset);
      let edge_smoothness = input_edge_smoothness + (smoothness_interval * offset);
      let new_layer = this.initAccentedEdgesStackLayer(
        edge_width,
        edge_brightness,
        edge_smoothness,
        ElementPlacement.PLACEBEFORE
      );  
    }

    setup_layer.remove();
    let parent_set = app.activeDocument.activeLayer.parent as LayerSet;
    app.activeDocument.activeLayer = parent_set.artLayers[parent_set.artLayers.length - 1]
  }

  initAccentedEdgesSetup(
    group_name: string
  ) 
  {
    ps.convertTo8Bit();
    ps.createSmartObjectFromActiveLayer();
    this.base = app.activeDocument.activeLayer as ArtLayer;
    this.base.applyGaussianBlur( 8.0 );
    let layer_dup = this.base.duplicate(
      this.base,
      ElementPlacement.PLACEBEFORE
    );
    app.activeDocument.activeLayer = layer_dup;
    ps.addGroup();
    app.activeDocument.activeLayer.name = group_name;
    app.activeDocument.activeLayer = layer_dup;
    return layer_dup;
  }

  createAccentedEdgesStack(
    stack_size: number = 5,
    width_interval: number = 1,
    brightness_interval: number = 0,
    smoothness_interval: number = 0
  ) 
  {
    let setup_layer = this.initAccentedEdgesSetup( 'Accented Edges Stack' );
    let filter_gallery_d = ps.executeFilterGallery( 10, 22, 15, DialogModes.ALL );
    let initial_edge_width = filter_gallery_d.getInteger( sid.edgeWidth );
    let initial_edge_brightness = filter_gallery_d.getInteger( sid.edgeBrightness );
    let initial_edge_smoothness = filter_gallery_d.getInteger( sid.smoothness );
    setup_layer.name = initial_edge_width + ' - ' + initial_edge_brightness + ' - ' + initial_edge_smoothness;
    setup_layer.opacity = 40;
    this.initGammaModifierGroup();
    app.activeDocument.activeLayer = setup_layer;
    this.initAccentedEdgesStackInGroup(
      initial_edge_width + width_interval,
      initial_edge_brightness + brightness_interval,
      initial_edge_smoothness + smoothness_interval,
      stack_size - 1,
      width_interval,
      brightness_interval,
      smoothness_interval
    );
    let parent_set = app.activeDocument.activeLayer.parent as LayerSet;
    app.activeDocument.activeLayer = parent_set.artLayers[parent_set.artLayers.length - 1]
  }

  initAccentedEdgesStackInGroup(
    edge_width: number,
    edge_brightness: number,
    edge_smoothness: number,
    stack_size: number = 5,
    width_interval: number = 0,
    brightness_interval: number = 0,
    smoothness_interval: number = 0
  ) 
  {
    for ( let offset = 0 ; offset < stack_size ; ++offset ) {
      let new_layer = this.initAccentedEdgesStackLayer(
        edge_width + (width_interval * offset),
        edge_brightness + (brightness_interval * offset),
        edge_smoothness + (smoothness_interval * offset)
      );
      app.activeDocument.activeLayer = new_layer;
    }
  }

  // was used previously
  initAccentedEdgesStackInGroupAlternating(
    edge_width: number,
    edge_brightness: number,
    edge_smoothness: number,
    stack_size: number = 10,
    width_interval: number = 0,
    brightness_interval: number = 0,
    smoothness_interval: number = 0
  ) 
  {
    let even_stack_size = (((stack_size+1) % 2) == 0);
    for ( let stack_iteration = 0 ; stack_iteration < stack_size / 2 ; ++stack_iteration ) {
      let high_offset = stack_size - 1 - stack_iteration;
      let low_offset = stack_iteration;
      this.initAccentedEdgesStackLayer(
        edge_width + (width_interval * high_offset),
        edge_brightness + (brightness_interval * high_offset),
        edge_smoothness + (smoothness_interval * high_offset)
      );
      if ( high_offset != low_offset ) {
        this.initAccentedEdgesStackLayer(
          edge_width + (width_interval * low_offset),
          edge_brightness + (brightness_interval * low_offset),
          edge_smoothness + (smoothness_interval * low_offset)
        );
      }
    }
  }

  initAccentedEdgesStackLayer(
    edge_width: number,
    edge_brightness: number,
    edge_smoothness: number,
    placement: ElementPlacement = ElementPlacement.PLACEAFTER,
    dialog_mode: DialogModes = DialogModes.NO
  ) 
  {
    let layer_dup = this.base.duplicate(
      app.activeDocument.activeLayer,
      placement
    );
    app.activeDocument.activeLayer = layer_dup;
    layer_dup.name = edge_width + ' - ' + edge_brightness + ' - ' + edge_smoothness
    ps.executeFilterGallery(
      edge_width,
      edge_brightness,
      edge_smoothness,
      dialog_mode
    );
    let group = ps.addGroup();
    group.blendMode = BlendMode.NORMAL;
    group.opacity = 0;
    group.name = layer_dup.name;
    this.initGammaModifierGroup();
    app.activeDocument.activeLayer = group;
    this.initGammaModifierGroup(true);
    return layer_dup;
  }

  /* A group with a base layer (transparency decreases) and layers above that remain constant. */
  initModifiedLayerBlend(
    interval: number = 1,
    final_transparency: number = 5
  ) 
  {
    // create group from this group
    // copy this group above itself
    // subtract interval from the bottom layer transparency
    this.workLayerSet = ps.addGroup();
    app.activeDocument.activeLayer = this.workLayerSet.layerSets[ this.workLayerSet.layerSets.length - 1 ];
    let starting_layer_set = app.activeDocument.activeLayer as LayerSet;
    let base_layer = starting_layer_set.layers[ starting_layer_set.layers.length - 1 ];
    let starting_transparency = Math.ceil(base_layer.opacity);
    for ( let transparency = starting_transparency - 1 ; transparency >= final_transparency ; transparency -= interval  ) {
      let new_layer_set = app.activeDocument.activeLayer.duplicate(
        app.activeDocument.activeLayer,
        ElementPlacement.PLACEBEFORE
      ) as LayerSet;
      app.activeDocument.activeLayer = new_layer_set;
      new_layer_set.name = transparency.toString();
      base_layer = new_layer_set.layers[ new_layer_set.layers.length - 1 ];
      base_layer.opacity = transparency;
      app.activeDocument.activeLayer = new_layer_set;
  }
    app.activeDocument.activeLayer = this.workLayerSet;
  }

  createGammaGroup()
  {
    let layer = app.activeDocument.activeLayer;
    let group = ps.addGroup();
    group.blendMode = BlendMode.NORMAL;
    group.opacity = 0;
    group.name = layer.name;
    this.initGammaModifierGroup();
    app.activeDocument.activeLayer = group;
    this.initGammaModifierGroup(true);

  }  

  initHighPassStack(
    starting_radius: number = 200,
    interval: number = 200,
    count: number = 5
  )
  {
    this.base = app.activeDocument.activeLayer.duplicate(
      app.activeDocument.activeLayer,
      ElementPlacement.PLACEBEFORE
    ) as ArtLayer;
    app.activeDocument.activeLayer = this.base;
    this.base = ps.createSmartObjectFromActiveLayer();
    this.base.name = 'High Pass ' + starting_radius;
    ps.applyHighPass( starting_radius );
    this.createGammaGroup();
    for ( let iteration = 1 ; iteration < count ; ++iteration  ) {
      let this_layer = this.base.duplicate(
        app.activeDocument.activeLayer,
        ElementPlacement.PLACEBEFORE
      ) as ArtLayer;
      app.activeDocument.activeLayer = this_layer;
      this_layer = ps.autoLevelObject();
      let radius = starting_radius + interval * iteration;
      this_layer.name = 'High Pass ' + radius;
      ps.applyHighPass( radius );
      this.createGammaGroup();
    }
  }

  trimBaseLayerName()
  {
    for ( let this_layer_index = 0 ; this_layer_index < app.activeDocument.artLayers.length ; ++this_layer_index  ) {
      let this_layer = app.activeDocument.artLayers[ this_layer_index ];
      let match = /( )([0-9\.]+[A-Z]+)/.exec(this_layer.name);
      if ( match ) {
        this_layer.name = this_layer.name.slice( match.index + 1 );
      }
    }
  }

  createOverlayScreenAdjustmentsGroup()
  {    
    let levels = ps.addLevels();
    app.activeDocument.activeLayer = levels;
    let group = ps.addGroup();
    group.name = "Adjustments";
    let screen_brightness = ps.addBrightnessContrast();
    screen_brightness.blendMode = BlendMode.SCREEN;
    let levels2 = ps.addLevels();
    let multiply_brightness = ps.addBrightnessContrast();
    multiply_brightness.blendMode = BlendMode.MULTIPLY;
    let levels3 = ps.addLevels();
    let overlay_brightness = ps.addBrightnessContrast();
    overlay_brightness.blendMode = BlendMode.OVERLAY;
    return group;
  }

  createOverlayScreenAdjustmentsForLayer()
  {
    let this_layer = app.activeDocument.activeLayer;
    let layer_group = ps.addGroup();
    let adjustment_group = this.createOverlayScreenAdjustmentsGroup();
    layer_group.blendMode = BlendMode.NORMAL;
    layer_group.opacity = this_layer.opacity;
    this_layer.opacity = 100;
    return layer_group;
  }

  createOverlayScreenAdjustments()
  {
    if ( app.activeDocument.activeLayer ) {
      let active_layer_is_set = ((app.activeDocument.activeLayer as LayerSet).layerSets !== undefined );
      if  ( active_layer_is_set ) {
        let layer_set = app.activeDocument.activeLayer as LayerSet;
        let first_layer = true;
        while ( layer_set.artLayers.length > 0 ) {
          let this_layer = layer_set.artLayers[ layer_set.artLayers.length - 1 ];
          app.activeDocument.activeLayer = this_layer;
          let this_group = this.createOverlayScreenAdjustmentsForLayer();
          this_group.name = this_layer.name;
          if ( ! first_layer ) {
            app.activeDocument.activeLayer = this_group;
            this_group.visible = false;
            ps.toggleGroup();
          }
          first_layer = false;
        }
        app.activeDocument.activeLayer = layer_set;
      } 
      else {
        let layer = app.activeDocument.activeLayer as ArtLayer;
        this.createOverlayScreenAdjustmentsForLayer();
      }
    } 
  }

  /* Addresses bug when LayerSet is empty. */
  moveIntoLayerSet(
    layer_set: LayerSet,
    layer: Layer
  )
  {
    if ( layer_set.layerSets.length == 0 ) {
      let placeholder = layer_set.layerSets.add();
      placeholder.name = "Placeholder";
      layer.move(placeholder, ElementPlacement.PLACEBEFORE);
      placeholder.remove();
    }
    else {
      layer.visible = false;
      layer.move(layer_set.layerSets[0], ElementPlacement.PLACEBEFORE);
    }
  }

  // Combine multiple layer sets, collating a layer from each. 
  interleaveLayerSets( create_adjustements_group: boolean = false )
  : LayerSet
  {
    if ( app.activeDocument.activeLayer ) {
      let active_layer_is_set = ((app.activeDocument.activeLayer as LayerSet).layerSets !== undefined );
      if  ( active_layer_is_set ) {
        let layer_set = app.activeDocument.activeLayer as LayerSet;
        let interleave_set = layer_set.layerSets.add();
        interleave_set.move( layer_set.layerSets[0], ElementPlacement.PLACEBEFORE );

        if ( create_adjustements_group ) {
          for ( let index = layer_set.layerSets.length - 1 ; index >= 1 ; --index ) {
            let this_layer_set = layer_set.layerSets[ index ];
            app.activeDocument.activeLayer = this_layer_set;
            this.createOverlayScreenAdjustments();
          }
        }

        let layers_remain = false;
        do {
          layers_remain = false;
          for ( let index = layer_set.layerSets.length - 1 ; index >= 1 ; --index ) {
            let this_layer_set = layer_set.layerSets[ index ];
            if ( this_layer_set.layerSets.length > 0 ) {
              let this_adjustment_layer = this_layer_set.layerSets[ this_layer_set.layerSets.length - 1 ];
              this.moveIntoLayerSet( interleave_set, this_adjustment_layer );
              if ( this_layer_set.layerSets.length > 0 ) {
                layers_remain = true;
              }
              else {
                this_layer_set.remove();
              }
            }
            else if ( this_layer_set.artLayers.length > 0 ) {
              let this_adjustment_layer = this_layer_set.artLayers[ this_layer_set.artLayers.length - 1 ];
              this.moveIntoLayerSet( interleave_set, this_adjustment_layer );
              if ( this_layer_set.artLayers.length > 0 ) {
                layers_remain = true;
              }
              else {
                this_layer_set.remove();
              }
            }
          }
        } while ( layers_remain );

        return interleave_set;
      } 
    } 
  }


  reverseLayerOrderForLayerSet( layer_set, has_background_layer = false )
  {
    let layer_count = layer_set.artLayers.length;
    let last_index = layer_count - 1 - (has_background_layer?1:0);
    for (var index = last_index; index >= 1; --index) {
      let this_layer = layer_set.artLayers[ last_index ];
      let move_after_index = layer_count - 1 - (has_background_layer ? 1 : 0) - index;
      let this_reference_layer = layer_set.artLayers[ move_after_index ];
      this_layer.move( this_reference_layer, ElementPlacement.PLACEBEFORE );
    }
  }

  reverseLayerOrderForActiveLayer( active_layer_is_set: boolean )
  {
    if  ( active_layer_is_set ) {
      let layer_set = app.activeDocument.activeLayer as LayerSet;
      return this.reverseLayerOrderForLayerSet( layer_set, false );
    }
    else {
      let layer_set = app.activeDocument;
      return this.reverseLayerOrderForLayerSet( layer_set, ps.hasBackgroundLayer() );
    }
}

  reverseLayerOrder()
  {
    if ( app.activeDocument.activeLayer ) {
      let active_layer_is_set = ((app.activeDocument.activeLayer as LayerSet).layerSets !== undefined );
      this.reverseLayerOrderForActiveLayer( active_layer_is_set );
    }
    else {
      let layer_set = app.activeDocument;
      return this.reverseLayerOrderForLayerSet( layer_set, ps.hasBackgroundLayer() );
    }

  }

  sortBalanceVsMicroForLayerSet( layer_set, has_background_layer = false )
  {
    let micro_set = layer_set.layerSets.add();
    let balance_set = layer_set.layerSets.add();
    micro_set.name = "Micro";
    balance_set.name = "Balance";

    let non_balance_micro_layers = 0;
    while ( layer_set.artLayers.length > ( has_background_layer ? 1 : 0 ) ) {
      let this_layer = layer_set.artLayers[ non_balance_micro_layers ];
      let micro_match = /Micro/.exec(this_layer.name);
      if ( micro_match ) {
        this_layer.move( micro_set, ElementPlacement.PLACEATEND );
      }
      else {
        let balance_match = /[0-9]+[A-Z]/.exec(this_layer.name);
        if ( balance_match ) {
          this_layer.move( balance_set, ElementPlacement.PLACEATEND );
        }
        else {
          ++non_balance_micro_layers;
        }
      }
    }
  }

  sortBalanceVsMicroForActiveLayer( active_layer_is_set: boolean )
  {
    if  ( active_layer_is_set ) {
      let layer_set = app.activeDocument.activeLayer as LayerSet;
      return this.sortBalanceVsMicroForLayerSet( layer_set, false );
    }
    else {
      let layer_set = app.activeDocument;
      return this.sortBalanceVsMicroForLayerSet( layer_set, ps.hasBackgroundLayer() );
    }
}

  sortBalanceVsMicro()
  {
    if ( app.activeDocument.activeLayer ) {
      let active_layer_is_set = ((app.activeDocument.activeLayer as LayerSet).layerSets !== undefined );
      this.sortBalanceVsMicroForActiveLayer( active_layer_is_set );
    }
    else {
      let layer_set = app.activeDocument;
      return this.sortBalanceVsMicroForLayerSet( layer_set, ps.hasBackgroundLayer() );
    }

  }

  eachLayer( 
    layer: ArtLayer, 
    config: Configuration, 
    action: ( layer: ArtLayer, config: Configuration ) => any 
  ) {
    // layer = ps.convertToSmartObjectIfAppropriate( layer );
    app.activeDocument.activeLayer = layer;
    if ( config.layer.before ) 
      config.layer.before( layer, config );    
    action( layer, config );
    if ( config.layer.after ) 
      config.layer.after( layer, config );    
    return layer;
  }

  eachLayerSet( 
    layer_set: LayerSet, 
    config: Configuration, 
    action: ( layer: ArtLayer, config: Configuration ) => any 
  ) {
    // Track starting LayerSets for recursion to avoid iterating new sets
    let iteration_layer_set_count = layer_set.layerSets.length;
    if ( config.layerSet.before ) 
      config.layerSet.before( layer_set, config );    
    if ( config.iterate.reverse ) {
      for ( let index = layer_set.artLayers.length - 1 ; index >= 0 ; --index ) {
        this.eachLayer( layer_set.artLayers[ index ], config, action );
      }    
      if ( config.iterate.recursive ) {
        for ( let index = layer_set.layerSets.length - 1 ; index >= 0 ; --index ) {
          this.eachLayerSet( layer_set.layerSets[ index ], config, action );
        }    
      }
    }
    else {
      let iteration_layer_count = layer_set.artLayers.length;
      for ( let index = 0 ; index < iteration_layer_count ; ++index ) {
        // if layer was removed, adjust iteration
        if ( layer_set.artLayers.length < iteration_layer_count ) {
          let difference = iteration_layer_count - layer_set.artLayers.length;
          index -= difference;
          iteration_layer_count = layer_set.artLayers.length;
        }
        this.eachLayer( layer_set.artLayers[ index ], config, action );
      }
      if ( config.iterate.recursive ) {
        for ( let index = 0 ; index < iteration_layer_set_count ; ++index ) {
          this.eachLayerSet( layer_set.layerSets[ index ], config, action );
        }
      }
    }
    if ( config.layerSet.after ) 
      config.layerSet.after( layer_set, config );    
    return layer_set;
  }

  each(
    config: Configuration, 
    action: ( layer: ArtLayer, config: Configuration ) => any 
  ) {
    if ( app.activeDocument.activeLayer ) {
      let active_layer_is_set = ((app.activeDocument.activeLayer as LayerSet).layerSets !== undefined );
      let previously_active_layer = app.activeDocument.activeLayer;
      if  ( active_layer_is_set ) {
        let layer_set = app.activeDocument.activeLayer as LayerSet;
        this.eachLayerSet( layer_set, config, action );
      }
      else {
        let active_layer = app.activeDocument.activeLayer as ArtLayer;
        previously_active_layer = this.eachLayer( active_layer, config, action );
      }
      app.activeDocument.activeLayer = previously_active_layer;
    }
    else {
      let layer_set = app.activeDocument as unknown as LayerSet;
      this.eachLayerSet( layer_set, config, action );
    }

  }

  lowFrequencyBlur( low_frequency_strength: number = 6.0 )
  {
    let config = new GaussianBlurConfiguration( low_frequency_strength );
    let action = ( layer: ArtLayer, config: GaussianBlurConfiguration ) => {
      layer.applyGaussianBlur( config.radius );
    };
    this.each( config, action );
  }

  smartSharpen( 
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
    let config = new SmartSharpenConfiguration(
      amount,
      radius,
      reduce_noise,
      shadow_fade_amount,
      shadow_tonal_width,
      shadow_radius,
      highlight_fade_amount,
      highlight_tonal_width,
      highlight_radius
    );
    let action = ( layer: ArtLayer, config: GaussianBlurConfiguration ) => {
      ps.applySmartSharpen(
        amount,
        radius,
        reduce_noise,
        shadow_fade_amount,
        shadow_tonal_width,
        shadow_radius,
        highlight_fade_amount,
        highlight_tonal_width,
        highlight_radius,
        dialog_mode
      );  
    };
    config.layer.after = ( layer: ArtLayer, config: GaussianBlurConfiguration ) => {
      layer.visible = false;
    }
    config.layerSet.after = ( layer_set: LayerSet, config: GaussianBlurConfiguration ) => {
      for ( let index = 0 ; index < layer_set.artLayers.length ; ++index ) {
        let this_layer = layer_set.artLayers[ index ];
        this_layer.visible = true;
      }      
    }
    this.each( config, action );
  }  

  highPass( 
    radius: number = 400 /* px */
  )
  {
    let config = new HighPassConfiguration( radius );
    config.dialogMode = DialogModes.ALL;
    let action = ( layer: ArtLayer, config: HighPassConfiguration ) => {
      ps.applyHighPass( radius, config.dialogMode );  
    };
    this.each( config, action );
  }  


  // Interleave active LayerSet with LayerSets contained in first LayerSet for parent of active LayerSet
  interleaveLayerSet()
  : LayerSet
  {
    let interleave_set = app.activeDocument.activeLayer as LayerSet;
    let target_set = (interleave_set.parent as LayerSet).layerSets[0];
    if ( (target_set === undefined) || (interleave_set === undefined) ) {
      return undefined;
    }
    for ( let index = target_set.layerSets.length - 2 ; index >= 0 ; --index ) {
      let target_layerset = target_set.layerSets[ index ];
      interleave_set.duplicate( target_layerset, ElementPlacement.PLACEAFTER );
    }
  }
  
  interleaveArtLayer()
  {
    let config = new Configuration();
    config.dialogMode = DialogModes.ALL;
    config.iterate.reverse = true;
    let source_layer = app.activeDocument.activeLayer;
    let parent_layer_set = app.activeDocument.activeLayer.parent as LayerSet;
    app.activeDocument.activeLayer = parent_layer_set.layerSets[0];
    let action = ( layer: ArtLayer, config: Configuration ) => {
      source_layer.duplicate( layer, ElementPlacement.PLACEBEFORE );
    };
    this.each( config, action );
  }  

  interleaveLayer()
  {
    let active_layer_is_set = ((app.activeDocument.activeLayer as LayerSet).layerSets !== undefined );
    if ( active_layer_is_set ) {
      return this.interleaveLayerSet();
    }
    else {
      return this.interleaveArtLayer();
    }
  }

  createBlendAdjustmentSubgroupBrightnessContrastLayer(
    adjustment_opacity: number = 25
  )
  {
    let brightnesscontrast = ps.addBrightnessContrast();
    brightnesscontrast.opacity = adjustment_opacity;
    return brightnesscontrast;
  }

  createBlendAdjustmentSubgroupExposureLayer(
    adjustment_opacity: number = 25
  )
  {
    let exposure = ps.addExposure();
    exposure.opacity = adjustment_opacity;
    return exposure;
  }

  createBlendAdjustmentSubgroup(
    adjustment_opacity: number = 25
  )
  {
    let levels = ps.addLevels();
    levels.opacity = adjustment_opacity;
    let adjustment_group = ps.addGroup();
    this.createBlendAdjustmentSubgroupBrightnessContrastLayer( adjustment_opacity );
    this.createBlendAdjustmentSubgroupExposureLayer( adjustment_opacity );
    return adjustment_group;
  }

  createBlendAdjustmentGroup()
  {
    let source_layer = app.activeDocument.activeLayer as ArtLayer; //ps.convertToSmartObjectIfAppropriate();
    let source_opacity = source_layer.opacity;
    let source_blend = source_layer.blendMode;
    let adjustment_opacity = 25;
    source_layer.opacity = 100;
    source_layer.blendMode = BlendMode.NORMAL;
    let blend_adjustments_group = ps.addGroup();
    blend_adjustments_group.name = "Blend Adjustments";
    app.activeDocument.activeLayer = source_layer;

    let blend_group = ps.addGroup();
    blend_group.name = "Blend";
    blend_group.blendMode = BlendMode.NORMAL;

    let adjustment_group = this.createBlendAdjustmentSubgroup( adjustment_opacity );
    adjustment_group.name = "Adjustments";

    app.activeDocument.activeLayer = blend_group;
    let pin_light = ps.addBrightnessContrast();
    pin_light.blendMode = BlendMode.PINLIGHT;
    pin_light.opacity = adjustment_opacity;
    let pin_light_group = ps.addGroup();
    pin_light_group.visible = false;
    pin_light_group.name = "Pin Light";
    let screen_1 = ps.addBrightnessContrast( -150, 100 );
    screen_1.blendMode = BlendMode.SCREEN;
    let screen_2 = ps.addBrightnessContrast( -150, -50 );
    screen_2.blendMode = BlendMode.SCREEN;
    screen_2.opacity = 25;
    app.activeDocument.activeLayer = blend_group;

    let balance_group = this.createBlendAdjustmentSubgroup( adjustment_opacity );
    balance_group.name = "Balance";

    blend_group.opacity = source_opacity;
    blend_group.blendMode = source_blend;
    app.activeDocument.activeLayer = blend_adjustments_group;
    ps.addLevels();
    ps.addBrightnessContrast();
    app.activeDocument.activeLayer = blend_group;
  }

  createHighPassAdjustmentGroup()
  {
    ps.convertToSmartObjectIfAppropriate();
    let source_layer = app.activeDocument.activeLayer;
    let hp_detail = source_layer.duplicate( source_layer, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    app.activeDocument.activeLayer = hp_detail;
    hp_detail.name = source_layer.name + " HP Detail";
    let high_pass_adjustment_group = ps.addGroup();
    high_pass_adjustment_group.name = "High Pass";
    let high_pass_group = ps.addGroup();
    high_pass_group.name = source_layer.name + " High Pass"
    app.activeDocument.activeLayer = hp_detail;
    ps.applyHighPass( 1000, DialogModes.ALL );
    hp_detail.opacity = 40;
    let hp_edges = source_layer.duplicate( hp_detail, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    app.activeDocument.activeLayer = hp_edges;
    hp_edges.name = source_layer.name + " HP Edges";
    ps.applyHighPass( 150, DialogModes.ALL );
    hp_edges.opacity = 40;
    app.activeDocument.activeLayer = high_pass_group;
    let hp_detail_blur = hp_detail.duplicate( high_pass_adjustment_group, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    app.activeDocument.activeLayer = hp_detail_blur;
    hp_detail_blur.name = source_layer.name + " HP Detail Blur";
    hp_detail_blur.applyGaussianBlur( 6 );
    hp_detail_blur.opacity = 40;
    let high_pass_blur_group = ps.addGroup();
    high_pass_blur_group.name = "High Pass Blur";
    let hp_edges_blur = hp_edges.duplicate( hp_detail_blur, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    app.activeDocument.activeLayer = hp_edges_blur;
    hp_edges_blur.name = source_layer.name + " HP Edges Blur";
    hp_edges_blur.opacity = 40;
    hp_edges_blur.applyGaussianBlur( 6 );
    app.activeDocument.activeLayer = high_pass_group;
    let source_blur_low = source_layer.duplicate( high_pass_adjustment_group, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    app.activeDocument.activeLayer = source_blur_low;
    source_blur_low.name = source_layer.name + " Blur Low"
    source_blur_low.opacity = 40;
    let blur_group = ps.addGroup();
    blur_group.name = "Blur";
    source_blur_low.applyGaussianBlur( 6 );
    let source_blur_medium = source_layer.duplicate( source_blur_low, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    app.activeDocument.activeLayer = source_blur_medium;
    source_blur_medium.name = source_layer.name + " Blur Medium"
    source_blur_medium.opacity = 40;
    source_blur_medium.applyGaussianBlur( 12 );
    let source_blur_high = source_layer.duplicate( source_blur_medium, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    app.activeDocument.activeLayer = source_blur_high;
    source_blur_high.name = source_layer.name + " Blur High"
    source_blur_high.opacity = 40;
    source_blur_high.applyGaussianBlur( 18 );
    app.activeDocument.activeLayer = high_pass_group;
  }

    // [ start brightness [; step brightness [; end brightness ] ] ] [ : start contrast [ ; step contrast [ ; end contrast ] ] ]
    createPinLightBlendGroupFromPrompt()
    {
      let brightness_start = -150;
      let brightness_step = 10;
      let brightness_end = 0;
      let contrast_start = 0;
      let contrast_step = 10;
      let contrast_end = 0;
      let opacity = 50;
      let prompt_response = prompt( "[ start brightness [; step brightness [; end brightness ] ] ] [ : start contrast [ ; step contrast [ ; end contrast ] ] [ : opacity ] ]", "-150;5;5:-50;5;-5:4" );
      let split_bc = prompt_response.split( ":" );
      let brightness_desc = split_bc[0];
      if (typeof brightness_desc === 'string' ) {
        let brightness_details = brightness_desc.split(";");
        if ( brightness_details[0] !== undefined ) {
          brightness_start = Number( brightness_details[0] );
          if ( brightness_details[1] !== undefined ) {
            brightness_step = Number( brightness_details[1] );
            if ( brightness_details[2] !== undefined ) {
              brightness_end = Number( brightness_details[2] );
            }
          }
        }
        let contrast_desc = split_bc[1];
        if ( contrast_desc != undefined ) {
          let contrast_details = contrast_desc.split(";");
          if ( contrast_details[0] !== undefined ) {
            contrast_start = Number( contrast_details[0] );
            contrast_end = contrast_start;
            if ( contrast_details[1] !== undefined ) {
              contrast_step = Number( contrast_details[1] );
              if ( contrast_details[2] !== undefined ) {
                contrast_end = Number( contrast_details[2] );
              }
            }
          }
        }
        let opacity_desc = split_bc[2];
        if ( opacity_desc != undefined ) {
          opacity = Number( opacity_desc );
        }
      }
      return this.createPinLightBlendGroup(
        brightness_start,
        brightness_step,
        brightness_end,
        contrast_start,
        contrast_step,
        contrast_end,
        opacity
      );
    }


    createPinLightBlendGroup(
      brightness_start: number,
      brightness_step: number, 
      brightness_end: number,
      contrast_start: number,
      contrast_step: number,
      contrast_end: number,
      opacity: number
    )
  {
    let contrast = contrast_start;
    let blend_group = undefined;
    do {
      let brightness = brightness_start;
      let contrast_group = undefined;
      do {
        let bc_layer = ps.addBrightnessContrast( brightness, contrast );
        bc_layer.opacity = opacity;
        bc_layer.blendMode = BlendMode.PINLIGHT;
        if ( blend_group === undefined ) {
          blend_group = ps.addGroup();
          blend_group.name = "Pin Light Blend Group";
          app.activeDocument.activeLayer = bc_layer;
        }
        if ( contrast_group === undefined ) {
          contrast_group = ps.addGroup();
          contrast_group.name = "Contrast " + contrast.toString();
          app.activeDocument.activeLayer = bc_layer;        
        }
      } while ( (brightness += brightness_step) <= brightness_end )
      app.activeDocument.activeLayer = blend_group;

    } while ( (contrast += contrast_step) <= contrast_end );
    app.activeDocument.activeLayer = blend_group;
    return blend_group;
  }

  createTransparencyBlendForLayerSet()
  {
    let layer_set = app.activeDocument.activeLayer as LayerSet;
    let active_layer_is_set = (layer_set.layerSets !== undefined );
    if ( ! active_layer_is_set ) {
      layer_set = ps.addGroup();
    }
    let config_layer = layer_set.artLayers[0];
    let layer_count = layer_set.artLayers.length;
    let max_opacity = 0;
    for ( let this_index = 0 ; this_index < layer_count ; ++this_index ) {
      let this_layer = layer_set.artLayers[ this_index ];
      this_layer.rasterize( RasterizeType.ENTIRELAYER );
      let this_opacity = Math.round(this_layer.opacity);
      max_opacity = ( max_opacity > this_opacity ) ? max_opacity : this_opacity;
      this_layer.opacity = this_opacity;
    }
    let transparency_blend_layer_set = ps.addGroup( "Transparency Blend Group" );
    layer_set.name = String( max_opacity );
    let next_layer_set = layer_set;
    for ( let this_opacity = max_opacity - 1 ; this_opacity > 0 ; --this_opacity ) {
      next_layer_set = this.createTransparencyBlendForLayerSetLayer( this_opacity, next_layer_set );
    } 
    return transparency_blend_layer_set;
  }

  createTransparencyBlendForLayerSetLayer( 
    opacity: number,
    next_layer_set: LayerSet
  )
  {
    next_layer_set = next_layer_set.duplicate( next_layer_set, ElementPlacement.PLACEBEFORE ) as LayerSet;
    next_layer_set.name = String( opacity );
    for ( let this_index = 0 ; this_index < next_layer_set.artLayers.length ; ++this_index ) {
      let this_next_layer = next_layer_set.artLayers[ this_index ];
      let this_opacity = Math.round(this_next_layer.opacity) - 1;
      if ( this_opacity >= 1  )
        this_next_layer.opacity = this_opacity;
      else {
        this_next_layer.remove();
        --this_index;
      }
    }  
    return next_layer_set;
  }

  // takes selected mask layer and creates masked groups for mask and inverted mask
  createHighLowMaskGroup()
  {
    let mask_layer = app.activeDocument.activeLayer as ArtLayer;
    let shadows_group = ps.addEmptyGroup("Shadows");
    let mask_group = ps.addGroup();
    mask_group.name = "High / Low Masks";
    app.activeDocument.activeLayer = shadows_group;
    let highlights_group = ps.addEmptyGroup("Highlights");
    app.activeDocument.activeLayer = highlights_group;
    ps.addLayerMask();
    ps.applyImage( mask_layer.name, false );
    app.activeDocument.activeLayer = shadows_group;
    ps.addLayerMask();
    ps.applyImage( mask_layer.name, true );
  }

  createRepeatedTransparencyBlendStackFromPrompt()
  {
    let number_of_times = Number( prompt( "Number of Times", "10" ) );
    return this.createRepeatedTransparencyBlendStack( number_of_times );
  }

  createRepeatedTransparencyBlendStack(
    number_of_times: number
  )
  {
    let blend_layer = app.activeDocument.activeLayer as ArtLayer;
    let name = blend_layer.name;
    let blend_opacity = Math.ceil( blend_layer.opacity );
    let iteration = 1;
    do {
      blend_layer.opacity = blend_opacity;
      blend_layer.name = name + " " + blend_opacity.toString() + "x" + iteration.toString();
      let blend_group = ps.addGroup();
      this.createTransparencyBlendForLayerSet();
      blend_layer = blend_group.merge();
    } while ( ++iteration <= number_of_times );
    return blend_layer;
  }

  createHighPassBlendbackFromPrompt()
  {
    let prompt_response = prompt( "Number of Times [times][:transparency[:radius]]", "2:15:1000" );
    let prompt_values = prompt_response.split(":");
    let cycles = Number( prompt_values[0] );
    let transparency = Number( prompt_values[1] );
    let radius = Number( prompt_values[2] );
    if ( transparency == 0 )
      transparency = 15;
    if ( radius == 0 )
      radius = 1000;
    return this.createHighPassBlendback(
      cycles,
      radius,
      transparency
    );
  }

  createHighPassBlendback(
    cycles: number = 2,
    radius: number = 1000,
    transparency_blend: number = 15,
    dialog_mode: DialogModes = DialogModes.NO
  ) {
    (app.activeDocument.activeLayer as ArtLayer).isBackgroundLayer = false;
    for ( let this_time = 0 ; this_time < cycles ; ++this_time ) {
      this.createHighPassBlendbackCycle(
        radius,
        transparency_blend
      );
    }
  }

  createHighPassBlendbackCycle(
    radius: number = 1000, 
    transparency_blend: number = 15,
    dialog_mode: DialogModes = DialogModes.NO
  ) {
    let source_layer = app.activeDocument.activeLayer;
    let cycle_group = ps.addGroup();
    let hp_layer = source_layer.duplicate( source_layer, ElementPlacement.PLACEBEFORE );
    app.activeDocument.activeLayer = hp_layer;
    ps.applyHighPass( radius, dialog_mode );
    hp_layer.opacity = transparency_blend;
    let blend_group = ps.addGroup();
    let source_blend_layer = source_layer.duplicate( hp_layer, ElementPlacement.PLACEBEFORE );
    source_blend_layer.opacity = transparency_blend;
    app.activeDocument.activeLayer = blend_group;
    this.createTransparencyBlendForLayerSet();
    app.activeDocument.activeLayer = cycle_group;
    cycle_group.merge();
    let levels = ps.addAutoLevels();
    levels.merge();
  }

  createFrequencySeparationFromPrompt()
  :
    LayerSet
  {
    let separation_prompt = prompt( "Separation (px)", "1000" );
    let blur_px = Number( separation_prompt );
    return this.createFrequencySeparation( blur_px );
  }

  createFrequencySeparation(
    blur_px: number
  ) 
  :
    LayerSet
  {
    let lp_layer = app.activeDocument.activeLayer as ArtLayer;
    let base_name = lp_layer.name;
    lp_layer.name = "LP " + blur_px.toString() + ": " + base_name;
    let separation_group = ps.addGroup();
    separation_group.name = "Frequency Separation " + blur_px.toString();
    app.activeDocument.activeLayer = lp_layer;
    let lp_group = ps.addGroup();
    lp_group.name = "LP";
    let hp_layer = lp_layer.duplicate( lp_group, ElementPlacement.PLACEBEFORE ) as ArtLayer;
    hp_layer.name = "HP " + blur_px.toString() + ": " + base_name;
    lp_layer.applyGaussianBlur( blur_px );
    app.activeDocument.activeLayer = hp_layer;
    if (hp_layer.kind === LayerKind.SMARTOBJECT) {
      hp_layer.rasterize( RasterizeType.ENTIRELAYER );
    }
    ps.applyImageSubtract( lp_layer.name );
    let hp_group = ps.addGroup();
    hp_group.name = "HP";
    hp_group.blendMode = BlendMode.LINEARLIGHT;
    app.activeDocument.activeLayer = separation_group;
    return separation_group;
  }

  expandByLevelsBlend()
  {
    let source_layer = app.activeDocument.activeLayer as ArtLayer;
    let merge_group = ps.addGroup();
    let work_layer = source_layer.duplicate( source_layer, ElementPlacement.PLACEBEFORE );
    app.activeDocument.activeLayer = work_layer;
    this.expandByLevelsBlendCycle( source_layer );
    merge_group.merge();
  }

  expandByLevelsBlendCycle(
    source_layer: ArtLayer,
    minmax: MinMax = new MinMax( 0, 0 ),
    minmax_next: MinMax = new MinMax( 0, 0 )
  )
  {
    do {
      minmax = minmax_next;
      minmax_next = this.expandByLevelsBlendSingleCycle( source_layer );
    } while ( minmax_next.max > minmax.max );
    ps.addAutoLevels();
  }

  expandByLevelsBlendSingleCycle(
    source_layer: ArtLayer,
    minmax: MinMax = ps.getAutoLevelsMinMax()
  )
  {
    if ( (minmax.min > 0) || (minmax.max < 255) ) {
      let work_layer = app.activeDocument.activeLayer as ArtLayer;
      let merge_group = ps.addGroup();
      let auto_levels = ps.addAutoLevelsFromMinMax( minmax );
      let blend_layer = source_layer.duplicate( auto_levels, ElementPlacement.PLACEBEFORE );
      blend_layer.opacity = 45;
      merge_group.merge();
      return minmax;
    }
    else {
      return minmax;
    }
    
  }

  createFrequencySeparationBlendGroupFromPrompt()
  :
    LayerSet
  {
    let prompt_result = prompt( 'HP, LP', '1000, 100' );
    if ( prompt_result.length == 0 ) {
      return undefined;
    }
    let prompt_parts = prompt_result.split(',');
    let hp = Number( prompt_parts[0] );
    let lp = Number( prompt_parts[1] );
    return this.createFrequencySeparationBlendGroup( hp, lp );
  }

  createFrequencySeparationBlendGroup(
    hp: number = 1000,
    lp: number = 100
  )
  :
    LayerSet
  {
    let working_layer_set = app.activeDocument.activeLayer as LayerSet;
    let layer_set = ps.addGroup();

    // Create groups
    let config = new FrequencySeparationBlendGroupConfiguration( hp, lp );
    let group_action = ( layer: ArtLayer, config: FrequencySeparationBlendGroupConfiguration ) => {
      let layer_group = ps.addGroup();
      let layer_1 = layer_group.artLayers[0];
      let layer_2 = layer_group.artLayers[0].duplicate( layer_group.artLayers[0], ElementPlacement.PLACEAFTER );
      layer_2.name = layer_1.name;
    };
    this.each( config, group_action );

    // Separate each layer
    let first_layer = true;
    let frequency_separation_action = ( layer: ArtLayer, config: FrequencySeparationBlendGroupConfiguration ) => {
      this.createFrequencySeparation( first_layer ? config.lp : config.hp );
      first_layer = ! first_layer;
    };
    this.each( config, frequency_separation_action );
    
    this.moveFrequencySeparationBlendGroup( layer_set, config );
    working_layer_set.remove();
    return layer_set;
  }

  shouldMoveFrequencySeparationBlendGroup(
    move_counter: number
  )
  {
    let move_next = move_counter % 4;
    let should_move = ( move_next == 0 ) || ( move_next == 3 );
    return should_move;
  }

  moveFrequencySeparationBlendGroup(
    layer_set: LayerSet,
    config: FrequencySeparationBlendGroupConfiguration,
    move_counter: number = 0
  )
  {

    // Move layers to blend group
    let reference_layer = layer_set.artLayers.add();
    let working_layer_set = layer_set.layerSets[ layer_set.layerSets.length - 1 ];
    app.activeDocument.activeLayer = working_layer_set;
    // let move_counter = 0;
    let move_action = ( layer: ArtLayer, config: FrequencySeparationBlendGroupConfiguration ) => {
      if ( this.shouldMoveFrequencySeparationBlendGroup( move_counter ) ) {
        layer.move( layer_set.artLayers[layer_set.artLayers.length-1], ElementPlacement.PLACEAFTER );
      }
      ++move_counter;
    };
    this.each( config, move_action );
    app.activeDocument.activeLayer = layer_set;
    reference_layer.remove();
  }

 frequencySeparationMixbackfrequencySeparationMixbackFromPrompt()
  : ArtLayer
  {
    let fs_group = this.createFrequencySeparationFromPrompt();
    return this.frequencySeparationMixback( fs_group );
  }

  frequencySeparationMixback(
    frequency_separation_group: LayerSet
  )
  : ArtLayer
  {
    // frequency separation
    // low pass
    // * 0 HP Normal 50%
    // * 1 LP Normal 75%
    // * 2 LP Screen 75%
    // * 3 HP Normal 50%
    // * 4 LP Normal 75%
    // * 5 HP Normal 50%
    // * 6 LP Normal 75%
    // high pass
    // * 0 LP Normal 50%
    // * 1 HP Normal 75%
    // * 2 LP Screen 50%
    // * 3 LP Normal 50%
    // * 4 HP Normal 75%
    // * 5 LP Normal 50%
    // * 6 HP Normal 75%
    let hp = frequency_separation_group.layerSets[0].artLayers[0];
    let lp = frequency_separation_group.layerSets[1].artLayers[0];
    let lp_layers = [];
    lp_layers[0] = hp.duplicate( lp, ElementPlacement.PLACEBEFORE );
    lp_layers[0].opacity = 50;
    lp_layers[1] = lp.duplicate( lp_layers[0], ElementPlacement.PLACEBEFORE );
    lp_layers[1].opacity = 50;

    let hp_layers = [];
    hp_layers[0] = lp.duplicate( hp, ElementPlacement.PLACEBEFORE );
    hp_layers[0].opacity = 75;
    hp_layers[1] = hp.duplicate( hp_layers[0], ElementPlacement.PLACEBEFORE );
    hp_layers[1].opacity = 75;

    let result_layer = frequency_separation_group.merge();
    let autolevels = ps.addAutoLevels();
    result_layer = autolevels.merge();
    return result_layer;
  }

  parseScreenInterleavePrompt( 
    prompt_result: string 
  )
  : ScreenInterleavePrompt
  {
    let prompt_split = prompt_result.split("-");
    if ( prompt_result.length == 0 ) {
      return undefined;
    }
    let normal_opacity = Number( prompt_split[0] );
    let screen_opacity = Number( prompt_split[1] );
    let multiply_opacity = Number( prompt_split[2] );
    let soft_light_opacity = Number( prompt_split[3] );
    let parsed_prompt = new ScreenInterleavePrompt(
      normal_opacity, 
      screen_opacity,
      multiply_opacity,
      soft_light_opacity
    );
    return parsed_prompt;
  }

  createScreenInterleavePrompt()
  : ScreenInterleavePrompt
  {
    let prompt_result = prompt( "[Normal Opacity]-[Screen Opacity]-[Multiply Opacity]-[Soft Light Opacity]", "50-40-25-25" );
    if ( prompt_result.length == 0 ) {
      return undefined;
    }
    let parsed_prompt = this.parseScreenInterleavePrompt( prompt_result );
    return parsed_prompt;
  }

  createScreenInterleaveFromPrompt()
  {
    let prompt = this.createScreenInterleavePrompt();
    return this.createScreenInterleave( prompt );
  }


  createScreenInterleave(
    prompt: ScreenInterleavePrompt = this.createScreenInterleaveFromPrompt()
  )
  {
    let active_layer_as_set = app.activeDocument.activeLayer as LayerSet;
    let active_layer_is_set = (active_layer_as_set.layerSets !== undefined );
    let layer_set = (active_layer_is_set ? active_layer_as_set : active_layer_as_set.parent) as LayerSet;

    let interleave_group = ps.addGroup();
    let screen_layer_set = layer_set.duplicate( layer_set, ElementPlacement.PLACEBEFORE ) as LayerSet;
    let multiply_layer_set = (prompt.opacity.multiply > 0) ? layer_set.duplicate( screen_layer_set, ElementPlacement.PLACEBEFORE ) as LayerSet : undefined;
    let soft_light_layer_set = (prompt.opacity.multiply > 0) ? layer_set.duplicate( (multiply_layer_set?multiply_layer_set:screen_layer_set), ElementPlacement.PLACEBEFORE ) as LayerSet : undefined;

    let layer_count = screen_layer_set.artLayers.length;
    for ( let index = 0 ; index < layer_count ; ++index ) {
      let normal_layer = layer_set.artLayers[index];
      normal_layer.blendMode = BlendMode.NORMAL;
      normal_layer.opacity = prompt.opacity.normal;
      let screen_layer = screen_layer_set.artLayers[index];
      screen_layer.blendMode = BlendMode.SCREEN;
      screen_layer.opacity = prompt.opacity.screen;
      if ( multiply_layer_set ) {
        let multiply_layer = multiply_layer_set.artLayers[index];
        multiply_layer.blendMode = BlendMode.MULTIPLY;
        multiply_layer.opacity = prompt.opacity.multiply;
        }
      if ( soft_light_layer_set ) {
        let soft_light_layer = soft_light_layer_set.artLayers[index];
        soft_light_layer.blendMode = BlendMode.SOFTLIGHT;
        soft_light_layer.opacity = prompt.opacity.soft_light;
      }
    }
    app.activeDocument.activeLayer = interleave_group;
    let interleaved_result_group = this.interleaveLayerSets( false );
    app.activeDocument.activeLayer = interleaved_result_group;
    let result = ps.ungroup();
    app.activeDocument.activeLayer = result;
    return result;
  }

  screenInterleaveMixbackFromPrompt()
  {
    let prompt_result = prompt( "How many times?", "1" );
    if ( prompt_result.length == 0 ) {
      return undefined;
    }
    let number_of_times = Number( prompt_result );
    return this.screenInterleaveMixback( number_of_times );
  }

  screenInterleaveMixback(
    number_of_times: number = 1
  )
  {
    // start with LayerSet with LayerSet and ArtLayer
    let parent_layer_set = app.activeDocument.activeLayer as LayerSet;
    let layer_set = parent_layer_set.layerSets[0];
    let art_layer = parent_layer_set.artLayers[0];
    let prompt = this.createScreenInterleavePrompt();
    for ( let this_time = 0 ; this_time < number_of_times ; ++this_time ) {
      art_layer = this.screenInterleaveMixbackIteration( layer_set, art_layer, prompt, this_time );
    }
    app.activeDocument.activeLayer = parent_layer_set;
    layer_set.remove();
    return parent_layer_set;
  }

  screenInterleaveMixbackIteration(
    layer_set: LayerSet,
    art_layer: ArtLayer,
    prompt: ScreenInterleavePrompt,
    iteration_number: number
  )
  : ArtLayer
  {
    let mixback_layer_set = layer_set.duplicate( art_layer, ElementPlacement.PLACEBEFORE ) as LayerSet;
    app.activeDocument.activeLayer = mixback_layer_set;
    let mixback_group = ps.addGroup();
    mixback_group.name = "Mixback-" + (iteration_number+1).toString(); 
    let mixback_art_layer = art_layer.duplicate( mixback_group, ElementPlacement.PLACEATEND ) as ArtLayer;
    mixback_art_layer.duplicate( mixback_layer_set.artLayers[0], ElementPlacement.PLACEBEFORE );
    app.activeDocument.activeLayer = mixback_layer_set;
    let interleavee_layer_set = this.createScreenInterleave( prompt );
    interleavee_layer_set.name = "Screen Interleave";
    let transparency_blend_layer_set = interleavee_layer_set.duplicate( interleavee_layer_set, ElementPlacement.PLACEBEFORE );
    transparency_blend_layer_set.name = "Transparency Blend";
    app.activeDocument.activeLayer = transparency_blend_layer_set;
    transparency_blend_layer_set = this.createTransparencyBlendForLayerSet();
    interleavee_layer_set.opacity = 75;
    transparency_blend_layer_set.opacity = 75;
    let mixback_iteration_result = mixback_group.merge();
    return mixback_iteration_result;
  }
  frequencySeparationMixbackGroupFromPrompt()
  {
    let number_of_times_string = prompt( "Number of Mixback Iterations:", "10" );
    let number_of_times = Number( number_of_times_string );
    return this.frequencySeparationMixbackGroup( number_of_times );
  }

  frequencySeparationMixbackGroup(
    number_of_times: number
  ) {
    // Start with:
    // * ArtLayer selected
    let mixback_layer = app.activeDocument.activeLayer as ArtLayer;

    let mixback_group = ps.addGroup();
    app.activeDocument.activeLayer = mixback_layer;

    mixback_layer.name = "pre-0";
    for ( let this_time = 0 ; this_time < number_of_times ; ++this_time ) {
      let source_layer = mixback_group.artLayers[0];
      let next_layer = source_layer.duplicate( source_layer, ElementPlacement.PLACEBEFORE );
      app.activeDocument.activeLayer = next_layer;
      let next_layer_separation = this.createFrequencySeparation( 1000 );
      next_layer = this.frequencySeparationMixback( next_layer_separation );
      next_layer.name = "pre-" + (this_time+1).toString();
    }
    app.activeDocument.activeLayer = mixback_group;
    return mixback_group;
  }

  brightnessContrastMixbackGroupFromPrompt()
  {
    let prompt_result_string = prompt( "Iterations:Brightness:Contrast", "10:-5:25" );
    if ( prompt_result_string.length == 0 ) {
      return undefined;
    }
    let prompt_result = prompt_result_string.split(":");
    let number_of_times = Number( prompt_result[0] );
    let brightness = Number( prompt_result[1] );
    let contrast = Number( prompt_result[2] );
    return this.brightnessContrastMixbackGroup( number_of_times, brightness, contrast );
  }

  brightnessContrastMixbackGroup(
    number_of_times: number,
    brightness: number,
    contrast: number
  ) {
    // Start with:
    // * ArtLayer selected
    let mixback_layer = app.activeDocument.activeLayer as ArtLayer;

    let mixback_group = ps.addGroup();
    app.activeDocument.activeLayer = mixback_layer;

    mixback_layer.name = "pre-0";
    for ( let this_time = 0 ; this_time < number_of_times ; ++this_time ) {
      let source_layer = mixback_group.artLayers[0];
      let next_layer = source_layer.duplicate( source_layer, ElementPlacement.PLACEBEFORE );
      next_layer.name = "pre-" + (this_time+1).toString();
      app.activeDocument.activeLayer = next_layer;
      let group = ps.addGroup();
      app.activeDocument.activeLayer = next_layer;
      let bc_layer = ps.addBrightnessContrast( brightness, contrast );
      let source_bias = source_layer.duplicate( bc_layer, ElementPlacement.PLACEBEFORE );
      source_bias.opacity = 50;
      next_layer = group.merge();        
    }
    app.activeDocument.activeLayer = mixback_group;
    return mixback_group;
  }

  mixbackLayerSetsFromPrompt()
  {
    let number_of_times_string = prompt( "Number of Mixback Iterations:", "10" );
    let number_of_times = Number( number_of_times_string );
    return this.mixbackLayerSets( number_of_times );
  }

  mixbackLayerSets(
    number_of_times: number = 1
  )
  {
    // Start with:
    // * Layer Set Selected
    // * Image as first ArtLayer
    // * LayerSet of mixback LayerSets as first LayerSet
    let parent_layer_set = app.activeDocument.activeLayer as LayerSet;
    let mixback_image = parent_layer_set.artLayers[0];
    let mixback_layer_sets = parent_layer_set.layerSets[0];

    mixback_layer_sets.visible = false;

    let layer_set_count = mixback_layer_sets.layerSets.length;
    let mixback_configuration = new MixbackConfiguration( 10, 10, BlendMode.NORMAL, BlendMode.NORMAL );
    for ( let this_time = 0 ; this_time < number_of_times ; ++this_time ) {
      for ( let this_layer_set_index = 0 ; this_layer_set_index < layer_set_count ; ++this_layer_set_index ) {
        let this_layer_set = mixback_layer_sets.layerSets[ this_layer_set_index ];
        mixback_image = mixback_image.duplicate( mixback_image, ElementPlacement.PLACEBEFORE ) as ArtLayer;
        app.activeDocument.activeLayer = mixback_image;
        mixback_image = this.mixbackLayerUsingLayerSet( mixback_image, this_layer_set, mixback_configuration );
        mixback_image.name = "pre-" + ((this_time*layer_set_count)+this_layer_set_index+1).toString();
      }
    }
    app.activeDocument.activeLayer = parent_layer_set;
    return parent_layer_set;
  }

  // Replace layer with mixback result from LayerSet
  mixbackLayerUsingLayerSet(
    layer: ArtLayer,
    layer_set: LayerSet,
    configuration: MixbackConfiguration
  )
  {
    //  * create working LayerSet
    //  * copy the layerset to working LayerSet
    //  * copy the working image to working LayerSet
    //  * set transparency for LayerSet layers
    //  * set transparency and blendmode for working image
    //  * interleave layers
    //  * restore opacity and blend mode for work layer
    //  * transparency blend mode on interleaved group

    app.activeDocument.activeLayer = layer;
    let mixback_group = ps.addGroup();
    mixback_group.visible = false;
    let layer_count = layer_set.artLayers.length;
    let mixback_layer_set = layer_set.duplicate( layer, ElementPlacement.PLACEBEFORE ) as LayerSet;
    for ( let this_index = 0 ; this_index < layer_count ; ++this_index ) {
      let this_layer = mixback_layer_set.artLayers[ this_index ];
      this_layer.opacity = configuration.layerSet.opacity;
      this_layer.blendMode = configuration.layerSet.blendMode;
    }
    layer.opacity = configuration.layer.opacity;
    layer.blendMode = configuration.layer.blendMode;
    app.activeDocument.activeLayer = layer;
    this.interleaveLayer();
    layer.opacity = 100;
    layer.blendMode = BlendMode.NORMAL;
    mixback_layer_set = this.createTransparencyBlendForLayerSet();
    let source_bias = layer.duplicate( mixback_layer_set, ElementPlacement.PLACEBEFORE );
    source_bias.opacity = 50;
    mixback_group.visible = true;
    let result_layer = mixback_group.merge();
    return result_layer;
  }

  blendModeMixbackGroup()
  {
    // Start with:
    // * Layer Set Selected
    // * Image as first ArtLayer
    // * LayerSet for mixback as first LayerSet

    let configs : MixbackConfiguration[] = [ 
      new MixbackConfiguration( 20, 25, BlendMode.SCREEN, BlendMode.NORMAL, "Screen-1" ), 
      new MixbackConfiguration( 20, 25, BlendMode.MULTIPLY, BlendMode.NORMAL, "Multiply-1" ), 
      new MixbackConfiguration( 10, 10, BlendMode.NORMAL, BlendMode.NORMAL, "Normal-1" ), 
      new MixbackConfiguration( 25, 20, BlendMode.NORMAL, BlendMode.SCREEN, "Screen-2" ), 
      new MixbackConfiguration( 25, 20, BlendMode.NORMAL, BlendMode.MULTIPLY, "Multiply-2" ), 
      new MixbackConfiguration( 10, 10, BlendMode.NORMAL, BlendMode.NORMAL, "Normal-2" )
    ];
    let mixback_group = app.activeDocument.activeLayer as LayerSet;
    let mixback_layer_set = mixback_group.layerSets[0];
    mixback_layer_set.visible = false;
    for ( let this_index = 0 ; this_index < configs.length ; ++this_index ) {
      let this_config = configs[ this_index ];
      let mixback_layer = mixback_group.artLayers[0].duplicate( mixback_group.artLayers[0], ElementPlacement.PLACEBEFORE ) as ArtLayer;
      app.activeDocument.activeLayer = mixback_layer;
      mixback_layer = this.mixbackLayerUsingLayerSet( mixback_layer, mixback_layer_set, this_config );
      if ( this_config.name ) {
        mixback_layer.name = this_config.name;
      }
    }
    return mixback_group;
  }

  splitInterleavedSubgroupsFromPrompt() {
    let layer_set = app.activeDocument.activeLayer as LayerSet;
    let layer_count = layer_set.artLayers.length;
    let group_count = Math.ceil( layer_count / 8 );
    let prompt_result = prompt( "Number of Groups:", group_count.toString() );
    if ( prompt_result.length == 0 ) {
      return undefined;
    }
    let number_of_groups = Number( prompt_result );
    return this.splitInterleavedSubgroups( number_of_groups );
  }

  splitInterleavedSubgroups(
    number_of_groups: number
  )
  {
    let layer_set = app.activeDocument.activeLayer as LayerSet;
    for ( let index = 0 ; (layer_set.artLayers.length > 0), (index < number_of_groups) ; ++index ) {
      app.activeDocument.activeLayer = layer_set.artLayers[0];
      let group_name = 'Group ' + (index+1).toString();
      let this_group = ps.addGroup( group_name );
    }
    while ( layer_set.artLayers.length > 0 ) {
      for ( let index = 0 ; (layer_set.artLayers.length > 0) && (index < number_of_groups) ; ++index ) {
        let this_layer = layer_set.artLayers[0];
        let this_layer_set = layer_set.layerSets[index];
        this_layer.move( this_layer_set.artLayers[ this_layer_set.artLayers.length-1 ], ElementPlacement.PLACEAFTER );
      }
    }
    for ( let index = 0 ; index < layer_set.layerSets.length ; ++index ) {
      app.activeDocument.activeLayer = layer_set.layerSets[index];
      ps.toggleGroup();
    }
    app.activeDocument.activeLayer = layer_set;
    return layer_set;
  }


}

globalThis.resources = new Resources;
let resources = globalThis.resources;

export { Resources, resources };
