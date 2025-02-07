/// <reference types="types-for-adobe/Photoshop/2015.5"/>

 for ( let index = 0 ; index < 2 ; ++index ) {
  let customData = undefined;
  let customData_d = undefined;
  try {
    customData_d = app.getCustomOptions('asher');
    customData = JSON.parse(customData_d.getString(0));
  }
  catch(e){ 
    alert('Initializing count.');
    customData_d = new ActionDescriptor();
    customData = {};
    customData.count = 0;
    let json = JSON.stringify(customData);
    // customData_d.putString(0,json); 
    // app.putCustomOptions('asher',customData_d,false );
  }
  ++customData.count;
  // customData_d.putString(0,JSON.stringify(customData)); 
  // app.putCustomOptions('asher',customData_d,false);
  
  alert( 'Script has run ' + customData.count + ' times.' );  
}
