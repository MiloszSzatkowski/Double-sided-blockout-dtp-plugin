////////////////////////////////// INCLUDE LIBRARIES ***********************

// #include json2.js
#target photoshop
// alert(app.name + " " + app.version);
// var t_v = parseFloat(app.version.toString().split('.')[0]);
// var version = t_v;
// alert(app.version);


//json polyfill
function convertToText(obj) {
    var str = '';
    str = str + ' {   "all":['; //start

    for (var i = 0; i < obj.all.length; i++) {

      str = str + '{';
      str = str + '"name":' + '"' +  obj.all[i].name.toString() + '"' + ',\n';
      str = str + '"sides":[\n';

      for (var j = 0; j < obj.all[i].sides.length; j++) {

        str = str + '{';
        str = str +
           '"finishing_type" :' + '"' +   obj.all[i].sides[j].finishing_type.toString() +  '"' +   " ,  \n" +
           '"finishing_value" :' + '"' +  obj.all[i].sides[j].finishing_value.toString() + '"' +   " ,  \n" +
           '"eyelets_bool" :' +   obj.all[i].sides[j].eyelets_bool + " ,  \n" +
           '"eyelets_distance" :' + '"' +  obj.all[i].sides[j].eyelets_distance.toString() + '"' +   " ,  \n" +
           '"eyelets_size" :' + '"' +  obj.all[i].sides[j].eyelets_size.toString() +  '"' +  " ,  \n" +
           '"eyelets_cmyk" :' + '"' +  obj.all[i].sides[j].eyelets_cmyk.toString() + '"' +   " ,  \n" +
           '"eyelets_outline_bool" :' +  obj.all[i].sides[j].eyelets_outline_bool
        ;
        str = str + '}';

        if (j !== obj.all[i].sides.length-1) {
          str = str + " , \n ";
        }

      }

      str = str + ']\n';

      str = str + '}';

      if (i !== obj.all.length-1) {
        str = str + ' , \n ';
      }
    }

    str = str + ' ]  } '; //finish
    return str;
}


////////////////////////////////// ONLY OPERATE IN PHOTOSHOP ***********************

#include _eyelets\Algorithm_abstracted.jsx

////////////////////////////////// GLOBAL VARIABLES START ***********************

//test json lib import
// alert(JSON.parse('{"a":1}').a);

// ** UI TEXT VARIABLES

var u_window_title = 'Double-sided blockout photoshop manager';

var u = undefined;
var e = '';
var n = null;

var script_folder = new File($.fileName).parent;

//load eyelet size
var b = new File((new File($.fileName)).parent + "/_eyelets/Config/eyesize.txt");

b.open('r');
var eyesize_UI = "";
while (!b.eof)
  eyesize_UI += b.readln();
b.close();
eyesize_UI = parseFloat(eyesize_UI);

////////////////////////////////// GLOBAL VARIABLES END ***********************

/////////////////////////////////// UI START ***********************

function updateUILayout(el) {
  el.layout.layout(true);
}

// ////////////////////  WINDOW

var W = new Window('dialog {orientation: "row"}', u_window_title);
W.maximumSize.width = 1310; //1290 old val
W.maximumSize.height = 750;

W.minimumSize.width = W.maximumSize.width - 10;
W.minimumSize.height = W.maximumSize.height - 10;

var scrollBar = W.add('scrollbar {alignment: "top"}', [
  0, 0, 40, 200
], 0, 0, 50);
scrollBar.stepdelta = 1.01;

var main_group = W.add('group {orientation: "row", alignChildren: ["fill","fill"]}');

var top_group = main_group.add('group');
main_group.add('panel');
var bottom_group = main_group.add('group {orientation: "column", alignChildren: ["fill","fill"]}');

/////////   MODULES CONTAINER
var modules_container = top_group.add('group {orientation: "row"}, alignChildren: ["left","top"]', u, e);

modules_container.minimumSize.height = W.maximumSize.height - 30;
modules_container.minimumSize.width = W.maximumSize.width - 290;
modules_container.maximumSize.height = modules_container.minimumSize.height;

var scrollGroup = modules_container.add('group {orientation: "column"}, alignChildren: ["fill","fill"]', u, e)

var scroll_offset = 0;

scrollBar.onChanging = function() {
  for (var i = 0; i < scrollGroup.children.length; i++) {
    scrollGroup.children[i].location.y = Math.round(((-1 * scroll_offset) * this.value + (280 * i) / 20) * 20);
  }
  // scrollGroup.location.y = (-1 * scroll_offset) * this.value;
}

/////////   BOTTOM CONTROL GROUP
/////////   BOTTOM CONTROL GROUP

var bottom_sub_group = bottom_group.add('group {orientation: "column"}');
var bottom_first_row = bottom_sub_group.add('group {orientation: "column", alignChildren: ["fill","fill"]}');
var bottom_second_row = bottom_sub_group.add('group {orientation: "column", alignChildren: ["fill","fill"]}');
var bottom_third_row = bottom_sub_group.add('group {orientation: "column", alignChildren: ["fill","fill"]}');

var amount_of_modules = bottom_first_row.add('panel').add('statictext', u, 1);
amount_of_modules.minimumSize.width = 10;
amount_of_modules.minimumSize.height = 5;

var add_blockout = bottom_first_row.add('button', u, '+ blockout');

add_blockout.onClick = function() {
  if (parseFloat(amount_of_modules.text) > 11) {
    alert('Twoj komputer moze nie miec wystarczajec pamieci do przetworzenia ponad 12 modulow' + ' \nKontynuujesz na wlasna odpowiedzialnosc' + ' \n\n\nYour computer may not have sufficient memory to proccess more than 12 modules \nProceed at your own risk ');
  }
  amount_of_modules.text = parseFloat(amount_of_modules.text) + 1;
  var new_module = new Module();
  updateUILayout(W);
}

var delete_blockout = bottom_first_row.add('button', u, '- blockout');

delete_blockout.onClick = function() {
  if (scrollGroup.children.length > 0) {
    amount_of_modules.text = parseFloat(amount_of_modules.text) - 1;
    scrollGroup.remove(scrollGroup.children[scrollGroup.children.length - 1]);
    scrollBar.value = 0;
    updateUILayout(W);
  }
}

var accept_button = bottom_first_row.add('button', u, 'GO');

accept_button.onClick = function() {
  prepare_data_before_execution();
}

var close_button = bottom_first_row.add('button', u, 'close');
close_button.onClick = function() {
  W.close();
}

var small_weld_d = bottom_first_row.add('statictext', u, 'Small weld\nMaly zgrzew:', {multiline: true});
var small_weld = bottom_first_row.add('edittext', u, 3);
var big_weld_d = bottom_first_row.add('statictext', u, 'Big weld\nDuzy zgrzew:', {multiline: true});
var big_weld = bottom_first_row.add('edittext', u, 5);
var treshold_weld_d = bottom_first_row.add('statictext', u, 'Weld treshold\nProg zgrzewu:', {multiline: true});
var treshold_weld = bottom_first_row.add('edittext', u, 7.0);
var s_fr_size_UI_d = bottom_first_row.add('statictext', u, 'Thin outline\nCienka linia:', {multiline: true});
var s_fr_size_UI = bottom_first_row.add('edittext', u, 0.02);
var xl_fr_size_UI_d = bottom_first_row.add('statictext', u, 'Big outline\nGruba linia:', {multiline: true});
var xl_fr_size_UI = bottom_first_row.add('edittext', u, 0.1);
var offset_UI_d = bottom_first_row.add('statictext', u, 'Offset:', {multiline: true});
var offset_UI = bottom_first_row.add('edittext', u, 1);
var weld_overlap_UI_d = bottom_first_row.add('statictext', u, 'Inner offset\nOffset w srodku:', {multiline: true});
var weld_overlap_UI = bottom_first_row.add('edittext', u, 0.5);
var blocks_UI = bottom_first_row.add('checkbox', u, 'Blocks | Bloki');
blocks_UI.value = false;
var preview_UI = bottom_first_row.add('checkbox', u, 'Prev | Podglad');
preview_UI.value = true;

var help = bottom_third_row.add('button', u, 'HELP ?');

help.onClick = function() {
  h_ww = new Window('dialog {orientation: "column", alignChildren: ["fill", "top"]}', u_window_title);

  h_ww.add('statictext', u, 'HELP');

  h_ww.add('panel');

  h_ww.add("iconbutton", u, "Step1Icon");
  h_ww.add('statictext', u, 'Button for opening a file for the first side | Przycisk do wybrania pliku dla pierwszej strony');

  h_ww.add('panel');

  h_ww.add("iconbutton", u, "Step2Icon");
  h_ww.add('statictext', u, 'Button for opening a file for the second side | Przycisk do wybrania pliku dla drugiej strony');

  h_ww.add('panel');

  h_ww.add('dropdownlist', u, ['Opened Files | Otwarte pliki']).selection = 0;
  h_ww.add('statictext', u, 'Files can be either chosen from the opened ones or chosen manually');
  h_ww.add('statictext', u, 'Pliki moga byc wybrane poprzez dropdown z posrod otwartych lub wybrane manualnie');

  h_ww.add('panel');

  var t_qweasd = h_ww.add('group {orientation: "row"}');

  t_qweasd.add('image', undefined, File(script_folder + '/icons/eyelet_icon.png'));
  t_qweasd.add('statictext', u, 'Distance | Odleglosc');
  t_qweasd.add('statictext', u, 'Size | Wielkosc');
  t_qweasd.add('statictext', u, 'Color | Kolor');

  h_ww.add('statictext', u, 'Information regarding eyelets | Informacje dotyczace oczkowania');

  h_ww.add('panel');

  var t_qwe = h_ww.add('group {orientation: "row"}');

  t_qwe.add('image', undefined, File(script_folder + '/icons/top.png'));
  t_qwe.add('image', undefined, File(script_folder + '/icons/right.png'));
  t_qwe.add('image', undefined, File(script_folder + '/icons/down.png'));
  t_qwe.add('image', undefined, File(script_folder + '/icons/left.png'));

  h_ww.add('statictext', u, 'Designated side of a blockout | Wyznaczona strona blockoutu');

  h_ww.add('panel');

  h_ww.add('button', u, 'EXIT').onClick = function() {
    h_ww.close();
  };

  h_ww.show();
}

/////////   BOTTOM CONTROL GROUP END
/////////   BOTTOM CONTROL GROUP END

//////////////////////// MODULE CONSTRUCTOR ********************************************
//////////////////////// MODULE CONSTRUCTOR ********************************************
//////////////////////// MODULE CONSTRUCTOR ********************************************

var finishings = ['cut | dociecie', 'sm weld | maly zgrzew', 'xl weld | duzy zgrzew', 'sleeve | rekaw'];

var colors = ['0,0,0,0', '100,100,100,100', '50,50,50,50'];

var not = 'xxx';
var bigger_not = 'xxxxxxxx';
var tick = 'o'

var opened_documents_names = [' '];

try {
  if (app.documents.length !== 0) {
    for (var i = 0; i < app.documents.length; i++) {
      opened_documents_names.push(app.documents[i].name);
    }
  }
} catch (e) {}

function Module() {

  this.s = function(t) {
    t.add('statictext', u, '|');
  }

  scrollGroup.alignment = ["left", "top"];

  var _cont_w = scrollGroup.add('group');
  var _cont = _cont_w.add('panel');

  var _very_top = _cont.add('group');
  _very_top.alignment = ["left", "top"];
  _very_top.add('statictext', u, amount_of_modules.text);
  var same_image = _very_top.add('checkbox', u, 'Same image both sides | Ta sama grafika z dwoch stron');

  var _very_top_02 = _cont.add('group');
  _very_top_02.alignment = ["left", "top"];

  var folder_ch_desc = 'To a folder :| Do folderu:';

  var save_config_d = _very_top_02.add('statictext', u, 'Save | Zapisz : ');
  var save_config_auto = _very_top_02.add('checkbox', u, 'Automatically | Automatycznie');
  save_config_auto.value = true;
  var save_config_manual_dialog = _very_top_02.add('checkbox', u, 'Manual | Manualnie');
  var save_config_manual = _very_top_02.add('checkbox', u, folder_ch_desc);
  var manual_destination_butt = _very_top_02.add("iconbutton", u, "DestinationFolderIcon");
  var manual_destinations = _very_top_02.add('statictext', u, '_____', {
    scrolling: true,
    multiline: true
  });
  manual_destinations.minimumSize.height = 50;
  manual_destinations.minimumSize.width = 300;

  manual_destination_butt.onClick = function() {
    pick_output_folder_module_void()
  }

  function pick_output_folder_module_void() {
    var outputFolder = Folder.selectDialog("Input folder");
    if (outputFolder != null) {
      manual_destinations.text = decodeURI(outputFolder);
    }
  }

  var elim_arr = [save_config_auto, save_config_manual_dialog, save_config_manual];
  for (var i = 0; i < elim_arr.length; i++) {
    elim_arr[i].onClick = function() {
      var checkbox_this = this;
      toggle_checkbox_values(checkbox_this)
    }
  }

  function toggle_checkbox_values(checkbox_this) {
    if (checkbox_this.value) {
      if ((checkbox_this.text == folder_ch_desc) && (manual_destinations.text.indexOf('/') === -1)) {
        pick_output_folder_module_void()
      }
      for (var i = 0; i < elim_arr.length; i++) {
        if (checkbox_this != elim_arr[i]) {
          elim_arr[i].value = false;
        }
      }
    }
  }

  var _top = _cont.add('group');
  var _middle = _cont.add('group');
  var _bottom = _cont.add('group');
  _top.alignment = ["left", "top"];
  _middle.alignment = ["left", "top"];
  _bottom.alignment = ["left", "top"];

  function check_for_val_in_drop_pick_the_same_outer(dropdown, val) {
    for (var i = 0; i < dropdown.items.length; i++) {
      if (dropdown.items[i].text == val) {
        dropdown.selection = i;
        break;
      }
    }
    return;
  }

  function check_for_val_in_drop_bool(dropdown, val) {
    for (var i = 0; i < dropdown.items.length; i++) {
      if (dropdown.items[i].text == val) {
        return true;
      }
    }
    return false;
  }

  var button_first_side = _top.add("iconbutton", u, "Step1Icon");

  var available_files_first_side = _top.add('dropdownlist', u, opened_documents_names);
  available_files_first_side.minimumSize.width = 800;
  available_files_first_side.minimumSize.height = 30;

  available_files_first_side.selection = 0;

  var button_second_side = _middle.add("iconbutton", u, "Step2Icon");

  var available_files_second_side = _middle.add('dropdownlist', u, opened_documents_names);
  available_files_second_side.minimumSize.width = 800;
  available_files_second_side.minimumSize.height = 30;

  available_files_second_side.selection = 0;

  same_image.onClick = function() {
    if (same_image.value && (available_files_first_side.items.length > 1) && (available_files_first_side.selection.text !== available_files_second_side.selection.text)) {
      if (check_for_val_in_drop_bool(available_files_second_side, available_files_first_side.selection.text)) {
        check_for_val_in_drop_pick_the_same_outer(available_files_second_side, available_files_first_side.selection.text)
      } else {
        available_files_second_side.add('item', available_files_first_side.selection.text);
        available_files_second_side.selection = available_files_second_side.items.length - 1;
      }
    }
  }

  button_first_side.onClick = function() {
    var f_path_ = File.openDialog("File 01", '*.png; *.jpg; *.psd; *.tiff');
    if (f_path_ != null) {
      available_files_first_side.add('item', decodeURI(f_path_));
      available_files_first_side.selection = available_files_first_side.items.length - 1;
    }
  }

  available_files_first_side.onChange = function() {
    if (same_image.value && (available_files_first_side.items.length > 0) && (available_files_first_side.selection.text !== available_files_second_side.selection.text)) {
      if (check_for_val_in_drop_bool(available_files_second_side, available_files_first_side.selection.text)) {
        check_for_val_in_drop_pick_the_same_outer(available_files_second_side, available_files_first_side.selection.text)
      } else {
        available_files_second_side.add('item', available_files_first_side.selection.text);
        available_files_second_side.selection = available_files_second_side.items.length - 1;
      }
    }
  }

  button_second_side.onClick = function() {
    var s_path_ = File.openDialog("File 02", '*.png; *.jpg; *.psd; *.tiff');
    if (s_path_ != null) {
      available_files_second_side.add('item', decodeURI(s_path_));
      available_files_second_side.selection = available_files_second_side.items.length - 1;
    }
  }

  available_files_second_side.onChange = function() {
    if (same_image.value && (available_files_second_side.items.length > 0) && (available_files_first_side.selection.text !== available_files_second_side.selection.text)) {
      if (check_for_val_in_drop_bool(available_files_first_side, available_files_second_side.selection.text)) {
        check_for_val_in_drop_pick_the_same_outer(available_files_first_side, available_files_second_side.selection.text)
      } else {
        available_files_first_side.add('item', available_files_second_side.selection.text);
        available_files_first_side.selection = available_files_first_side.items.length - 1;
      }

    }
  }

  var min_s_w = 120;
  var min_s_w_02 = 30;

  var tt_01 = [];
  var tt_w_01 = [];
  var tt_w_02 = [];

  for (var p = 0; p < 4; p++) {

    if (p === 0) {
      _bottom.add('image', undefined, File(script_folder + '/icons/top.png'));
    } else if (p === 1) {
      _bottom.add('image', undefined, File(script_folder + '/icons/right.png'));
    } else if (p === 2) {
      _bottom.add('image', undefined, File(script_folder + '/icons/left.png'));
    } else if (p === 3) {
      _bottom.add('image', undefined, File(script_folder + '/icons/down.png'));
    }

    tt_01[p] = _bottom.add('group {orientation: "column", alignChildren: ["fill", "fill"]}');
    tt_w_01[p] = tt_01[p].add('group {orientation: "row"}');
    tt_w_01[p].add('statictext', u, finishings[0]).minimumSize.width = min_s_w;
    tt_w_01[p].add('statictext', u, 0).minimumSize.width = min_s_w_02;
    tt_w_02[p] = tt_01[p].add('group {orientation: "row"}');
    tt_w_02[p].add('image', undefined, File(script_folder + '/icons/eyelet_icon.png'));
    tt_w_02[p].add('statictext', u, not);
    tt_w_02[p].add('statictext', u, not);
    tt_w_02[p].add('statictext', u, bigger_not);
    tt_w_02[p].add('statictext', u, not);
  }

  var set_g = _bottom.add('group {orientation: "column", alignChildren: "fill"}');
  var set_butt = set_g.add('button', undefined, 'Set | Ustaw');
  var set_butt_desc = set_g.add('statictext', undefined, 'Fabryczne - Default');

  var outer_this = this;

  set_butt.onClick = function() {

    var MODIFIED = false;

    var PARENT_OF_THIS_BUTTON = this.parent.parent;

    var ww = new Window('dialog {orientation: "row"}', u_window_title);
    var mm_group = ww.add('group {orientation: "column" , alignChildren: ["fill", "fill"]} ');
    var mm_group_02 = ww.add('group {orientation: "column" , alignChildren: ["fill", "fill"]} ');

    var widget_desc_eng = "All values are provided in centimiters, for decimal values, use a dot (1.2, 2.56 ...) ";
    var widget_desc_pl = "Wszystkie wartosci podane sa w centymetrach, dla wartosci dziesietnych, uzyj kropki (1.2, 2.56 ...)";
    var _descriptions = ww.add('group {orientation: "column"}, alignChildren: ["fill", "fill"]');
    _descriptions.alignment = ["center", "center"];

    _descriptions.add('statictext', u, widget_desc_eng, {
      multiline: true
    });
    _descriptions.add('statictext', u, widget_desc_pl, {
      multiline: true
    });

    _descriptions.add('panel {alignment: "fill"}');

    var _g_t_m = _descriptions.add('group {orientation: "row", alignChildren: ["fill", "fill"]}');

    var _g_t01 = _g_t_m.add('group {orientation: "column", alignChildren: ["fill", "fill"]}');
    var _g_t02 = _g_t_m.add('group {orientation: "column", alignChildren: ["fill", "fill"]}');

    var config_file_json = load_json_config();

    var name_list_of_configs = [];

    for (var i = 0; i < config_file_json.all.length; i++) {
      name_list_of_configs.push(config_file_json.all[i].name)
    }

    _g_t01.add('statictext', u, 'USTAWIENIA | CONFIGURATIONS');
    _g_t01.add('statictext', u, 'Wczytaj | Load :');

    var load_config_drop = _g_t01.add('dropdownlist', u, name_list_of_configs);
    load_config_drop.selection = 0;

    function update_list_of_configs(job, item) {
      if (job == 'add') {
        load_config_drop.add('item', item);
        load_config_drop.selection = load_config_drop.items.length - 1;
      } else if (job == 'delete') {
        for (var i = 0; i < load_config_drop.items.length; i++) {
          if (load_config_drop.items[i].text == item) {
            // load_config_drop.items[i].text = '';
            load_config_drop.remove(load_config_drop.items[i])
          }
        }
        load_config_drop.selection = 0;
      } else if (job == 'overwrite') {}
    }

    load_config_drop.onChange = function() {
      update_configuration_front_end();
    }

    function update_configuration_front_end() {
      var _index_of_chosen_config = load_config_drop.selection.index;

      for (var s = 0; s < 4; s++) {
        check_for_val_in_drop_pick_the_same(inner_drop[s], config_file_json.all[_index_of_chosen_config].sides[s].finishing_type);
        inner_drop_d[s].text = config_file_json.all[_index_of_chosen_config].sides[s].finishing_value;

        if (config_file_json.all[_index_of_chosen_config].sides[s].eyelets_bool) {
          inner_group_eyelets[s].children[0].value = config_file_json.all[_index_of_chosen_config].sides[s].eyelets_bool;
          inner_group_eyelets[s].children[2].text = config_file_json.all[_index_of_chosen_config].sides[s].eyelets_distance;
          inner_group_eyelets_02[s].children[1].text = config_file_json.all[_index_of_chosen_config].sides[s].eyelets_size;
          check_for_val_in_drop_pick_the_same(inner_group_eyelets_02[s].children[3], config_file_json.all[_index_of_chosen_config].sides[s].eyelets_cmyk);

          inner_group_eyelets_02[s].children[4].value = config_file_json.all[_index_of_chosen_config].sides[s].eyelets_outline_bool;

        } else {
          inner_group_eyelets[s].children[0].value = false;
          inner_group_eyelets[s].children[2].text = 0;
          inner_group_eyelets_02[s].children[1].text = 0;
          inner_group_eyelets_02[s].children[3].selection = 0;
          inner_group_eyelets_02[s].children[4].value = false;
        }
      }

    }

    var button_create_new_config = _g_t01.add('button', u, 'Zapisz nowe | Save new');

    button_create_new_config.onClick = function() {
      save_or_overwrite_configuration('save_new');
    }

    function save_or_overwrite_configuration(job, inform) {
      if (inform == undefined || inform == null) {
        inform = true;
      }
      var user_name;
      if (job == 'save_new') {
        user_name = prompt('Wybierz nazwe nowych ustawien | Choose name for the new settings', '');
      } else if (job == 'overwrite') {
        user_name = load_config_drop.selection.text;
      } else if (job == 'create_custom') {
        user_name = 'Temporary nr ' + new Date().toString();
      }
      if ((user_name != null) && (user_name != 'Fabryczne - Default')) {
        if (job == 'overwrite') {
          delete_configuration();
        }
        config_file_json.all.push({
          "name": user_name,
          "sides": []
        });
        for (var s = 0; s < 4; s++) {
          config_file_json.all[config_file_json.all.length - 1].sides.push({
            "finishing_type": inner_drop[s].selection.text,
            "finishing_value": inner_drop_d[s].text,
            "eyelets_bool": inner_group_eyelets[s].children[0].value,
            "eyelets_distance": inner_group_eyelets[s].children[2].text,
            "eyelets_size": inner_group_eyelets_02[s].children[1].text,
            "eyelets_cmyk": inner_group_eyelets_02[s].children[3].selection.text,
            "eyelets_outline_bool": inner_group_eyelets_02[s].children[4].value
          })
        }
        // var parsed_to_json_from_js_object = config_file_json.toString();
        var parsed_to_json_from_js_object = config_file_json;
        // var parsed_to_json_from_js_object = JSON.stringify(config_file_json);
        save_config_json(parsed_to_json_from_js_object);
        config_file_json = load_json_config();

        var dev = false;
        var dat = '';
        if (dev == true) {
          // dat = JSON.stringify(config_file_json.all[load_config_drop.selection.index]).replace(/[.{}]/g, ' ').replace(/,"/g, '\n')
        }

        if (job == 'save_new') {
          update_list_of_configs('add', user_name);
          if (inform) {
            alert(user_name + '\nzapisany\n' + user_name + '\nhas been saved!\n\n' + dat);
          }
        } else if (job == 'overwrite') {
          update_configuration_front_end();
          if (inform) {
            alert(user_name + '\nnadpisany\n' + user_name + '\noverwritten!\n\n' + dat);
          }
        } else if (job == 'create_custom') {
          update_list_of_configs('add', user_name);
        }

      } else if (user_name == null) {
        alert('Nie wybrano nazwy | The name has not been chosen');
      } else if (user_name == 'Fabryczne - Default') {
        alert('Nie mozna nadpisac ustawien fabrycznych | Default settings cannot be overwritten.');
      }
    }

    function load_json_config() {
      var FILE = new File((new File($.fileName)).parent + '/finish_configs/config.json');
      FILE.open("r");
      var json_unparsed = '';
      while (!FILE.eof)
        json_unparsed += FILE.readln();
      // json_parsed = JSON.parse(json_unparsed);
      var json_parsed =  eval("(" + json_unparsed + ")");
      FILE.close();
      return json_parsed;
    }

    function save_config_json(jsn) {
      jsn = convertToText(jsn);
      // alert(jsn);
      var FILE = new File((new File($.fileName)).parent + '/finish_configs/config.json');
      FILE.open("w");
      FILE.writeln('');
      FILE.close();

      FILE.open("e", "TEXT");
      FILE.writeln(jsn);
      FILE.close();
    }

    var button_create_overwrite_config = _g_t01.add('button', u, 'Nadpisz | Overwrite');

    button_create_overwrite_config.onClick = function() {
      save_or_overwrite_configuration('overwrite');
    }

    var button_delete_config = _g_t01.add('button', u, 'Usun | Delete');

    button_delete_config.onClick = function() {
      var deleted_tag_text = load_config_drop.selection.text;
      delete_configuration();
      if (load_config_drop.selection.text != 'Fabryczne - Default') {
        update_list_of_configs('delete', load_config_drop.selection.text);
        config_file_json = load_json_config();
        alert(deleted_tag_text + '\nusuniety\n' + deleted_tag_text + '\ndeleted!\n\n');
      }
    }

    function delete_configuration() {
      for (var i = 0; i < config_file_json.all.length; i++) {
        if (config_file_json.all[i].name == load_config_drop.selection.text) {
          if (config_file_json.all[i].name == 'Fabryczne - Default') {
            alert('Nie mozna usunac ustawien fabrycznych | Default settings cannot be deleted.');
            return;
            break;
          } else {
            config_file_json.all.splice(i, 1);
            var parsed_to_json_from_js_object = config_file_json;
            // var parsed_to_json_from_js_object = JSON.stringify(config_file_json);
            save_config_json(parsed_to_json_from_js_object);
            break;
          }
        }
      }
    }

    var _inner_accept = _g_t02.add('button', u, 'Accept');
    var _inner_cancel = _g_t02.add('button', u, 'Cancel');

    var inner_drop = [];
    var inner_drop_d = [];
    var inner_index = [];
    var inner_group_eyelets = [];
    var inner_group_eyelets_02 = [];

    _inner_cancel.onClick = function() {
      ww.close();
    }

    for (var j = 0; j < 4; j++) {

      var group_to_add;

      if (j === 0) {
        group_to_add = mm_group.add('group {orientation: "column", alignChildren: "fill"}');
        group_to_add.add('image', undefined, File(script_folder + '/icons/top.png'));
      } else if (j === 1) {
        group_to_add = mm_group.add('group {orientation: "column", alignChildren: "fill"}');
        group_to_add.add('image', undefined, File(script_folder + '/icons/right.png'));
      } else if (j === 2) {
        group_to_add = mm_group_02.add('group {orientation: "column", alignChildren: "fill"}');
        group_to_add.add('image', undefined, File(script_folder + '/icons/left.png'));
      } else if (j === 3) {
        group_to_add = mm_group_02.add('group {orientation: "column", alignChildren: "fill"}');
        group_to_add.add('image', undefined, File(script_folder + '/icons/down.png'));
      }

      group_to_add.add('statictext', u, 'Wykonczenie | Finishing :');

      inner_drop[j] = group_to_add.add('dropdownlist', u, finishings)

      inner_drop[j].onChange = function() {
        var that_ = this;
        if (this.selection == 1) {
          that_.parent.children[4].text = small_weld.text;
        } else if (this.selection == 2) {
          that_.parent.children[4].text = big_weld.text;
        } else if (this.selection == 0) {
          that_.parent.children[4].text = 0;
        } else {
          that_.parent.children[4].text = 0;
        }
      };

      group_to_add.add('statictext', u, 'Wartosc | Value :');

      inner_drop_d[j] = group_to_add.add('edittext', u, 0);

      inner_drop[j].selection = 0;

      inner_group_eyelets[j] = group_to_add.add('group {orientation: "row"}');

      inner_group_eyelets[j].add('checkbox', u, 'Oczka | Eyelets').onClick = function() {
        if (this.value) {
          // distance
          this.parent.children[2].text = 50;
          // size
          this.parent.parent.children[6].children[1].text = eyesize_UI;
          // color
          this.parent.parent.children[6].children[3].selection = 0;
          // outline
          this.parent.parent.children[6].children[4].value = true;
        } else {
          this.parent.children[2].text = 0;
          this.parent.parent.children[6].children[1].text = 0;
          this.parent.parent.children[6].children[3].selection = 0;
          this.parent.parent.children[6].children[4].value = false;
        }
      };

      inner_group_eyelets[j].add('statictext', u, 'Odleglosc | Distance');
      inner_group_eyelets[j].add('edittext', u, 0).minimumSize.width = 30;
      inner_group_eyelets_02[j] = group_to_add.add('group {orientation: "row"}');
      inner_group_eyelets_02[j].add('statictext', u, 'Wielk. | Size');
      inner_group_eyelets_02[j].add('edittext', u, 0).minimumSize.width = 30;
      inner_group_eyelets_02[j].add('statictext', u, 'CMYK');
      inner_group_eyelets_02[j].add('dropdownlist', u, colors).selection = 0;
      inner_group_eyelets_02[j].add('checkbox', u, 'Obrys | outline');

      group_to_add.add('panel');

    }

    function check_for_val_in_drop_pick_the_same(dropdown, val) {
      for (var i = 0; i < dropdown.items.length; i++) {
        if (dropdown.items[i].text == val) {
          dropdown.selection = i;
          break;
        }
      }
      return;
    }

    //prepare box with initial values
    sp_ind = [1, 3, 5, 7]

    check_for_val_in_drop_pick_the_same(load_config_drop, PARENT_OF_THIS_BUTTON.children[8].children[1].text);

    for (var s = 0; s < 4; s++) {
      var _sp_ind_inner = sp_ind[s];

      check_for_val_in_drop_pick_the_same(inner_drop[s], PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[0].children[0].text);

      inner_drop_d[s].text = PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[0].children[1].text;

      if ((PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[1].text != not) && (PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[2].text != not) && (PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[3].text != bigger_not)) {

        inner_group_eyelets[s].children[0].value = true;

        inner_group_eyelets[s].children[2].text = PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[1].text;
        inner_group_eyelets_02[s].children[1].text = PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[2].text;

        check_for_val_in_drop_pick_the_same(inner_group_eyelets_02[s].children[3], PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[3].text);

        if (PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[4].text == tick) {
          inner_group_eyelets_02[s].children[4].value = true;
        }

      }
    }

    _inner_accept.onClick = function() {
      if (load_config_drop.selection.text != 'Fabryczne - Default') {
        if (load_config_drop.selection.text.indexOf('Temporary') !== -1) {
          save_or_overwrite_configuration('overwrite', false);
        }
        PARENT_OF_THIS_BUTTON.children[8].children[1].text = load_config_drop.selection.text;
      } else if (load_config_drop.selection.text == 'Fabryczne - Default') {
        save_or_overwrite_configuration('create_custom', false);
        PARENT_OF_THIS_BUTTON.children[8].children[1].text = load_config_drop.selection.text;
      }
      for (var s = 0; s < 4; s++) {
        var _sp_ind_inner = sp_ind[s];
        PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[0].children[0].text = inner_drop[s].selection.text;
        PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[0].children[1].text = inner_drop_d[s].text;

        if (inner_group_eyelets[s].children[0].value) {
          PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[1].text = inner_group_eyelets[s].children[2].text;
          PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[2].text = inner_group_eyelets_02[s].children[1].text;
          PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[3].text = inner_group_eyelets_02[s].children[3].selection.text;
          if (inner_group_eyelets_02[s].children[4].value) {
            PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[4].text = tick;
          } else {
            PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[4].text = not;
          }
        } else {
          PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[1].text = not;
          PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[2].text = not;
          PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[3].text = bigger_not;
          PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[4].text = not;
        }
      }
      ww.close();
    }

    ww.show();
  }

  scroll_offset = Math.ceil(scrollGroup.children.length / 8);
  scrollBar.value = 0;
}

new Module();

W.show();

/////////////////////////////////// UI END ***********************

// ACTIONS AFTER UI IS CLOSED

delete_temporary_configurations();
delete_temporary_configurations();

function delete_temporary_configurations() {
  var FILE = new File((new File($.fileName)).parent + '/finish_configs/config.json');
  FILE.open("r");
  var json_unparsed = '';
  while (!FILE.eof)
    json_unparsed += FILE.readln();
  var json_parsed =  eval("(" + json_unparsed + ")");
  // var json_parsed = JSON.parse(json_unparsed);
  FILE.close();

  var at_least_one = false;

  amount_of_t = 0;

  for (var i = 0; i < json_parsed.all.length; i++) {
    if (json_parsed.all[i].name.indexOf('Temporary') !== -1) {
      at_least_one = true;
      amount_of_t++;
      json_parsed.all.splice(i, 1);
    }
  }

  if (at_least_one) {
    jsn = convertToText(json_parsed);
    // jsn = JSON.stringify(json_parsed);

    FILE.open("w");
    FILE.writeln('');
    FILE.close();

    FILE.open("e", "TEXT");
    FILE.writeln(jsn);
    FILE.close();

  }

}

function prepare_data_before_execution() {

  var passed_config_obj = []
  for (var i = 0; i < scrollGroup.children.length; i++) {

    var v_top = scrollGroup.children[i].children[0].children[0];
    var v_top_02 = scrollGroup.children[i].children[0].children[1];

    var top_01 = scrollGroup.children[i].children[0].children[2];
    var top_02 = scrollGroup.children[i].children[0].children[3];

    var bott_00 = scrollGroup.children[i].children[0].children[4];

    passed_config_obj[i] = {
      "ind": v_top.children[0].text,
      "save_type": [
        v_top_02.children[1].value,
        v_top_02.children[2].value,
        v_top_02.children[3].value
      ],
      "save_manual_output": v_top_02.children[5].text,
      "file_01": top_01.children[1].selection.text,
      "file_02": top_02.children[1].selection.text,
      "sides": [{
        "side": "top",
        "type": bott_00.children[1].children[0].children[0].text,
        "finishing_value": bott_00.children[1].children[0].children[1].text,

        "eyelets_distance": bott_00.children[1].children[1].children[1].text,
        "eyelets_size": bott_00.children[1].children[1].children[2].text,
        "eyelets_cmyk": bott_00.children[1].children[1].children[3].text,
        "eyelets_outline_bool": (bott_00.children[1].children[1].children[4].text == 'o'),

        "eyelets_bool": (bott_00.children[1].children[1].children[1].text != 'xxx' && bott_00.children[1].children[1].children[2].text != 'xxx' && bott_00.children[1].children[1].children[3].text != 'xxx')
      }, {
        "side": "right",
        "type": bott_00.children[3].children[0].children[0].text,
        "finishing_value": bott_00.children[3].children[0].children[1].text,

        "eyelets_distance": bott_00.children[3].children[1].children[1].text,
        "eyelets_size": bott_00.children[3].children[1].children[2].text,
        "eyelets_cmyk": bott_00.children[3].children[1].children[3].text,
        "eyelets_outline_bool": (bott_00.children[1].children[1].children[4].text == 'o'),

        "eyelets_bool": (bott_00.children[3].children[1].children[1].text != 'xxx' && bott_00.children[3].children[1].children[2].text != 'xxx' && bott_00.children[3].children[1].children[3].text != 'xxx')
      }, {
        "side": "left",
        "type": bott_00.children[5].children[0].children[0].text,
        "finishing_value": bott_00.children[5].children[0].children[1].text,

        "eyelets_distance": bott_00.children[5].children[1].children[1].text,
        "eyelets_size": bott_00.children[5].children[1].children[2].text,
        "eyelets_cmyk": bott_00.children[5].children[1].children[3].text,
        "eyelets_outline_bool": (bott_00.children[1].children[1].children[4].text == 'o'),

        "eyelets_bool": (bott_00.children[5].children[1].children[1].text != 'xxx' && bott_00.children[5].children[1].children[2].text != 'xxx' && bott_00.children[5].children[1].children[3].text != 'xxx')
      }, {
        "side": "bottom",
        "type": bott_00.children[7].children[0].children[0].text,
        "finishing_value": bott_00.children[7].children[0].children[1].text,

        "eyelets_distance": bott_00.children[7].children[1].children[1].text,
        "eyelets_size": bott_00.children[7].children[1].children[2].text,
        "eyelets_cmyk": bott_00.children[7].children[1].children[3].text,
        "eyelets_outline_bool": (bott_00.children[1].children[1].children[4].text == 'o'),

        "eyelets_bool": (bott_00.children[7].children[1].children[1].text != 'xxx' && bott_00.children[7].children[1].children[2].text != 'xxx' && bott_00.children[7].children[1].children[3].text != 'xxx')
      }]

    } // end of passed_config_obj
  } // end of for loop

  for (var i = 0; i < passed_config_obj.length; i++) {
    if (passed_config_obj[i].file_01 == '' || passed_config_obj[i].file_01 == '' || passed_config_obj[i].file_01 == ' ') {
      alert('Error in module nr ' + (
        i + 1) + '\n\nProsze wybrac pliki do przetworzenia\nPlease, select files to proccess');
      return;
      break;
    }
  }
  //dev loopup
  // alert(passed_config_obj)
  // var parsed_dd = JSON.stringify(passed_config_obj, null, 10);
  // alert(parsed_dd)

  W.close();
  execute(passed_config_obj);

} // end of function

// ***************************** EXECUTE ***************************** ***************************** *****************************
//
function execute(configuration_object) {
  try {
    preferences.rulerUnits = Units.CM;
    var s_fr_size = parseFloat(s_fr_size_UI.text);
    var xl_fr_size = parseFloat(xl_fr_size_UI.text);
    var offset = parseFloat(offset_UI.text);
    var weld_overlap = parseFloat(weld_overlap_UI.text);

    var whiteColorObj = new CMYKColor();
    var am = 0;
    whiteColorObj.cyan = am;
    whiteColorObj.magenta = am;
    whiteColorObj.yellow = am;
    whiteColorObj.black = am;

    var blackColorObj = new CMYKColor();
    var bm = 100;
    blackColorObj.cyan = 0;
    blackColorObj.magenta = 0;
    blackColorObj.yellow = 0;
    blackColorObj.black = bm;

    var greyColorObj = new CMYKColor();
    var cc = 20;
    greyColorObj.cyan = cc;
    greyColorObj.magenta = cc;
    greyColorObj.yellow = cc;
    greyColorObj.black = cc;

    function is_in_opened_documents(file_name) {
      for (var j = 0; j < app.documents.length; j++) {
        if (app.documents[j].name.toString() == file_name) {
          return true;
          break;
        }
      }
      return false;
    }

    function get_index_of_a_file(file_name) {
      for (var j = 0; j < app.documents.length; j++) {
        if (app.documents[j].name.toString() == file_name) {
          return j;
          break;
        }
      }
      return;
    }

    function frame(frameSize, anchor, color) {
      if (anchor == null || anchor == undefined) {
        anchor = AnchorPosition.MIDDLECENTER;
      }
      if (color == null || color == undefined) {
        color = blackColorObj;
      }
      frameSize = frameSize * 2;
      app.backgroundColor.cmyk = color;
      activeDocument.resizeCanvas(app.activeDocument.width.value - frameSize, app.activeDocument.height.value - frameSize, anchor);
      activeDocument.resizeCanvas(app.activeDocument.width.value + frameSize, app.activeDocument.height.value + frameSize, anchor);
      app.backgroundColor.cmyk = whiteColorObj;
    }

    for (var i = 0; i < configuration_object.length; i++) {

      //GET FILES

      var first_side,
        second_side;

      if (configuration_object[i].file_01.indexOf('/') !== -1) { // is a path
        if (!is_in_opened_documents(configuration_object[i].file_01)) {
          first_side = app.open(File(configuration_object[i].file_01));
        } else {
          first_side = app.documents[get_index_of_a_file(configuration_object[i].file_01)];
        }
      } else {
        if (is_in_opened_documents(configuration_object[i].file_01)) {
          first_side = app.documents[get_index_of_a_file(configuration_object[i].file_01)];
        }
      }

      if (configuration_object[i].file_02.indexOf('/') !== -1) { // is a path
        if (!is_in_opened_documents(configuration_object[i].file_02)) {
          second_side = app.open(File(configuration_object[i].file_02));
        } else {
          second_side = app.documents[get_index_of_a_file(configuration_object[i].file_02)];
        }
      } else {
        if (is_in_opened_documents(configuration_object[i].file_02)) {
          second_side = app.documents[get_index_of_a_file(configuration_object[i].file_02)];
        }
      }

      //CREATE NEW DOCUMENT IF THE FILES ARE THE SAME
      if (first_side.name.toString() == second_side.name.toString()) {
        second_side = app.documents.add(first_side.width.value, first_side.height.value, first_side.resolution, ('crt_02_' + first_side.name), NewDocumentMode.CMYK);
        app.activeDocument = first_side;
        app.activeDocument.flatten();
        app.activeDocument.selection.selectAll();
        app.activeDocument.selection.copy();
        app.activeDocument.selection.deselect();
        app.activeDocument = second_side;
        app.activeDocument.paste();
        app.activeDocument.flatten();
      }

      //CONVERT TO CMYK AND FLATTEN
      for (var j = 0; j < [first_side, second_side].length; j++) {
        app.activeDocument.flatten();
        app.activeDocument = [first_side, second_side][j];
        var idCnvM = charIDToTypeID("CnvM");
        var desc54 = new ActionDescriptor();
        var idT = charIDToTypeID("T   ");
        var idCMYM = charIDToTypeID("CMYM");
        desc54.putClass(idT, idCMYM);
        executeAction(idCnvM, desc54, DialogModes.NO);
      }

      //MAKE THE SAME SIZE
      if (first_side.width.value !== second_side.width.value || first_side.height.value !== second_side.height.value || first_side.resolution !== second_side.resolution) {
        second_side.resizeImage(first_side.width.value, first_side.height.value, first_side.resolution, ResampleMethod.BICUBIC);
      }

      // alert(first_side)
      // alert(second_side)

      // MAKE FINISHINGS

      // HELPER
      // var finishings =
      // ['cut | dociecie' , 'sm weld | maly zgrzew', 'xl weld | duzy zgrzew', 'sleeve | rekaw'];

      // CHECK IF THERE ARE OTHER FINISHINGS
      var other_finishings_test = 0;
      var anchor;
      for (var j = 0; j < configuration_object[i].sides.length; j++) {
        var t_obj = configuration_object[i].sides[j];
        if (t_obj.type == finishings[0]) {
          other_finishings_test++;
        }
      }

      var other_finishings = true;
      var there_is_at_least_one_cut = true;

      if (other_finishings_test === 4) {
        other_finishings = false;
      }

      if (other_finishings_test === 0) {
        there_is_at_least_one_cut = false;
      }

      //FORCE OTHER FINISHINGS
      other_finishings = true;

      function flip_layer(direction) {
        if (direction === 'HORIZONTAL') {
          var idTrnf = charIDToTypeID("Trnf");
          var desc26 = new ActionDescriptor();
          var idnull = charIDToTypeID("null");
          var ref16 = new ActionReference();
          var idLyr = charIDToTypeID("Lyr ");
          var idOrdn = charIDToTypeID("Ordn");
          var idTrgt = charIDToTypeID("Trgt");
          ref16.putEnumerated(idLyr, idOrdn, idTrgt);
          desc26.putReference(idnull, ref16);
          var idFTcs = charIDToTypeID("FTcs");
          var idQCSt = charIDToTypeID("QCSt");
          var idQcsa = charIDToTypeID("Qcsa");
          desc26.putEnumerated(idFTcs, idQCSt, idQcsa);
          var idOfst = charIDToTypeID("Ofst");
          var desc27 = new ActionDescriptor();
          var idHrzn = charIDToTypeID("Hrzn");
          var idRlt = charIDToTypeID("#Rlt");
          desc27.putUnitDouble(idHrzn, idRlt, 0.000000);
          var idVrtc = charIDToTypeID("Vrtc");
          var idRlt = charIDToTypeID("#Rlt");
          desc27.putUnitDouble(idVrtc, idRlt, 0.000000);
          var idOfst = charIDToTypeID("Ofst");
          desc26.putObject(idOfst, idOfst, desc27);
          var idWdth = charIDToTypeID("Wdth");
          var idPrc = charIDToTypeID("#Prc");
          desc26.putUnitDouble(idWdth, idPrc, -100.000000);
          var idIntr = charIDToTypeID("Intr");
          var idIntp = charIDToTypeID("Intp");
          var idNrst = charIDToTypeID("Nrst");
          desc26.putEnumerated(idIntr, idIntp, idNrst);
          executeAction(idTrnf, desc26, DialogModes.NO);
        } else if (direction === 'VERTICAL') {
          var idTrnf = charIDToTypeID("Trnf");
          var desc28 = new ActionDescriptor();
          var idnull = charIDToTypeID("null");
          var ref17 = new ActionReference();
          var idLyr = charIDToTypeID("Lyr ");
          var idOrdn = charIDToTypeID("Ordn");
          var idTrgt = charIDToTypeID("Trgt");
          ref17.putEnumerated(idLyr, idOrdn, idTrgt);
          desc28.putReference(idnull, ref17);
          var idFTcs = charIDToTypeID("FTcs");
          var idQCSt = charIDToTypeID("QCSt");
          var idQcsa = charIDToTypeID("Qcsa");
          desc28.putEnumerated(idFTcs, idQCSt, idQcsa);
          var idOfst = charIDToTypeID("Ofst");
          var desc29 = new ActionDescriptor();
          var idHrzn = charIDToTypeID("Hrzn");
          var idRlt = charIDToTypeID("#Rlt");
          desc29.putUnitDouble(idHrzn, idRlt, 0.000000);
          var idVrtc = charIDToTypeID("Vrtc");
          var idRlt = charIDToTypeID("#Rlt");
          desc29.putUnitDouble(idVrtc, idRlt, 0.000000);
          var idOfst = charIDToTypeID("Ofst");
          desc28.putObject(idOfst, idOfst, desc29);
          var idHght = charIDToTypeID("Hght");
          var idPrc = charIDToTypeID("#Prc");
          desc28.putUnitDouble(idHght, idPrc, -100.000000);
          var idIntr = charIDToTypeID("Intr");
          var idIntp = charIDToTypeID("Intp");
          var idNrst = charIDToTypeID("Nrst");
          desc28.putEnumerated(idIntr, idIntp, idNrst);
          executeAction(idTrnf, desc28, DialogModes.NO);
        }
      }

      function process_copy_of_layer(layer_copy, side) {
        app.activeDocument.activeLayer = layer_copy;

        var bounds, www, hhh;
        bounds = app.activeDocument.activeLayer.bounds;
        www = bounds[2].value - bounds[0].value;
        hhh = bounds[3].value - bounds[1].value;

        switch (side) {
          case 'top':
            flip_layer('HORIZONTAL');
            flip_layer('VERTICAL');
            layer_copy.translate(0, -hhh);
            layer_copy.name = side;
            break;
          case 'right':
            layer_copy.translate(www, 0);
            layer_copy.name = side;
            break;
          case 'left':
            layer_copy.translate(-www, 0);
            layer_copy.name = side;
            break;
          case 'bottom':
            flip_layer('HORIZONTAL');
            flip_layer('VERTICAL');
            layer_copy.translate(0, hhh);
            layer_copy.name = side;
            break;
        }
        return;
      }

      if (other_finishings) {

        app.activeDocument = first_side;
        frame(s_fr_size, null, greyColorObj);
        app.activeDocument.selection.selectAll();
        app.activeDocument.selection.copy();
        app.activeDocument.selection.deselect();
        app.activeDocument.paste();
        var first_side_background_copy = app.activeDocument.activeLayer;

        app.activeDocument = second_side;
        frame(s_fr_size, null, greyColorObj);
        app.activeDocument.selection.selectAll();
        app.activeDocument.selection.copy();
        app.activeDocument.selection.deselect();
        app.activeDocument = first_side;
        app.activeDocument.paste();
        var pasted = app.activeDocument.activeLayer;


        //PREPARE OVERFLOWS
        // ['cut | dociecie' , 'sm weld | maly zgrzew', 'xl weld | duzy zgrzew', 'sleeve | rekaw'];

        function sec_side_resize(anchor, side) {
          var parsed_offset = parseFloat(offset);
          app.activeDocument = second_side;
          var _w_size = app.activeDocument.width.value + parsed_offset;
          var _h_size = app.activeDocument.height.value + parsed_offset;


          if (side == 'HORIZONTAL') {
            app.activeDocument.resizeImage(_w_size, app.activeDocument.height.value, null, ResampleMethod.BICUBIC);
            var _w_size_minus = app.activeDocument.width.value - parsed_offset;
            app.activeDocument.resizeCanvas(_w_size_minus, app.activeDocument.height.value, anchor);
          } else if (side == 'VERTICAL') {
            app.activeDocument.resizeImage(app.activeDocument.width.value, _h_size, null, ResampleMethod.BICUBIC);
            var _h_size_minus = app.activeDocument.height.value - parsed_offset;
            app.activeDocument.resizeCanvas(app.activeDocument.width.value, _h_size_minus, anchor);
          }

          app.activeDocument = first_side;
        }

        // PROCESS CLEAN CUT FIRST
        function clean_cut(_layer_, pr_second_side_bool) {
          if (there_is_at_least_one_cut) {
            var bounds, www, hhh;
            var parsed_offset = parseFloat(offset);
            for (var j = 0; j < configuration_object[i].sides.length; j++) {
              var t_obj = configuration_object[i].sides[j];
              if (t_obj.type == finishings[0]) { // is 'cut | dociecie'
                app.activeDocument.activeLayer = _layer_;
                switch (t_obj.side) {
                  case "top":
                    bounds = app.activeDocument.activeLayer.bounds;
                    www = bounds[2].value - bounds[0].value;
                    hhh = bounds[3].value - bounds[1].value;
                    resize_layer(app.activeDocument.activeLayer, www, hhh + parsed_offset,
                      AnchorPosition.BOTTOMCENTER);
                    if (pr_second_side_bool) {
                      sec_side_resize(AnchorPosition.BOTTOMCENTER, 'VERTICAL');
                    }
                    break;
                  case "left":
                    bounds = app.activeDocument.activeLayer.bounds;
                    www = bounds[2].value - bounds[0].value;
                    hhh = bounds[3].value - bounds[1].value;
                    resize_layer(app.activeDocument.activeLayer, www + parsed_offset, hhh,
                      AnchorPosition.MIDDLERIGHT);
                    if (pr_second_side_bool) {
                      sec_side_resize(AnchorPosition.MIDDLELEFT, 'HORIZONTAL');
                    }
                    break;
                  case "right":
                    bounds = app.activeDocument.activeLayer.bounds;
                    www = bounds[2].value - bounds[0].value;
                    hhh = bounds[3].value - bounds[1].value;
                    resize_layer(app.activeDocument.activeLayer, www + parsed_offset, hhh,
                      AnchorPosition.MIDDLELEFT);
                    if (pr_second_side_bool) {
                      sec_side_resize(AnchorPosition.MIDDLERIGHT, 'HORIZONTAL');
                    }
                    break;
                  case "bottom":
                    bounds = app.activeDocument.activeLayer.bounds;
                    www = bounds[2].value - bounds[0].value;
                    hhh = bounds[3].value - bounds[1].value;
                    resize_layer(app.activeDocument.activeLayer, www, hhh + parsed_offset,
                      AnchorPosition.TOPCENTER);
                    if (pr_second_side_bool) {
                      sec_side_resize(AnchorPosition.TOPCENTER, 'VERTICAL');
                    }
                    break;
                }
              }
            }
          }
        }

        clean_cut(pasted, true);

        //DUPLICATE OVERLAPS AND FLIP THEM ACCORDINGLY
        for (var j = 0; j < configuration_object[i].sides.length; j++) {
          var t_obj = configuration_object[i].sides[j];
          if (t_obj.type != finishings[0]) { // is not 'cut | dociecie'
            var layer_copy = pasted.duplicate();
            process_copy_of_layer(layer_copy, t_obj.side);
          }
        }

        pasted.remove();
        clean_cut(first_side_background_copy, false);

        var there_is_overlap_top = false;
        var there_is_overlap_bottom = false;

        for (var j = 0; j < configuration_object[i].sides.length; j++) {
          if (configuration_object[i].sides[j].type != finishings[0] && configuration_object[i].sides[j].side == 'top') {
            there_is_overlap_top = true;
          }
          if (configuration_object[i].sides[j].type != finishings[0] && configuration_object[i].sides[j].side == 'bottom') {
            there_is_overlap_bottom = true;
          }
        }

        function resize_layer(layer, size_x, size_y, anchor) {
          var bounds = layer.bounds;
          var www = bounds[2].value - bounds[0].value;
          var hhh = bounds[3].value - bounds[1].value;
          var newWidth = (100 / www) * size_x;
          var newHeight = (100 / hhh) * size_y;
          layer.resize(newWidth, newHeight, anchor);
        }

        function get_val_finishing(side) {
          for (var p = 0; p < configuration_object[i].sides.length; p++) {
            var ff_val = parseFloat(configuration_object[i].sides[p].finishing_value);
            if (configuration_object[i].sides[p].side == side) {
              if (configuration_object[i].sides[p].type == finishings[3]) { // sleeve
                if (ff_val < parseFloat(treshold_weld.text)) {
                  return ff_val + parseFloat(small_weld.text);
                } else {
                  return ff_val + parseFloat(big_weld.text);
                }
              } else {
                return ff_val;
              }
            }
          }
        }

        function create_new_solid_white_layer(cmyk) {
          newLayer = app.activeDocument.artLayers.add();
          app.activeDocument.activeLayer = newLayer;
          app.activeDocument.selection.selectAll();
          var s_color = new SolidColor();
          s_color.cmyk = whiteColorObj;
          app.activeDocument.selection.fill(s_color);
          app.activeDocument.selection.deselect();
          return newLayer;
        };

        //CREATE WHITE BLOCKS FOR WELD TO NOT STICK TO PAINT
        var block;
        if (blocks_UI.value) {
          for (var j = 0; j < configuration_object[i].sides.length; j++) {
            if (there_is_overlap_top && configuration_object[i].sides[j].type != finishings[0] && configuration_object[i].sides[j].side == 'left') {
              var new_lay = create_new_solid_white_layer();
              var n_l_height = parseFloat(get_val_finishing('top')) - weld_overlap;
              resize_layer(new_lay, app.activeDocument.width.value, n_l_height, AnchorPosition.TOPLEFT);
              var c_w = app.activeDocument.activeLayer.bounds[2].value - app.activeDocument.activeLayer.bounds[0].value;
              new_lay.translate(-c_w - s_fr_size, 0);
              new_lay.name = 'TOPLEFT block ' + n_l_height;
            }
            if (there_is_overlap_bottom && configuration_object[i].sides[j].type != finishings[0] && configuration_object[i].sides[j].side == 'left') {
              var new_lay = create_new_solid_white_layer();
              var n_l_height = parseFloat(get_val_finishing('bottom')) - weld_overlap;
              resize_layer(new_lay, app.activeDocument.width.value, n_l_height, AnchorPosition.BOTTOMLEFT);
              var c_w = app.activeDocument.activeLayer.bounds[2].value - app.activeDocument.activeLayer.bounds[0].value;
              new_lay.translate(-c_w - s_fr_size, 0);
              new_lay.name = 'BOTTOMLEFT block ' + n_l_height;
            }
            if (there_is_overlap_top && configuration_object[i].sides[j].type != finishings[0] && configuration_object[i].sides[j].side == 'right') {
              var new_lay = create_new_solid_white_layer();
              var n_l_height = parseFloat(get_val_finishing('top')) - weld_overlap;
              resize_layer(new_lay, app.activeDocument.width.value, n_l_height, AnchorPosition.TOPRIGHT);
              var c_w = app.activeDocument.activeLayer.bounds[2].value - app.activeDocument.activeLayer.bounds[0].value;
              new_lay.translate(c_w + s_fr_size, 0);
              new_lay.name = 'TOPRIGHT block ' + n_l_height;
            }
            if (there_is_overlap_bottom && configuration_object[i].sides[j].type != finishings[0] && configuration_object[i].sides[j].side == 'right') {
              var new_lay = create_new_solid_white_layer();
              var n_l_height = parseFloat(get_val_finishing('bottom')) - weld_overlap;
              resize_layer(new_lay, app.activeDocument.width.value, n_l_height, AnchorPosition.BOTTOMRIGHT);
              var c_w = app.activeDocument.activeLayer.bounds[2].value - app.activeDocument.activeLayer.bounds[0].value;
              new_lay.translate(c_w + s_fr_size, 0);
              new_lay.name = 'BOTTOMRIGHT block ' + n_l_height;
            }
          }
        }

        //MAKE EYELETS *************************

        //SHRINK CANVAS BEFORE PLACING EYELETS
        for (var j = 0; j < configuration_object[i].sides.length; j++) {
          var t_obj = configuration_object[i].sides[j];
          var _shift;
          if (t_obj.type == finishings[3]) { //'sleeve | rekaw'
            _shift = parseFloat(t_obj.finishing_value);
          } else {
            _shift = 0;
          }
          app.activeDocument = first_side;
          if (t_obj.eyelets_bool && _shift !== 0) {
            switch (t_obj.side) {
              case "top":
                app.activeDocument.resizeCanvas(app.activeDocument.width, app.activeDocument.height - _shift,
                  AnchorPosition.BOTTOMCENTER);
                break;
              case "left":
                app.activeDocument.resizeCanvas(app.activeDocument.width - _shift, app.activeDocument.height,
                  AnchorPosition.MIDDLERIGHT);
                break;
              case "right":
                app.activeDocument.resizeCanvas(app.activeDocument.width - _shift, app.activeDocument.height,
                  AnchorPosition.MIDDLELEFT);
                break;
              case "bottom":
                app.activeDocument.resizeCanvas(app.activeDocument.width, app.activeDocument.height - _shift,
                  AnchorPosition.TOPCENTER);
                break;
            }
          }
        }

        //USE OUTSIDE SCOPE FUNCTION TO PLACE THE EYELETS
        for (var j = 0; j < configuration_object[i].sides.length; j++) {
          var t_obj = configuration_object[i].sides[j];

          if (t_obj.eyelets_bool) {
            var _distance = parseFloat(t_obj.eyelets_distance);
            var _size = parseFloat(t_obj.eyelets_size);

            var _eyelets_cmyk = t_obj.eyelets_cmyk;
            if (_eyelets_cmyk.indexOf('0,0') !== -1) {
              _eyelets_cmyk = blackColorObj;
            } else if (_eyelets_cmyk.indexOf('5') !== -1) {
              _eyelets_cmyk = greyColorObj;
            } else {
              _eyelets_cmyk = whiteColorObj;
            }
            var _eyelets_outline_bool = parseFloat(t_obj.eyelets_outline_bool);

            make_eyelets_main_scope_function(true, t_obj.side, _distance, _size, _eyelets_cmyk, _eyelets_outline_bool);
          }

        }

        //RETURN TO THE PREVIOUS SIZE BEFORE SHRINKING FOR EYELETS
        for (var j = 0; j < configuration_object[i].sides.length; j++) {
          var t_obj = configuration_object[i].sides[j];
          var _shift;
          if (t_obj.type == finishings[3]) { //'sleeve | rekaw'
            _shift = parseFloat(t_obj.finishing_value);
          } else {
            _shift = 0;
          }
          app.activeDocument = first_side;
          if (t_obj.eyelets_bool && _shift !== 0) {
            switch (t_obj.side) {
              case "top":
                app.activeDocument.resizeCanvas(app.activeDocument.width, app.activeDocument.height + _shift,
                  AnchorPosition.BOTTOMCENTER);
                break;
              case "left":
                app.activeDocument.resizeCanvas(app.activeDocument.width + _shift, app.activeDocument.height,
                  AnchorPosition.MIDDLERIGHT);
                break;
              case "right":
                app.activeDocument.resizeCanvas(app.activeDocument.width + _shift, app.activeDocument.height,
                  AnchorPosition.MIDDLELEFT);
                break;
              case "bottom":
                app.activeDocument.resizeCanvas(app.activeDocument.width, app.activeDocument.height + _shift,
                  AnchorPosition.TOPCENTER);
                break;
            }
          }
        }

        //UNCOVER OVERFLOWS
        // ['cut | dociecie' , 'sm weld | maly zgrzew', 'xl weld | duzy zgrzew', 'sleeve | rekaw'];
        function sec_side(VAL, anchor, side, substract) {
          if (VAL === 0) {
            return;
          }
          app.activeDocument = second_side;
          if (substract) {
            var minus_val = VAL - weld_overlap - parseFloat(offset);
          } else {
            var minus_val = VAL;
          }
          if (side == 'HORIZONTAL') {
            if (substract) {
              app.activeDocument.resizeCanvas(app.activeDocument.width.value - minus_val, app.activeDocument.height.value, anchor);
              app.activeDocument.resizeCanvas(app.activeDocument.width.value + minus_val, app.activeDocument.height.value, anchor);
            } else {
              app.activeDocument.resizeCanvas(app.activeDocument.width.value + minus_val, app.activeDocument.height.value, anchor);
            }
          } else if (side == 'VERTICAL') {
            if (substract) {
              app.activeDocument.resizeCanvas(app.activeDocument.width.value, app.activeDocument.height.value - minus_val, anchor);
              app.activeDocument.resizeCanvas(app.activeDocument.width.value, app.activeDocument.height.value + minus_val, anchor);
            } else {
              app.activeDocument.resizeCanvas(app.activeDocument.width.value, app.activeDocument.height.value + minus_val, anchor);
            }
          }
          app.activeDocument = first_side;
        }

        var second_sides_overflows = {
          "top": "",
          "left": "",
          "right": "",
          "bottom": ""
        };

        for (var j = 0; j < configuration_object[i].sides.length; j++) {
          var t_obj = configuration_object[i].sides[j];
          var fin_val = parseFloat(t_obj.finishing_value);
          var final_value_after_calc = 0;

          if (t_obj.type == finishings[3]) { // sleeve
            if (fin_val < parseFloat(treshold_weld.text)) {
              final_value_after_calc = fin_val + parseFloat(small_weld.text) + parseFloat(offset);
            } else {
              final_value_after_calc = fin_val + parseFloat(big_weld.text) + parseFloat(offset);
            }
          } else if (t_obj.type == finishings[1] || t_obj.type == finishings[2]) {
            final_value_after_calc = fin_val + parseFloat(offset);
          }

          var t_width = app.activeDocument.width.value;
          var t_height = app.activeDocument.height.value;

          switch (t_obj.side) {
            case "top":
              if (t_obj.type == finishings[0]) {
                app.activeDocument.resizeCanvas(t_width, t_height + parseFloat(offset), AnchorPosition.BOTTOMCENTER);
                second_sides_overflows.top = 0;
              } else {
                app.activeDocument.resizeCanvas(t_width, t_height + final_value_after_calc, AnchorPosition.BOTTOMCENTER);
                sec_side(final_value_after_calc, AnchorPosition.BOTTOMCENTER, 'VERTICAL', true);
                second_sides_overflows.top = final_value_after_calc - parseFloat(offset);
              }
              break;
            case "left":
              if (t_obj.type == finishings[0]) {
                app.activeDocument.resizeCanvas(t_width + parseFloat(offset), t_height, AnchorPosition.MIDDLERIGHT);
                second_sides_overflows.left = 0;
              } else {
                app.activeDocument.resizeCanvas(t_width + final_value_after_calc, t_height, AnchorPosition.MIDDLERIGHT);
                sec_side(final_value_after_calc, AnchorPosition.MIDDLELEFT, 'HORIZONTAL', true);
                second_sides_overflows.left = final_value_after_calc - parseFloat(offset);
              }
              break;
            case "right":
              if (t_obj.type == finishings[0]) {
                app.activeDocument.resizeCanvas(t_width + parseFloat(offset), t_height, AnchorPosition.MIDDLELEFT);
                second_sides_overflows.right = 0;
              } else {
                app.activeDocument.resizeCanvas(t_width + final_value_after_calc, t_height, AnchorPosition.MIDDLELEFT);
                sec_side(final_value_after_calc, AnchorPosition.MIDDLERIGHT, 'HORIZONTAL', true);
                second_sides_overflows.right = final_value_after_calc - parseFloat(offset);
              }
              break;
            case "bottom":
              if (t_obj.type == finishings[0]) {
                app.activeDocument.resizeCanvas(t_width, t_height + parseFloat(offset), AnchorPosition.TOPCENTER);
                second_sides_overflows.bottom = 0;
              } else {
                app.activeDocument.resizeCanvas(t_width, t_height + final_value_after_calc, AnchorPosition.TOPCENTER);
                sec_side(final_value_after_calc, AnchorPosition.TOPCENTER, 'VERTICAL', true);
                second_sides_overflows.bottom = final_value_after_calc - parseFloat(offset);
              }
              break;
          }
        } // end of for loop

        app.activeDocument = second_side;
        frame(xl_fr_size, null, blackColorObj);

        //MAKE FRAME AROUND TO CUT

        sec_side(second_sides_overflows.top, AnchorPosition.BOTTOMCENTER, 'VERTICAL', false);
        sec_side(second_sides_overflows.left, AnchorPosition.MIDDLELEFT, 'HORIZONTAL', false);
        sec_side(second_sides_overflows.right, AnchorPosition.MIDDLERIGHT, 'HORIZONTAL', false);
        sec_side(second_sides_overflows.bottom, AnchorPosition.TOPCENTER, 'VERTICAL', false);

        app.activeDocument = second_side;
        frame(xl_fr_size, null, blackColorObj);

        second_side.resizeCanvas(app.activeDocument.width.value + (parseFloat(offset) * 2),
          app.activeDocument.height.value + (parseFloat(offset) * 2), AnchorPosition.MIDDLECENTER);

        app.activeDocument = second_side;
        frame(xl_fr_size, null, blackColorObj);

        app.activeDocument = first_side;
        app.activeDocument.flatten();
        frame(xl_fr_size, null, blackColorObj);


        finish_and_save(configuration_object[i], first_side, second_side);

      } // end of if other_finishings
    } // end of modules loop

  } catch (e) {
    alert(e)
  } //end of try catch
} // end of execute function

function finish_and_save(configuration_obj, first_side, second_side) {
  function SaveTIFF(saveFile) {
    tiffSaveOptions = new TiffSaveOptions();
    tiffSaveOptions.embedColorProfile = true;
    tiffSaveOptions.alphaChannels = true;
    tiffSaveOptions.layers = true;
    tiffSaveOptions.imageCompression = TIFFEncoding.TIFFLZW;
    // tiffSaveOptions.jpegQuality=12;
    app.activeDocument.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE);
  }

  function SaveJPEG(saveFile, jpegQuality) {
    jpgSaveOptions = new JPEGSaveOptions();
    jpgSaveOptions.embedColorProfile = true;
    jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
    jpgSaveOptions.matte = MatteType.NONE;
    jpgSaveOptions.quality = jpegQuality;
    activeDocument.saveAs(saveFile, jpgSaveOptions, true, Extension.LOWERCASE);
  }

  function undo(state) {
    app.activeDocument.activeHistoryState = state;
  }

  var historyStatus;
  function saveState() {
    historyStatus = app.activeDocument.activeHistoryState;
  }

  function save_file(side, path, close) {
    for (var p = 0; p < side.length; p++) {
      app.activeDocument = side[p];
      var Path, Name;
      if (path == null) {
        try {
          if (app.activeDocument.name.indexOf('crt_02') !== -1) {
            Path = side[0].path;
          }
          Path = app.activeDocument.path;
        } catch (e) {
          try {
            if (p === 0) {
              Path = side[1].path;
            } else {
              Path = side[0].path;
            }
          } catch (e) {
            try {
              if (app.activeDocument.name.indexOf('.pdf' !== -1)) {
                Path = app.recentFiles[0];
              } else {
                alert('Path to ' + side[p].name + ' could not be found. Please, save manually.');
              }
            } catch (e) {}
          }
        }
      } else {
        Path = path;
      }
      Name = side[0].name.replace(/\.[^\.]+$/, '');

      var Suffix = "blockout_str_" + (p+1);

      var saveFile = File(Path + "/" + Name + "_" + Suffix + '.tif');
      var saveFile_JPG = File(Path + "/" + Name + "_" + Suffix + '_prev.jpg');
      try {
        // alert(Path + "/" + Name + "_" + Suffix + '.tif')
        SaveTIFF(saveFile);
        // ********* SAVE PREVIEW
        if (preview_UI.value) {
          saveState();

          app.activeDocument.flatten();

          //to RGB
          var id11 = charIDToTypeID("CnvM");
          var desc4 = new ActionDescriptor();
          var id12 = charIDToTypeID("T   ");
          var id13 = charIDToTypeID("RGBM");
          desc4.putClass(id12, id13);
          var id14 = charIDToTypeID("Fltt");
          desc4.putBoolean(id14, false);
          executeAction(id11, desc4, DialogModes.NO);

          app.activeDocument.resizeImage(30, null, 72, ResampleMethod.BICUBIC);

          SaveJPEG(saveFile_JPG, 6);

          undo(historyStatus);
        }
      } catch (e) {
        alert(e);
      }
    }
    for (var p = 0; p < side.length; p++) {
      if (close) {
        side[p].close(SaveOptions.DONOTSAVECHANGES);
      }
    }
  }

  try {

    for (var l = 0; l < configuration_obj.save_type.length; l++) {
      var v_temp_val = configuration_obj.save_type[l];
      if (l === 0 && v_temp_val) {
        save_file([first_side, second_side], null, true);
      } else if (l === 1 && v_temp_val) {
        // let them save manually
      } else if (l === 2 && v_temp_val) {
        var p_ath = configuration_obj.save_manual_output;
        if (p_ath.indexOf('/') === -1) {
          save_file([first_side, second_side], null, true);
        } else {
          save_file([first_side, second_side], p_ath, true);
        }
      }
    }

  } catch (e) {
    alert(e)
  } //end of try
} // end of finish_and_save
///////////////////////
