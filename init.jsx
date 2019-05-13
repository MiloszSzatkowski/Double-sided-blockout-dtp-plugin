////////////////////////////////// ONLY OPERATE IN PHOTOSHOP ***********************

#target photoshop

////////////////////////////////// GLOBAL VARIABLES START ***********************

// ** UI TEXT VARIABLES

var u_window_title = 'Double-sided blockout photoshop manager';

var u = undefined;
var e = '';
var n = null;

var script_folder = new File($.fileName).parent;

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

var scrollBar = W.add ('scrollbar {stepdelta: 50}', [0, 0, 50, 500]);
var scroll_offset = 0;

scrollBar.onChanging = function () {
  for (var i = 0; i < scrollGroup.children.length; i++) {
    scrollGroup.children[i].location.y = (-1 * scroll_offset) * this.value + (235 * i);
  }
  // scrollGroup.location.y = (-1 * scroll_offset) * this.value;
}

/////////   BOTTOM CONTROL GROUP
/////////   BOTTOM CONTROL GROUP

var bottom_sub_group = bottom_group.add('group {orientation: "column"}');
var bottom_first_row = bottom_sub_group.add('group {orientation: "row", alignChildren: ["fill","fill"]}');
var bottom_second_row = bottom_sub_group.add('group {orientation: "row", alignChildren: ["fill","fill"]}');
var bottom_third_row = bottom_sub_group.add('group {orientation: "row", alignChildren: ["fill","fill"]}');

var amount_of_modules = bottom_first_row.add('panel').add('statictext', u, 1 );
amount_of_modules.minimumSize.width = 20;

var add_blockout = bottom_first_row.add('button', u, '+ blockout');

add_blockout.onClick = function () {
  amount_of_modules.text = parseFloat(amount_of_modules.text) + 1;
  var new_module = new Module ();
  updateUILayout(W);
}

var delete_blockout = bottom_first_row.add('button', u, '- blockout');

delete_blockout.onClick = function () {
  if (scrollGroup.children.length > 0) {
    amount_of_modules.text = parseFloat(amount_of_modules.text) - 1;
    scrollGroup.remove (scrollGroup.children[scrollGroup.children.length-1]);
    scrollBar.value = 0;
    updateUILayout(W);
  }
}

var close_button = bottom_first_row.add('button', u, 'close');
close_button.onClick = function () { W.close();  }

var small_weld_d = bottom_first_row.add('statictext', u, 'Small weld | Maly zgrzew:');
var small_weld = bottom_first_row.add('edittext', u, 3);
var big_weld_d = bottom_first_row.add('statictext', u, 'Big weld | Duzy zgrzew:');
var big_weld = bottom_first_row.add('edittext', u, 5);



bottom_second_row.add('checkbox', u , 'Skip errors when opening | Pomin bledy otwierania');

var help = bottom_third_row.add('button', u , 'HELP ?')

help.onClick = function () {
  h_ww = new Window('dialog {orientation: "column", alignChildren: ["fill", "top"]}', u_window_title);

  h_ww.add('statictext', u , 'HELP');

  h_ww.add('panel');

  h_ww.add("iconbutton", u, "Step1Icon");
  h_ww.add('statictext', u , 'Button for opening a file for the first side | Przycisk do wybrania pliku dla pierwszej strony');

  h_ww.add('panel');

  h_ww.add("iconbutton", u, "Step2Icon");
  h_ww.add('statictext', u , 'Button for opening a file for the second side | Przycisk do wybrania pliku dla drugiej strony');

  h_ww.add('panel');

  h_ww.add('dropdownlist', u, ['Opened Files | Otwarte pliki']).selection = 0;
  h_ww.add('statictext', u , 'Files can be either chosen from the opened ones or chosen manually');
  h_ww.add('statictext', u , 'Pliki moga byc wybrane poprzez dropdown z posrod otwartych lub wybrane manualnie');

  h_ww.add('panel');

  var t_qweasd = h_ww.add('group {orientation: "row"}');

  t_qweasd.add ('image', undefined, File (script_folder + '/icons/eyelet_icon.png'));
  t_qweasd.add('statictext', u , 'Distance | Odleglosc');
  t_qweasd.add('statictext', u , 'Size | Wielkosc');
  t_qweasd.add('statictext', u , 'Color | Kolor');

  h_ww.add('statictext', u , 'Information regarding eyelets | Informacje dotyczace oczkowania');

  h_ww.add('panel');

  var t_qwe = h_ww.add('group {orientation: "row"}');

  t_qwe.add ('image', undefined, File (script_folder + '/icons/top.png'));
  t_qwe.add ('image', undefined, File (script_folder + '/icons/right.png'));
  t_qwe.add ('image', undefined, File (script_folder + '/icons/down.png'));
  t_qwe.add ('image', undefined, File (script_folder + '/icons/left.png'));

  h_ww.add('statictext', u , 'Designated side of a blockout | Wyznaczona strona blockoutu');

  h_ww.add('panel');

  h_ww.add('button', u , 'EXIT').onClick = function () {
    h_ww.close();
  };

  h_ww.show();
}


/////////   BOTTOM CONTROL GROUP END
/////////   BOTTOM CONTROL GROUP END

//////////////////////// MODULE CONSTRUCTOR ********************************************
//////////////////////// MODULE CONSTRUCTOR ********************************************
//////////////////////// MODULE CONSTRUCTOR ********************************************

var finishings =
  ['cut | dociecie' , 'sm weld | maly zgrzew', 'xl weld | duzy zgrzew', 'sleeve | rekaw'];

var colors = [ '0,0,0,0' , '100,100,100,100', '50,50,50,50'];

var not = 'xxx';

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

  var _very_top = _cont.add('group');
  _very_top.alignment = ["left", "top"];
  _very_top.add('statictext', u , amount_of_modules.text);
  var same_image = _very_top.add('checkbox', u, 'Same image both sides | Ta sama grafika z dwoch stron');

  var _very_top_02 = _cont.add('group');
  _very_top_02.alignment = ["left", "top"];

  var save_config_d = _very_top_02.add('statictext', u, 'Save | Zapisz : ');
  var save_config_auto = _very_top_02.add('checkbox', u, 'Automatically | Automatycznie');
  var save_config_manual_dialog = _very_top_02.add('checkbox', u, 'Manual | Manualnie');
  var save_config_manual = _very_top_02.add('checkbox', u, 'To a folder :| Do folderu:');
  var manual_destination_butt = _very_top_02.add ("iconbutton", u, "DestinationFolderIcon");
  var manual_destinations = _very_top_02.add('statictext', u, '_____', { scrolling: true, multiline:true } );
  manual_destinations.minimumSize.height = 50;
  manual_destinations.minimumSize.width = 300;

  manual_destination_butt.onClick = function () {
    var outputFolder = Folder.selectDialog("Input folder");
    if (outputFolder != null) {
      manual_destinations.text = decodeURI(outputFolder);
    }
  }

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

  same_image.onClick = function () {
    if (same_image.value && (available_files_first_side.items.length > 1)
      && (available_files_first_side.selection.text !==  available_files_second_side.selection.text )) {
        available_files_second_side.add('item', available_files_first_side.selection.text);
        available_files_second_side.selection = available_files_second_side.items.length-1;
    }
  }

  button_first_side.onClick = function () {
    var f_path_ = File.openDialog ("File 01" , '*.png; *.jpg; *.psd; *.tiff');
    if (f_path_ != null) {
      available_files_first_side.add('item', decodeURI(f_path_));
      available_files_first_side.selection = available_files_first_side.items.length-1;
    }
  }

  available_files_first_side.onChange = function () {
    if (same_image.value && (available_files_first_side.items.length > 0)
  && (available_files_first_side.selection.text !==  available_files_second_side.selection.text )) {
      available_files_second_side.add('item', available_files_first_side.selection.text);
      available_files_second_side.selection = available_files_second_side.items.length-1;
    }
  }

  button_second_side.onClick = function () {
    var s_path_ = File.openDialog ("File 02" , '*.png; *.jpg; *.psd; *.tiff');
    if (s_path_ != null) {
      available_files_second_side.add('item', decodeURI(s_path_));
      available_files_second_side.selection = available_files_second_side.items.length-1;
    }
  }

  available_files_second_side.onChange = function () {
    if (same_image.value && (available_files_second_side.items.length > 0)
  && (available_files_first_side.selection.text !==  available_files_second_side.selection.text )) {
      available_files_first_side.add('item', available_files_second_side.selection.text);
      available_files_first_side.selection = available_files_first_side.items.length-1;
    }
  }

  var min_s_w = 120;
  var min_s_w_02 = 30;

  var tt_01 = [];
  var tt_w_01 = [];
  var tt_w_02 = [];

  for (var p = 0; p < 4; p++) {

    if (p===0) {
      _bottom.add ('image', undefined, File (script_folder + '/icons/top.png'));
    } else if (p===1) {
      _bottom.add ('image', undefined, File (script_folder + '/icons/right.png'));
    } else if (p===2) {
      _bottom.add ('image', undefined, File (script_folder + '/icons/left.png'));
    } else if (p===3) {
      _bottom.add ('image', undefined, File (script_folder + '/icons/down.png'));
    }

    tt_01[p] = _bottom.add ('group {orientation: "column", alignChildren: ["fill", "fill"]}');
    tt_w_01[p]  = tt_01[p] .add('group {orientation: "row"}');
    tt_w_01[p] .add('statictext', u, finishings[0]).minimumSize.width = min_s_w;
    tt_w_01[p] .add('statictext', u, 0).minimumSize.width = min_s_w_02;
    tt_w_02[p]  = tt_01[p] .add('group {orientation: "row"}');
    tt_w_02[p] .add ('image', undefined, File (script_folder + '/icons/eyelet_icon.png'));
    tt_w_02[p] .add('statictext', u, not);
    tt_w_02[p] .add('statictext', u, not);
    tt_w_02[p] .add('statictext', u, not);
  }

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

    var inner_drop = [];
    var inner_drop_d = [];
    var inner_group_eyelets = [];
    var inner_group_eyelets_02 = [];

    _inner_accept.onClick = function () {
      PARENT_OF_THIS_BUTTON.children[1].children[0].children[0].text = inner_drop[0].selection.text;
      PARENT_OF_THIS_BUTTON.children[1].children[0].children[1].text = inner_drop_d[0].text;

      PARENT_OF_THIS_BUTTON.children[3].children[0].children[0].text = inner_drop[1].selection.text;
      PARENT_OF_THIS_BUTTON.children[3].children[0].children[1].text = inner_drop_d[1].text;

      PARENT_OF_THIS_BUTTON.children[5].children[0].children[0].text = inner_drop[2].selection.text;
      PARENT_OF_THIS_BUTTON.children[5].children[0].children[1].text = inner_drop_d[2].text;

      PARENT_OF_THIS_BUTTON.children[7].children[0].children[0].text = inner_drop[3].selection.text;
      PARENT_OF_THIS_BUTTON.children[7].children[0].children[1].text = inner_drop_d[3].text;

      ww.close();
    }

    _inner_cancel.onClick = function () {
      ww.close();
    }

    function changer_ (_dropdown, _text) {
      if        (_dropdown.selection == 1){
        _text.text = small_weld.text;
      } else if (_dropdown.selection == 2){
        _text.text = big_weld.text;
      } else if (_dropdown.selection == 0) {
        _text.text = 0;
      }
    }

    for (var j = 0; j < 4; j++) {

      var group_to_add;

      if (j===0) {
        group_to_add = mm_group;
        group_to_add.add ('image', undefined, File (script_folder + '/icons/top.png'));
      } else if (j===1) {
        group_to_add.add ('image', undefined, File (script_folder + '/icons/right.png'));
      } else if (j===2) {
        group_to_add = mm_group_02;
        group_to_add.add ('image', undefined, File (script_folder + '/icons/left.png'));
      } else if (j===3) {
        group_to_add.add ('image', undefined, File (script_folder + '/icons/down.png'));
      }

      group_to_add.add('statictext', u, 'Wykonczenie | Finishing :' );

      inner_drop[j] = group_to_add.add ('dropdownlist', u, finishings );
      inner_drop[j].selection = 0;

      group_to_add.add('statictext', u, 'Wartosc | Value :' );
      inner_drop_d[j] = group_to_add.add('edittext', u, 0 );

      inner_drop[j].onChange = function () {    changer_(inner_drop[j],inner_drop_d[j])      }

      inner_group_eyelets[j] = group_to_add.add('group {orientation: "row"}');
      inner_group_eyelets[j].add('checkbox', u, 'Oczka | Eyelets');
      inner_group_eyelets[j].add('statictext', u, 'Odleglosc | Distance');
      inner_group_eyelets[j].add('edittext', u, 0);
      inner_group_eyelets_02[j] = group_to_add.add('group {orientation: "row"}');
      inner_group_eyelets_02[j].add('statictext', u, 'Wielkosc | Size');
      inner_group_eyelets_02[j].add('edittext', u, 0);
      inner_group_eyelets_02[j].add('statictext', u, 'CMYK');
      inner_group_eyelets_02[j].add('dropdownlist', u, colors);

      group_to_add.add('panel');

    }

    ww.show();
  }

  scroll_offset = scrollGroup.children.length*3;
  scrollBar.value = 0;
}

new Module ();

W.show();

/////////////////////////////////// UI END ***********************
