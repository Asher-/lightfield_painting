/// <reference types="types-for-adobe/Photoshop/2015.5"/>

// Required three parameters  tool,Set,list
var tool = 'paintbrushTool';                     // Photoshop Tool name your Presets set is for. Only one tool's presets

var presetSet  = 'the_sketch_arsenal_by_thatld'; // Presets set name *.tpl file need to be same folder as this Photoshop script.
var presetNames = [                              // Preset names list start. Presets you want to cycle through. Set can have more. 
  'Color Brush - Flat',
  'Color Brush - Magic Edge',
  'Color Pencil - Hard',
  'Color Pencil - Soft',
  'Drawing Pencil - B Lead',
  'Drawing Pencil - Blue Line',
  'Drawing Pencil - H Lead',
  'Linework Pen - Fine',
  'Marker - Lower the Flow to Dry',
  'Shading Brush - Pressure Hold',
  'Shading Brush - Soft Texture',
  'Shading Pencil - General',
  'Shading Pencil - Hard',
  'Shading Pencil - Soft',
  'Sketch Pencil - H Lead',
  'Sketch Pencil - The Ultimate!',
  'Watercolor Brush - General'
  ];                                             // Presets names list end. Order the way you want to cycle through them
// End Required Parameters


cycle(tool,presetSet,presetNames);               // Cycle Forward and Backward through tool presets set names

// End of Script


// =================================================== Main function ======================================================== //
function cycle(toolName,toolPresetSet,toolPresetNames){
  if (currentToolName()!=toolName) { // if user is switching tools try to else switch tool preset
    try {selectTool(toolName);} // Insure the tool is select so preset can be selected
    catch(e) {alert("Unable to Select the Tool "+toolName); return;} // Tool name wrong or unavailable 
    //if (app.toolSupportsBrushes(app.currentTool)) app.runMenuItem(charIDToTypeID(('TglB'))); //Toggle Brush Palette
    return; // Just switch to the tools current setting 
  }
  var desc = new ActionDescriptor(); // Set up Photoshop to remember variables
  try {var desc = app.getCustomOptions('Cycle'+toolPresetSet);} // Try to get CustomOption for cycling this tool presets set
  catch(e){ // Each Photoshop session this should fail first time reset
  try {selectToolPreset(toolPresetNames[0]);} // Insure Tool Presets Set has been loaded 
  catch(e) { // Will fail if tools presets set is not loaded
    if (loadToolPresetSet(toolPresetSet)) { // Load Tool presets set
      try {selectToolPreset(toolPresetNames[0]);} // Load sets first preset
      catch(e) {alert("Was unable to Select the Tools Preset "+toolPresetNames[0]); return;} // Failed to select preset
    }
    else {
      alert("Was unable to load Tools Presets Set "+toolPresetSet); return;} // Failed to load tools presets set
    }
    desc.putInteger(0,0); // This line save the variable while Photoshop is open,
    app.putCustomOptions('Cycle'+toolPresetSet,desc,false );// Initialize presets set CustomOption for cycling
    desc = app.getCustomOptions('Cycle'+toolPresetSet); // Get CustomOption Cycle starting point
  }
  var presetNumber = desc.getInteger(0); // Get the preset index
  if ( ScriptUI.environment.keyboardState.ctrlKey || 
       ScriptUI.environment.keyboardState.altKey  ||
       ScriptUI.environment.keyboardState.shiftKey ) { // Previous preset if Ctrl or Alt or Shift key is down
    presetNumber = presetNumber - 2; // Back up two preset for it will be bumped one
    if ( presetNumber < 0 ) {
      presetNumber=toolPresetNames.length - 1; // Set preset index to the end of the list
    } 
  }
  if ( presetNumber < toolPresetNames.length ) { 
    desc.putInteger(0,presetNumber+1); // Update preset index number
  } 
  else {
    presetNumber=0; 
    desc.putInteger(0,1); // Reset preset index pointer to the begging of the list
  } 
  app.putCustomOptions('Cycle'+toolPresetSet,desc,false); // Put Update the Custom option
  try {selectToolPreset(toolPresetNames[presetNumber]);} // Set tool with preset
  catch(e) {
    if ( loadToolPresetSet(toolPresetSet) ) { // Load Tool presets set Tool presets may have reset
    try { selectToolPreset(toolPresetNames[presetNumber]); } // Set tool with preset
    catch(e) {
      alert("Was unable to Select the Tools Preset "+toolPresetNames[presetNumber]); return;} // Failed to select
    }
    else {alert("Was unable to load Tools Presets Set "+toolPresetSet); return;} // Failed to load tools presets set
  }
};
// =================================================== Helper functions ===================================================== //
function selectTool(tool) {
    var desc9 = new ActionDescriptor();
        var ref7 = new ActionReference();
        ref7.putClass( app.stringIDToTypeID(tool) );
    desc9.putReference( app.charIDToTypeID('null'), ref7 );
    executeAction( app.charIDToTypeID('slct'), desc9, DialogModes.NO );
};
function selectToolPreset(PresetName) {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putName( stringIDToTypeID( "toolPreset" ), PresetName );
  desc.putReference( charIDToTypeID( "null" ), ref );
  executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );
}
function loadToolPresetSet(SetName) {
  returncode = true;
  var scriptLocation = String(findScript());
  var path = scriptLocation.substr(0, scriptLocation.lastIndexOf("/") + 1 ) ;
  var SetFile = new File(path + SetName + ".tpl");   // Requited to be in the script's folder
  if (!SetFile.exists) { returncode = false; }
  else {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putProperty( charIDToTypeID( "Prpr" ), stringIDToTypeID( "toolPreset"  ));
  ref.putEnumerated( charIDToTypeID( "capp" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt"  ) );
  desc.putReference( charIDToTypeID( "null" ), ref );
  desc.putPath( charIDToTypeID( "T   " ), new File( SetFile ) );
  desc.putBoolean( charIDToTypeID( "Appe" ), true );
  try {executeAction( charIDToTypeID( "setd" ), desc, DialogModes.NO );}
  catch(e) { returncode = false; }
  }
  return returncode ;
}
function findScript() {// Find the location where this script resides
  var where = "";
  try { FORCEERROR = FORCERRROR;}
  catch(err) { where = File(err.fileName);}
  return where ;
}
function currentToolName() {
  var ref = new ActionReference();
  ref.putProperty(stringIDToTypeID("property"), stringIDToTypeID("tool"));
  ref.putEnumerated( charIDToTypeID("capp"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
  var applicationDesc = executeActionGet(ref);
  //alert(typeIDToStringID(applicationDesc.getEnumerationType(stringIDToTypeID("tool"))));
  return(typeIDToStringID(applicationDesc.getEnumerationType(stringIDToTypeID("tool"))));
}
// ++app.customData;
// alert( 'Script has run ' + app.customData + ' times.' );
