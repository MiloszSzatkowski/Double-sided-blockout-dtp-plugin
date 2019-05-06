////////////////////////////////// ONLY OPERATE IN PHOTOSHOP ***********************

#target photoshop

////////////////////////////////// GLOBAL VARIABLES START ***********************

// ** UI TEXT VARIABLES

var u_window_title = 'Double-sided blockout photoshop manager';

var u = undefined;
var e = '';
var n = null;


////////////////////////////////// GLOBAL VARIABLES END ***********************

/////////////////////////////////// UI START ***********************

function updateUILayout(el) {
  el.layout.layout(true);
  amount_of_modules.text = scrollGroup.children.length;
}

// ////////////////////////////////  WINDOW

var W = new Window('dialog {orientation: "row"}', u_window_title);
W.maximumSize.width = 800;
W.maximumSize.height = 500;

W.minimumSize.width = W.maximumSize.width - 10;
W.minimumSize.height = W.maximumSize.height - 10;

var main_group = W.add ('group {orientation: "column", alignChildren: ["fill","fill"]}');

var top_group    = main_group.add('group');
main_group.add('panel');
var bottom_group = main_group.add('group');

/////////   MODULES CONTAINER
var modules_container = top_group.add('group {orientation: "row"}, alignChildren: ["left","top"]', u, e);

modules_container.minimumSize.height = W.maximumSize.height - 150;
modules_container.minimumSize.width = W.maximumSize.width - 80;
modules_container.maximumSize.height = modules_container.minimumSize.height;

var scrollGroup = modules_container.add('group {orientation: "column"}, alignChildren: ["fill","fill"]', u, e)

var scrollBar = W.add ('scrollbar {stepdelta: 20}', [0, 0, 50, 400]);
var scroll_offset = 0;

scrollBar.onChanging = function () {
scrollGroup.location.y = (-1 * scroll_offset) * this.value;
}

/////////   BOTTOM CONTROL GROUP
/////////   BOTTOM CONTROL GROUP

var amount_of_modules = bottom_group.add('panel').add('statictext', u, scrollGroup.children.length );
amount_of_modules.minimumSize.width = 20;

var add_blockout = bottom_group.add('button', u, '+ blockout');

add_blockout.onClick = function () {
  var new_module = new Module ();
  updateUILayout(W);
}

var delete_blockout = bottom_group.add('button', u, '- blockout');

delete_blockout.onClick = function () {
  if (scrollGroup.children.length > 1) {
    scrollGroup.remove (scrollGroup.children[scrollGroup.children.length-1]);
    updateUILayout(W);
  }
}

var close_button = bottom_group.add('button', u, 'close');
close_button.onClick = function () { W.close() }

/////////   BOTTOM CONTROL GROUP END
/////////   BOTTOM CONTROL GROUP END

//////////////////////// MODULE CONSTRUCTOR ********************************************
//////////////////////// MODULE CONSTRUCTOR ********************************************
//////////////////////// MODULE CONSTRUCTOR ********************************************

var script_folder = new File($.fileName).parent;

function Module() {

  this.s = function (t) {
    t.add('statictext', u, '|');
  }

  var _cont = scrollGroup.add('panel {orientation: column} ');

  scrollGroup.alignment = ["left", "top"];
  var _top = _cont.add('group');

  _top.minimumSize.width = 200;

  var _bottom = _cont.add('group');

  var first_side = _top.add('statictext', u, '1st Side');
  var button_first_side = _top.add('button', u, 'Open File');

  this.s(_top);

  var second_side = _top.add('statictext', u, '2nd Side');
  var button_second_side = _top.add('button', u, 'Open File');

  this.s(_top);

  button_first_side.onClick = function () {

  }

  _top.add ('image', undefined, File (script_folder + '/icons/top.png'));
  _top.add('dropdownlist', u,
  ['small weld | maly zgrzew', 'big weld | maly zgrzew', 'rekaw | sleeve']);
  this.s(_top);

  _top.add ('image', undefined, File (script_folder + '/icons/right.png'));
  this.s(_top);

  _top.add ('image', undefined, File (script_folder + '/icons/down.png'));
  this.s(_top);

  _top.add ('image', undefined, File (script_folder + '/icons/left.png'));
  this.s(_top);

  scroll_offset = scrollGroup.children.length/2;
  scrollBar.value = 0;
}

new Module ();

W.show();

/////////////////////////////////// UI END ***********************
