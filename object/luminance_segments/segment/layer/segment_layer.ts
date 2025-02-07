/// <reference path="../segment.d.ts" />

import { helper as ps } from '../../../../helper';

import { LayerToken } from '../../parser/tokens/layers/layer_token';

class SegmentLayer
{
  segment: Segment;
  token: LayerToken;
  source: ArtLayer;

  group?: LayerSet;
  layer?: ArtLayer;

  opacity: number = 100;

  constructor( 
    segment: Segment,
    token: LayerToken
  )
  {
    this.segment = segment;
    this.token = token;
  }

  initFromActiveLayer()
  : SegmentLayer | undefined
  {
    if ( this.token.requiresGroup ) {
      return this.initFromActiveLayerWithGroup();
    }
    else {
      return this.initFromActiveLayerWithoutGroup();
    }
  }

  initFromActiveLayerWithGroup()
  : SegmentLayer | undefined
  {
    this.source = app.activeDocument.activeLayer as ArtLayer;
    this.group = ps.addGroup();
    if ( this.token.blendMode ) {
      this.group!.blendMode = BlendMode[this.token.blendMode];
    }
    if ( this.token.name ) {
      this.group!.name = this.token.name;
    }
    if ( this.token.opacity ) {
      this.group!.opacity = this.token.opacity;
    }
    app.activeDocument.activeLayer = this.source;
    return this;  
  }

  initFromActiveLayerWithoutGroup()
  : SegmentLayer | undefined
  {
    this.layer = this.source = app.activeDocument.activeLayer as ArtLayer;
    if ( this.token.blendMode ) {
      this.source!.blendMode = BlendMode[this.token.blendMode];
    }
    if ( this.token.name ) {
      this.source!.name = this.token.name;
    }
    if ( this.token.opacity ) {
      this.source!.opacity = this.token.opacity;
    }
    return this;
  }

  updateOpacity(
    opacity:number = this.opacity
  )
  {
    this.referenceLayer().opacity = opacity;
  }

  referenceLayer()
  : LayerSet | ArtLayer
  {
    if ( this.group ) {
      return this.group;
    }
    else if ( this.layer ) {
      return this.layer;
    }
    else { 
      throw( "Group and layer were both undefined, which should never happen." );
    }
  }

  mergeIfRequired()
  {
    if ( this.token.merge ) {
      if ( this.group !== undefined ) {
        app.activeDocument.activeLayer = this.group;
        this.layer = this.group.merge();
        this.group = undefined;
      }
    }
  }

}

export { SegmentLayer };
