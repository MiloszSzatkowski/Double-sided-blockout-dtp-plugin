#target photoshop

//debugger;

$.localize = 0;

// UI ******************************* UI

// var Title = "Double sided blockout";
//
// var win = new Window ('dialog {orientation: "row", alignChildren: ["fill","fill"]}',
// Title, undefined, {closeButton: true});
//
// var Left = win.add ('group {orientation: "row"}', undefined, '');
// var Middle = win.add ('group {orientation: "row"}', undefined, '');
// var Right = win.add ('group {orientation: "row"}', undefined, '');
//
// Left.add ( )

// UI ******************************* UI ******* -- END

if (true) {

  second = app.documents[parseInt(chosen.value)];

  second.selectAll();
  second.copy();

  first.paste();

  flip ( );

}


function flip (layer)  {
  layer.transform ( xDelta, yDelta, xDeltaTrans, yDeltaTrans );
  
}
