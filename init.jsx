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
}

// ////////////////////////////////  WINDOW

var W = new Window('dialog {orientation: "row"}', u_window_title);
W.maximumSize.width = 1000;
W.maximumSize.height = 600;

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

var scrollBar = W.add ('scrollbar {stepdelta: 40}', [0, 0, 50, 500]);
var scroll_offset = 0;

scrollBar.onChanging = function () {
  for (var i = 0; i < scrollGroup.children.length; i++) {
    scrollGroup.children[i].location.y = (-1 * scroll_offset) * this.value + (160 * i);
  }
  // scrollGroup.location.y = (-1 * scroll_offset) * this.value;
}

/////////   BOTTOM CONTROL GROUP
/////////   BOTTOM CONTROL GROUP

var amount_of_modules = bottom_group.add('panel').add('statictext', u, 1 );
amount_of_modules.minimumSize.width = 20;

var add_blockout = bottom_group.add('button', u, '+ blockout');

add_blockout.onClick = function () {
  amount_of_modules.text = parseFloat(amount_of_modules.text) + 1;
  var new_module = new Module ();
  updateUILayout(W);
}

var delete_blockout = bottom_group.add('button', u, '- blockout');

delete_blockout.onClick = function () {
  if (scrollGroup.children.length > 0) {
    amount_of_modules.text = parseFloat(amount_of_modules.text) - 1;
    scrollGroup.remove (scrollGroup.children[scrollGroup.children.length-1]);
    scrollBar.value = 0;
    updateUILayout(W);
  }
}

var close_button = bottom_group.add('button', u, 'close');
close_button.onClick = function () { W.close();  }

var small_weld_d = bottom_group.add('statictext', u, 'Small weld | Maly zgrzew:');
var small_weld = bottom_group.add('edittext', u, 3);
var big_weld_d = bottom_group.add('statictext', u, 'Big weld | Duzy zgrzew:');
var big_weld = bottom_group.add('edittext', u, 5);

/////////   BOTTOM CONTROL GROUP END
/////////   BOTTOM CONTROL GROUP END

//////////////////////// MODULE CONSTRUCTOR ********************************************
//////////////////////// MODULE CONSTRUCTOR ********************************************
//////////////////////// MODULE CONSTRUCTOR ********************************************

var script_folder = new File($.fileName).parent;
var finishings =
  ['cut | dociecie' , 'sm weld | maly zgrzew', 'xl weld | duzy zgrzew', 'sleeve | rekaw'];

var colors = [ '0,0,0,0' , '100,100,100,100', '50,50,50,50'];

var opened_documents_names = [];

try {
  if (app.documents.length !== 0) {
    for (var i = 0; i < app.documents.length; i++) {
      opened_documents_names.push(app.documents[i].name);
    }
  }
} catch (e) { }

function Module() {

  this.s = function (t) {  t.add('statictext', u, '|'); }

  scrollGroup.alignment = ["left", "top"];

  var _cont_w = scrollGroup.add('group');
  var _cont   = _cont_w.add('panel');

  _cont.add('statictext', u , amount_of_modules.text);

  var _top = _cont.add('group');
  var _middle = _cont.add('group');
  var _bottom = _cont.add('group');
  _top.alignment = ["left", "top"];
  _middle.alignment = ["left", "top"];
  _bottom.alignment = ["left", "top"];

  var button_first_side = _top.add("iconbutton", u, "Step1Icon");

  var available_files_first_side = _top.add('dropdownlist', u, opened_documents_names);
  available_files_first_side.minimumSize.width = 800;
  available_files_first_side.selection = 0;

  var button_second_side = _middle.add("iconbutton", u, "Step2Icon");

  var available_files_second_side = _middle.add('dropdownlist', u, opened_documents_names);
  available_files_second_side.minimumSize.width = 800;
  available_files_second_side.selection = 0;

  button_first_side.onClick = function () {
    var f_path_ = File.openDialog ("File 01" , '*.png; *.jpg; *.psd; *.tiff');
    if (f_path_ != null) {
      available_files_first_side.add('item', decodeURI(f_path_));
      available_files_first_side.selection = available_files_first_side.items.length-1;
    }
  }

  button_second_side.onClick = function () {
    var s_path_ = File.openDialog ("File 02" , '*.png; *.jpg; *.psd; *.tiff');
    if (s_path_ != null) {
      available_files_second_side.add('item', decodeURI(s_path_));
      available_files_second_side.selection = available_files_second_side.items.length-1;
    }
  }

  _bottom.add ('image', undefined, File (script_folder + '/icons/top.png'));
  var tt_01 = _bottom.add ('group {orientation: "column", alignChildren: ["fill", "fill"]}');
  var tt_w_01 = tt_01.add('group {orientation: "row"}');
  tt_w_01.add('statictext', u, finishings[0]);
  tt_w_01.add('statictext', u, 0);
  var tt_w_02 = tt_01.add('group {orientation: "row"}');
  tt_w_02.add('statictext', u, 'Oczka | Eyelets');
  tt_w_02.add('statictext', u, 0);
  tt_w_02.add('statictext', u, 0);
  tt_w_02.add('statictext', u, '0,0,0,0');
  this.s(_bottom);

  _bottom.add ('image', undefined, File (script_folder + '/icons/right.png'));
  this.right_code_desc = _bottom.add('statictext', u, finishings[0]);
  this.right_code_val = _bottom.add('statictext', u, 0);

  this.s(_bottom);

  _bottom.add ('image', undefined, File (script_folder + '/icons/down.png'));
  this.down_code_desc = _bottom.add('statictext', u, finishings[0]);
  this.down_code_val = _bottom.add('statictext', u, 0);

  this.s(_bottom);

  _bottom.add ('image', undefined, File (script_folder + '/icons/left.png'));
  this.left_code_desc = _bottom.add('statictext', u, finishings[0]);
  this.left_code_val = _bottom.add('statictext', u, 0);

  var set_butt = _bottom.add('button', undefined, 'Set | Ustaw');

  var outer_this = this;

  set_butt.onClick = function () {

    var PARENT_OF_THIS_BUTTON = this.parent;

    var ww = new Window('dialog {orientation: "row"}', u_window_title);
    var mm_group = ww.add('group {orientation: "column" , alignChildren: ["fill", "fill"]} ');
    var mm_group_02 = ww.add('group {orientation: "column" , alignChildren: ["fill", "fill"]} ');
    var widget_desc_eng = "All values are provided in centimiters, for decimal values, use a dot (1.2, 2.56 ...) ";
    var widget_desc_pl = "Wszystkie wartosci podane sa w centymetrach, dla wartosci dziesietnych, uzyj kropki (1.2, 2.56 ...)";
    var _descriptions = ww.add('group {orientation: "column"}, alignChildren: ["center", "center"]');
    _descriptions.alignment = ["center", "center"];

    _descriptions.add('statictext', u, widget_desc_eng, {multiline: true} );
    _descriptions.add('statictext', u, widget_desc_pl , {multiline: true} );
    _descriptions.children[0].maximumSize.width = 100;
    _descriptions.children[0].minimumSize.height = 100;
    _descriptions.children[1].maximumSize.width = 100;
    _descriptions.children[1].minimumSize.height = 100;

    var _g_t_m = _descriptions.add('group {orientation: "row"}');

    var _g_t01 = _g_t_m.add('group {orientation: "column"}');
    var _g_t02 = _g_t_m.add('group {orientation: "column"}');

    _g_t01.add('button', u , 'Load');
    _g_t01.add('button', u , 'Save');

    var _inner_accept = _g_t02.add('button', u , 'Accept');
    var _inner_cancel = _g_t02.add('button', u , 'Cancel');

    _inner_accept.onClick = function () {
      PARENT_OF_THIS_BUTTON.children[1].text = _top_inner_drop.selection.text;
      PARENT_OF_THIS_BUTTON.children[2].text = _top_inner_drop_d.text;

      PARENT_OF_THIS_BUTTON.children[5].text = _right_inner_drop.selection.text;
      PARENT_OF_THIS_BUTTON.children[6].text = _right_inner_drop_d.text;

      PARENT_OF_THIS_BUTTON.children[9].text = _down_inner_drop.selection.text;
      PARENT_OF_THIS_BUTTON.children[10].text = _down_inner_drop_d.text;

      PARENT_OF_THIS_BUTTON.children[13].text = _left_inner_drop.selection.text;
      PARENT_OF_THIS_BUTTON.children[14].text = _left_inner_drop_d.text;

      ww.close();
    }

    _inner_cancel.onClick = function () {
      ww.close();
    }

    mm_group.add ('image', undefined, File (script_folder + '/icons/top.png'));
    mm_group.add('statictext', u, 'Wykonczenie | Finishing :' );
    var _top_inner_drop = mm_group.add('dropdownlist', u, finishings );
    _top_inner_drop.selection = 0;
    mm_group.add('statictext', u, 'Wartosc | Value :' );
    var _top_inner_drop_d = mm_group.add('edittext', u, 0 );

    var mm_gr_01 = mm_group.add('group {orientation: "row"}');
    mm_gr_01.add('checkbox', u, 'Oczka | Eyelets');
    mm_gr_01.add('statictext', u, 'Odleglosc | Distance');
    mm_gr_01.add('edittext', u, 0);
    var mm_gr_02 = mm_group.add('group {orientation: "row"}');
    mm_gr_02.add('statictext', u, 'Wielkosc | Size');
    mm_gr_02.add('edittext', u, 0);
    mm_gr_02.add('statictext', u, 'CMYK');
    mm_gr_02.add('dropdownlist', u, colors);

    mm_group.add('panel');

    mm_group.add ('image', undefined, File (script_folder + '/icons/right.png'));
    mm_group.add('statictext', u, 'Wykonczenie | Finishing :' );
    var _right_inner_drop = mm_group.add('dropdownlist', u, finishings );
    _right_inner_drop.selection = 0;
    mm_group.add('statictext', u, 'Wartosc | Value :' );
    var _right_inner_drop_d = mm_group.add('edittext', u, 0 );

    mm_group_02.add ('image', undefined, File (script_folder + '/icons/down.png'));
    mm_group_02.add('statictext', u, 'Wykonczenie | Finishing :' );
    var _down_inner_drop = mm_group_02.add('dropdownlist', u, finishings );
    _down_inner_drop.selection = 0;
    mm_group_02.add('statictext', u, 'Wartosc | Value :' );
    var _down_inner_drop_d = mm_group_02.add('edittext', u, 0 );

    mm_group_02.add ('image', undefined, File (script_folder + '/icons/left.png'));
    mm_group_02.add('statictext', u, 'Wykonczenie | Finishing :' );
    var _left_inner_drop = mm_group_02.add('dropdownlist', u, finishings );
    _left_inner_drop.selection = 0;
    mm_group_02.add('statictext', u, 'Wartosc | Value :' );
    var _left_inner_drop_d = mm_group_02.add('edittext', u, 0 );

    function changer_ (_dropdown, _text) {
      if        (_dropdown.selection == 1){
        _text.text = small_weld.text;
      } else if (_dropdown.selection == 2){
        _text.text = big_weld.text;
      } else if (_dropdown.selection == 0) {
        _text.text = 0;
      }
    }

    _top_inner_drop.onChange = function () {    changer_(_top_inner_drop,_top_inner_drop_d)      }
    _right_inner_drop.onChange = function () {    changer_(_right_inner_drop,_right_inner_drop_d)  }
    _down_inner_drop.onChange = function () {    changer_(_down_inner_drop,_down_inner_drop_d)  }
    _left_inner_drop.onChange = function () {    changer_(_left_inner_drop,_left_inner_drop_d)  }

    ww.show();
  }

  scroll_offset = scrollGroup.children.length;
  scrollBar.value = 0;
}

new Module ();

W.show();

/////////////////////////////////// UI END ***********************
