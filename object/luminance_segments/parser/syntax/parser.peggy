

{{
  import { SegmentToken, LayerToken, ArtLayerToken, NestedLayerToken, AdjustmentLayerToken, ConditionalLayerToken, InOutToken, IOToken, WalkLayerToken, StartEndToken, NumericValueToken, ConditionToken } from '../tokens';

  import { CrispCmd } from '../../../../cmd/crisp.cmd';
  import { PaintCmd } from '../../../../cmd/paint.cmd';
  import { PaintMultiplyCmd } from '../../../../cmd/paint-multiply.cmd';
  import { PosterizeCmd } from '../../../../cmd/posterize.cmd';
  import { MultiplyCmd } from '../../../../cmd/multiply.cmd';
  import { SplitMultiplyCmd } from '../../../../cmd/split_multiply.cmd';
  import { SplitScreenCmd } from '../../../../cmd/split_screen.cmd';
  import { ScreenCmd } from '../../../../cmd/screen.cmd';

  function assignIfUndefined( object, if_undefined ) {
    if ( object === undefined ) {
      return if_undefined;
    }
    else return object;
  }
  
  function mergeObjects( objects ) {
    let merged = {};
    for ( let this_object of objects ) {
      for ( let this_property in this_object ) {
        let this_value = this_object[this_property];
        merged[this_property] = this_value;
      }
    }  
    return merged;  
  } 

  function mergeArrays( arrays ) {
    let result = [];
    for ( let this_array of arrays ) {
      result = result.concat( this_array );
    }
    return result;
  }

  function assignObject( object, config ) {
    for ( let this_property in config ) {
      let this_value = config[ this_property ];
      object[ this_property ] = this_value;
    }
    return object;
  }
}}

/********** Segment Configurations **********/

start
  = segments
  / commands

segments
  = number_of_segments:number_of_segments list_delim layers:layers iteration_delim? {
    let segments = new SegmentToken;
    segments.set_number_of_segments( number_of_segments );
    segments.layers = layers;
    return segments;
  }

number_of_segments
  = 'SEGMENTS'i assign number_of_segments:integer { 
    return number_of_segments;
  }

/********** Layer Configurations **********/

layers
  = layer:layer_declaration | 1.., layer_delim | layer_delim? {
    return layer;
  }

layer_declaration
  = layer
  / conditional_layer
  / nested 
  / adjustment_layer
  / walk_layer

/********** Layer Configurations **********/

layer 
  = blend_style:blend_style lparen layer_configurations:layer_configurations? rparen should_merge:merge? { 
    let token = undefined;
    let art_layer_token = new ArtLayerToken();
    if ( layer_configurations ) {
      let token = mergeArrays( layer_configurations );
      token = mergeObjects( token );
      assignObject( art_layer_token, token );
    }
    art_layer_token.blendMode = blend_style.blendMode;
    if ( blend_style.invert !== undefined ) {
      art_layer_token.invert = true;
    }
    if ( should_merge ) {
      art_layer_token.merge = true; 
    }
    return art_layer_token;
  }
  
layer_configurations
  = config:layer_configuration  | 1.., list_delim | list_delim? {
    return config;
  }

layer_configuration
  = layer_opacity
  / layer_in
  / layer_out
  / layers:layers {
    let token = { "layers": layers };
    return token;
  }

layer_opacity
  = lhs:opacity { 
      return { "opacity": lhs }; 
    }

/********** Strings **********/

blend_mode
  = 'COLORBLEND'i
  / 'COLORBURN'i
  / 'COLORDODGE'i
  / 'DARKEN'i
  / 'DARKERCOLOR'i
  / 'DIFFERENCE'i
  / 'DISSOLVE'i
  / 'DIVIDE'i
  / 'EXCLUSION'i
  / 'HARDLIGHT'i
  / 'HARDMIX'i
  / 'HUE'i
  / 'LIGHTEN'i
  / 'LIGHTERCOLOR'i
  / 'LINEARBURN'i
  / 'LINEARDODGE'i
  / 'LINEARLIGHT'i
  / 'LUMINOSITY'i
  / 'MULTIPLY'i
  / 'NORMAL'i
  / 'OVERLAY'i
  / 'PASSTHROUGH'i
  / 'PINLIGHT'i
  / 'SATURATION'i
  / 'SCREEN'i
  / 'SOFTLIGHT'i
  / 'SUBTRACT'i
  / 'VIVIDLIGHT'i 

inversion_pattern
  = 'INVERTED'i

blend_style
  = invert:inversion_pattern? ws? blend_mode:blend_mode {
    let token = { "blendMode": blend_mode.toUpperCase() };
    if ( invert ) {
      token.invert = true;
    }
    return token;
  };


/********** Usage **********/

opacity
  = 'OPACITY'i assign opacity:integer '%'? { return opacity; }
  / opacity:integer '%' { return opacity; }

/********** In / Out Configurations **********/

layer_in 
  = 'IN'i lparen configs:layer_levels_configurations rparen {
    let in_config = new IOToken();
    for ( let this_config of configs ) {
      assignObject( in_config, this_config );
    }
    return {"in": in_config};
  }

layer_out 
  = 'OUT'i ws? lparen configs:layer_levels_configurations rparen {
    let out_config = new IOToken();
    for ( let this_config of configs ) {
      assignObject( out_config, this_config );
    }
    return { "out": out_config };
  }

layer_levels_configurations
  = config:layer_levels_configuration | 1.., list_delim | list_delim? {
    return config;
  }

layer_levels_configuration
  = levels_gamma
  / levels_black_white

levels_black_white
  = levels_black 
  / levels_white

levels_gamma
  = 'GAMMA'i assign gamma:gamma_value { 
    return { "gamma": gamma }; 
  }

gamma_value
  = unsigned_float
  / unsigned_integer

levels_black
  = 'BLACK'i assign io_value:io_value {
    return { "black": io_value };
  }

levels_white
  = 'WHITE'i assign io_value:io_value {
    return { "white": io_value };
  }

io_value
  = lhs:unsigned_integer { 
    return new NumericValueToken( lhs, true );
  }
  / lhs:signed_integer{ 
    return new NumericValueToken( lhs, false );
  }

/********** Walk Configurations **********/

walk_layer
  = 'WALK'i ws? blend_style:blend_style? ws? lparen configs:walk_configurations rparen merge:merge? { 
    if ( blend_style ) {
      configs.push( blend_style );
    }
    let walk_config = mergeObjects( configs );
    let walk_token = new WalkLayerToken;
    assignObject( walk_token, walk_config );
    if ( merge ) {
      walk_token.merge = true; 
    }
    return walk_token;
  }

walk_configurations
  = config:walk_configuration | 1.., list_delim | list_delim? {
    return config;
  }

walk_configuration
  = walk_start
  / walk_end
  / walk_steps
  / layer_configuration

walk_start
  = 'START'i assign start:walk_start_value {
    return start;
  }

walk_start_value
  = value:walk_start_end_value_absolute {
    let start = new StartEndToken;
    start.value = value;
    start.absolute = true;
    return {
      "start": start
    }
  }
  / value:walk_start_end_value_offset   { 
    let start = new StartEndToken;
    start.value = value;
    start.absolute = false;
    return {
      "start": start
    }
  }

walk_start_end_value_absolute
  = unsigned_integer 

walk_start_end_value_offset
  = signed_integer   
  / float

walk_end
  = 'END'i assign end:walk_end_value {
    return end;
  }

walk_end_value
  = value:walk_start_end_value_absolute { 
    let end = new StartEndToken;
    end.value = value;
    end.absolute = true;
    return {
      "end": end
    }
  }
  / value:walk_start_end_value_offset   { 
    let end = new StartEndToken;
    end.value = value;
    end.absolute = false;
    return {
      "end": end
    }
  }

walk_steps
  = 'STEPS'i assign rhs:walk_steps_value {
    return { "steps": rhs };
  }

walk_steps_value
  = unsigned_integer
  / signed_integer
  / float

/********** Conditional **********/

conditional_layer
  = 'IF'i lparen conditions:layer_conditions rparen lbracket layers:layers rbracket {
    let token = new ConditionalLayerToken;
    token.layers = layers;
    token.conditions = conditions;
    return token;
  }

layer_conditions 
  = condition:layer_condition | 1.., boolean | {
    return condition;
  }

layer_condition 
  = min comparison:comparison_rhs { 
    let condition = new ConditionToken;
    condition.method = ( min, max ) => { return comparison( min ); };
    return condition;
  }
  / max comparison:comparison_rhs {
    let condition = new ConditionToken;
    condition.method = ( min, max ) => { return comparison( max ); };
    return condition;
  }

comparison_rhs
  = gt rhs:unsigned_integer { 
    return (lhs) => { return lhs > rhs; };
  }
  / gte rhs:unsigned_integer { 
    return (lhs) => { return lhs >= rhs; };
  }
  / lt rhs:unsigned_integer {
    return (lhs) => { return lhs < rhs; };
  }
  / lte rhs:unsigned_integer {
    return (lhs) => { return lhs <= rhs; };
  }

/********** Nested **********/

nested 
  = 'NESTED'i ws? blend_style:blend_style lparen configs:nested_configurations rparen should_merge:merge? {
    let token = new NestedLayerToken;
    if ( should_merge ) {
      token.merge = true;
    }
    token.blendMode = blend_style.blendMode;
    if ( blend_style.invert !== undefined ) {
      token.invert = true;
    }
    token.layers = configs;
    return token;
  }

nested_configurations
  = config:nested_configuration | 1.., list_delim | list_delim? {
    return config;
  }

nested_configuration
  = layer_declaration 

/********** Adjustment Layers **********/

adjustment_layer
  = invert_adjustment_layer
  / brightness_adjustment_layer 
  / levels_adjustment_layer

invert_adjustment_layer
  = 'INVERT'i { 
    let adjustment_layer = new AdjustmentLayerToken();
    adjustment_layer.name = "Invert";
    adjustment_layer.method = (p) => { 
      ps.addInvertAdjustmentLayer() 
    };
    return adjustment_layer;
  }

brightness_adjustment_layer
  = 'BRIGHTNESS'i lparen configs:brightness_configurations rparen { 
    let config = mergeObjects( configs );
    let adjustment_layer = new AdjustmentLayerToken();
    adjustment_layer.name = "Brightness/Contrast";
    adjustment_layer.method = (p) => { 
      let brightness = assignIfUndefined( config.brightness, 0 );
      let contrast = assignIfUndefined( config.contrast, 0 );
      ps.addBrightnessContrast( brightness, contrast ) 
    };
    adjustment_layer.config = config;
    return adjustment_layer;
  }

brightness_configurations
  = config:brightness_configuration | 1.., list_delim | list_delim? {
    return config;
  }

brightness_configuration
  = brightness_assignment
  / contrast_assignment
  / blend_mode:blend_mode { 
    return { "blendMode": blend_mode.toUpperCase() }; 
  }
  / layer_opacity

brightness_assignment
  = 'BRIGHTNESS'i assign brightness:integer { 
    return { "brightness": brightness };
  }

contrast_assignment
  = 'CONTRAST'i assign contrast:integer {
    return { "contrast": contrast };
  }

levels_adjustment_layer
  = 'LEVELS'i lparen configs:levels_adjustment_configurations rparen { 
    let config = mergeObjects( configs );
    let adjustment_layer = new AdjustmentLayerToken();
    adjustment_layer.name = "Levels";
    adjustment_layer.method = (p) => { 
      if ( config.in === undefined ) {
        config.in = new IOToken;
      }
      if ( config.in.white === undefined ) {
        config.in.white = new NumericValueToken;
      }
      if ( config.in.black === undefined ) {
        config.in.black = new NumericValueToken;
      }
      if ( config.out === undefined ) {
        config.out = new IOToken;
      }
      if ( config.out.white === undefined ) {
        config.out.white = new NumericValueToken;
      }
      if ( config.out.black === undefined ) {
        config.out.black = new NumericValueToken;
      }
      config.in.black.value = assignIfUndefined( config.in.black.value, 0 );
      config.in.white.value = assignIfUndefined( config.in.white.value, 255 );
      config.out.black.value = assignIfUndefined( config.out.black.value, 0 );
      config.out.white.value = assignIfUndefined( config.out.white.value, 255 );
      config.gamma = assignIfUndefined( config.gamma, 1.0 );
      ps.addLevels( config.in.black.value, config.in.white.value, config.gamma, config.out.black.value, config.out.white.value ) 
    };
    adjustment_layer.config = config;
    return adjustment_layer;
  }

levels_adjustment_configurations
  = config:levels_adjustment_configuration | 1.., list_delim | list_delim? {
    return config;
  }

levels_adjustment_configuration
  = levels_adjustment_in
  / levels_adjustment_out 
  / levels_gamma

levels_black_white_configurations
  = config:levels_black_white | 1.., list_delim | list_delim? {
    return config;
  }
  
levels_adjustment_in 
  = 'IN'i lparen configs:levels_black_white_configurations rparen {
    let in_config = new IOToken();
    for ( let this_config of configs ) {
      assignObject( in_config, this_config );
    }
    return {"in": in_config};
  }

levels_adjustment_out 
  = 'OUT'i ws? lparen configs:levels_black_white_configurations rparen {
    let out_config = new IOToken();
    for ( let this_config of configs ) {
      assignObject( out_config, this_config );
    }
    return { "out": out_config };
  }

/********** Numbers **********/

unsigned_integer 
  = digits:[0-9]+ { 
  return Number(digits.join("")); 
}

signed_integer
  = '-' ws? rhs:unsigned_integer { 
    return -Number(rhs); 
  }
  / '+' ws? rhs:unsigned_integer {
    return Number(rhs); 
  }

integer
  = signed_integer
  / unsigned_integer

float 
  = signed_float
  / unsigned_float

signed_float 
  = '-' ws? rhs:unsigned_float { return -Number(rhs); }
  / '+' ws? rhs:unsigned_float { return Number(rhs); }

unsigned_float 
  = [0-9]* '.' [0-9]+ { return Number(text()); }

/********** Operators **********/

assign
  = ws? assign_operators ws?

assign_operators
  = '='
  / ':'


merge
  = '!'

/********** Logic **********/

boolean 
  = and
  / or 

and 
  = ws? 'AND'i ws?
  / ws? '&&' ws?

or 
  = ws? 'OR'i ws?
  / ws? '||' ws?

gt
  = ws? '>' ws?

gte
  = ws? '>=' ws?

lt
  = ws? '<' ws?

lte
  = ws? '<=' ws?

min 
  = ws? 'MIN'i ws?

max 
  = ws? 'MAX'i ws?


/********** Delimeters **********/

list_delim
  = [ \t\n,]+

layer_delim
  = [ \t\n%,]+

iteration_delim
  = [ \t\n;]+

float_delim
  = "."

/********** () [] **********/

lparen
  = ws? '(' ws?

rparen
  = ws? ')' ws?

lbracket
  = ws? '{' ws?

rbracket
  = ws? '}' ws?

/********** White Space **********/

ws
  = [ \t\n]+

  /******************** Commands (Re-entrant) ********************/

commands
  = crisp_cmd
  / paint_normal_cmd
  / paint_multiply_cmd
  / posterize_cmd
  / multiply_cmd
  / split_multiply_cmd
  / split_screen_cmd
  / screen_cmd

crisp_cmd
  = 'CRISP'i {
    this_segment_configuration = peg$parse( CrispCmd );
    return this_segment_configuration;
  }

paint_normal_cmd
  = paint_normal_cmd_aliases {
    this_segment_configuration = peg$parse( PaintCmd );
    return this_segment_configuration;
  }

paint_normal_cmd_aliases
  = 'PAINT-NORMAL'i
  / 'PAINT NORMAL'i

paint_multiply_cmd
  = paint_multiply_cmd_aliases {
    this_segment_configuration = peg$parse( PaintMultiplyCmd );
    return this_segment_configuration;
  }

paint_multiply_cmd_aliases
  = 'PAINT-MULTIPLY'i
  / 'PAINT MULTIPLY'i

posterize_cmd
  = 'POSTERIZE'i {
    this_segment_configuration = peg$parse( PosterizeCmd );
    return this_segment_configuration;
  }

multiply_cmd
  = 'MULTIPLY'i {
    this_segment_configuration = peg$parse( MultiplyCmd );
    return this_segment_configuration;
  }

split_multiply_cmd
  = split_multiply_cmd_aliases {
    this_segment_configuration = peg$parse( SplitMultiplyCmd );
    return this_segment_configuration;
  }

split_multiply_cmd_aliases
  = 'SPLIT-MULTIPLY'i
  / 'SPLIT MULTIPLY'i

screen_cmd
  = 'SCREEN'i {
    this_segment_configuration = peg$parse( ScreenCmd );
    return this_segment_configuration;
  }

split_screen_cmd
  = split_screen_cmd_aliases {
    this_segment_configuration = peg$parse( SplitScreenCmd );
    return this_segment_configuration;
  }

split_screen_cmd_aliases
  = 'SPLIT-SCREEN'i
  / 'SPLIT SCREEN'i
