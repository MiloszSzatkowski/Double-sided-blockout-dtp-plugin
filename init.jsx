////////////////////////////////// INCLUDE LIBRARIES ***********************

#include json2.js



////////////////////////////////// ONLY OPERATE IN PHOTOSHOP ***********************

#target photoshop

////////////////////////////////// GLOBAL VARIABLES START ***********************

//test json lib import
// alert(JSON.parse('{"a":1}').a);

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
W.maximumSize.width = 1250;
W.maximumSize.height = 700;

W.minimumSize.width = W.maximumSize.width - 10;
W.minimumSize.height = W.maximumSize.height - 10;

var scrollBar = W.add ('scrollbar {alignment: "top"}', [0, 0, 40, 200],0,0,50);
scrollBar.stepdelta = 1.01;

var main_group = W.add ('group {orientation: "row", alignChildren: ["fill","fill"]}');

var top_group    = main_group.add('group');
main_group.add('panel');
var bottom_group = main_group.add('group {orientation: "column", alignChildren: ["fill","fill"]}');

/////////   MODULES CONTAINER
var modules_container = top_group.add('group {orientation: "row"}, alignChildren: ["left","top"]', u, e);

modules_container.minimumSize.height = W.maximumSize.height - 30;
modules_container.minimumSize.width = W.maximumSize.width - 250;
modules_container.maximumSize.height = modules_container.minimumSize.height;

var scrollGroup = modules_container.add('group {orientation: "column"}, alignChildren: ["fill","fill"]', u, e)

var scroll_offset = 0;

scrollBar.onChanging = function () {
    for (var i = 0; i < scrollGroup.children.length; i++) {
      scrollGroup.children[i].location.y = Math.round(((-1 * scroll_offset) * this.value + (235 * i) / 20)*20);
    }
  // scrollGroup.location.y = (-1 * scroll_offset) * this.value;
}

/////////   BOTTOM CONTROL GROUP
/////////   BOTTOM CONTROL GROUP

var bottom_sub_group = bottom_group.add('group {orientation: "column"}');
var bottom_first_row = bottom_sub_group.add('group {orientation: "column", alignChildren: ["fill","fill"]}');
var bottom_second_row = bottom_sub_group.add('group {orientation: "column", alignChildren: ["fill","fill"]}');
var bottom_third_row = bottom_sub_group.add('group {orientation: "column", alignChildren: ["fill","fill"]}');

var amount_of_modules = bottom_first_row.add('panel').add('statictext', u, 1 );
amount_of_modules.minimumSize.width = 20;

var add_blockout = bottom_first_row.add('button', u, '+ blockout');

add_blockout.onClick = function () {
  if (parseFloat(amount_of_modules.text) > 11) {
    alert('Twoj komputer moze nie miec wystarczajec pamieci do przetworzenia ponad 12 modulow \nKontynuujesz na wlasna odpowiedzialnosc \n\n\nYour computer may not have sufficient memory to proccess more than 12 modules \nProceed at your own risk ');
  }
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

var accept_button = bottom_first_row.add('button', u, 'GO');

accept_button.onClick = function () {
  var passed_config_obj = []
  for (var i = 0; i < scrollGroup.children.length; i++) {
    var v_top = scrollGroup.children[i].children[0].children[0];
    var v_top_02 = scrollGroup.children[i].children[0].children[1];
    passed_config_obj.push( {
      "ind" :  v_top.children[0].text,
      "save" : [ (v_top_02.children[1].value)    ]
    }  )
  }
  alert(passed_config_obj[0].ind);
  alert(passed_config_obj[0].save);

}

var close_button = bottom_first_row.add('button', u, 'close');
close_button.onClick = function () { W.close();  }

var small_weld_d = bottom_first_row.add('statictext', u, 'Small weld | Maly zgrzew:');
var small_weld = bottom_first_row.add('edittext', u, 3);
var big_weld_d = bottom_first_row.add('statictext', u, 'Big weld | Duzy zgrzew:');
var big_weld = bottom_first_row.add('edittext', u, 5);

var help = bottom_third_row.add('button', u , 'HELP ?');

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
var bigger_not = 'xxxxxxxx';
var tick = 'o'

var opened_documents_names = [''];

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

  var folder_ch_desc = 'To a folder :| Do folderu:';

  var save_config_d = _very_top_02.add('statictext', u, 'Save | Zapisz : ');
  var save_config_auto = _very_top_02.add('checkbox', u, 'Automatically | Automatycznie');
  var save_config_manual_dialog = _very_top_02.add('checkbox', u, 'Manual | Manualnie');
  var save_config_manual = _very_top_02.add('checkbox', u, folder_ch_desc);
  var manual_destination_butt = _very_top_02.add ("iconbutton", u, "DestinationFolderIcon");
  var manual_destinations = _very_top_02.add('statictext', u, '_____', { scrolling: true, multiline:true } );
  manual_destinations.minimumSize.height = 50;
  manual_destinations.minimumSize.width = 300;

  manual_destination_butt.onClick = function () {
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
    elim_arr[i].onClick = function () {
      var checkbox_this = this;
      toggle_checkbox_values(checkbox_this)
    }
  }

  function toggle_checkbox_values (checkbox_this) {
    if (checkbox_this.value) {
      if ((checkbox_this.text == folder_ch_desc)
      && (manual_destinations.text.indexOf('/') === -1)) {
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

  function check_for_val_in_drop_bool (dropdown, val) {
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
  available_files_first_side.selection = 0;

  var button_second_side = _middle.add("iconbutton", u, "Step2Icon");

  var available_files_second_side = _middle.add('dropdownlist', u, opened_documents_names);
  available_files_second_side.minimumSize.width = 800;
  available_files_second_side.selection = 0;

  same_image.onClick = function () {
    if (same_image.value && (available_files_first_side.items.length > 1)
      && (available_files_first_side.selection.text !==  available_files_second_side.selection.text )) {
        if (check_for_val_in_drop_bool(available_files_second_side, available_files_first_side.selection.text)) {
          check_for_val_in_drop_pick_the_same_outer(available_files_second_side, available_files_first_side.selection.text)
        } else {
          available_files_second_side.add('item', available_files_first_side.selection.text);
          available_files_second_side.selection = available_files_second_side.items.length-1;
        }
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
      if (check_for_val_in_drop_bool(available_files_second_side, available_files_first_side.selection.text)) {
        check_for_val_in_drop_pick_the_same_outer(available_files_second_side, available_files_first_side.selection.text)
      } else {
        available_files_second_side.add('item', available_files_first_side.selection.text);
        available_files_second_side.selection = available_files_second_side.items.length-1;
      }
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
      if (check_for_val_in_drop_bool(available_files_first_side, available_files_second_side.selection.text)) {
        check_for_val_in_drop_pick_the_same_outer(available_files_first_side, available_files_second_side.selection.text)
      } else {
        available_files_first_side.add('item', available_files_second_side.selection.text);
        available_files_first_side.selection = available_files_first_side.items.length-1;
      }

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
    tt_w_02[p] .add('statictext', u, bigger_not, { scrolling: true, multiline:true });
    tt_w_02[p] .add('statictext', u, not);
  }

  var set_g = _bottom.add('group {orientation: "column", alignChildren: "fill"}');
  var set_butt = set_g.add('button', undefined, 'Set | Ustaw');
  var set_butt_desc = set_g.add('statictext', undefined, 'Fabryczne - Default');

  var outer_this = this;

  set_butt.onClick = function () {

    var MODIFIED = false;

    var PARENT_OF_THIS_BUTTON = this.parent.parent;

    var ww = new Window('dialog {orientation: "row"}', u_window_title);
    var mm_group = ww.add('group {orientation: "column" , alignChildren: ["fill", "fill"]} ');
    var mm_group_02 = ww.add('group {orientation: "column" , alignChildren: ["fill", "fill"]} ');

    var widget_desc_eng = "All values are provided in centimiters, for decimal values, use a dot (1.2, 2.56 ...) ";
    var widget_desc_pl = "Wszystkie wartosci podane sa w centymetrach, dla wartosci dziesietnych, uzyj kropki (1.2, 2.56 ...)";
    var _descriptions = ww.add('group {orientation: "column"}, alignChildren: ["fill", "fill"]');
    _descriptions.alignment = ["center", "center"];

    _descriptions.add('statictext', u, widget_desc_eng, {multiline: true} );
    _descriptions.add('statictext', u, widget_desc_pl , {multiline: true} );

    _descriptions.add('panel {alignment: "fill"}');

    var _g_t_m = _descriptions.add('group {orientation: "row", alignChildren: ["fill", "fill"]}');

    var _g_t01 = _g_t_m.add('group {orientation: "column", alignChildren: ["fill", "fill"]}');
    var _g_t02 = _g_t_m.add('group {orientation: "column", alignChildren: ["fill", "fill"]}');

    var config_file_json = load_json_config();

    var name_list_of_configs = [];

    for (var i = 0; i < config_file_json.all.length; i++) {
      name_list_of_configs.push(config_file_json.all[i].name)
    }

    _g_t01.add('statictext', u , 'USTAWIENIA | CONFIGURATIONS');
    _g_t01.add('statictext', u , 'Wczytaj | Load :');

    var load_config_drop = _g_t01.add('dropdownlist', u , name_list_of_configs);
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
      } else if (job == 'overwrite') {

      }
    }

    load_config_drop.onChange = function () {
      update_configuration_front_end();
    }

   function update_configuration_front_end () {
     var _index_of_chosen_config = load_config_drop.selection.index;

     for (var s = 0; s < 4; s++) {
       check_for_val_in_drop_pick_the_same(inner_drop[s],
         config_file_json.all[_index_of_chosen_config].sides[s].finishing_type);
       inner_drop_d[s].text =
        config_file_json.all[_index_of_chosen_config].sides[s].finishing_value;

       if (config_file_json.all[_index_of_chosen_config].sides[s].eyelets_bool) {
         inner_group_eyelets[s].children[0].value =
           config_file_json.all[_index_of_chosen_config].sides[s].eyelets_bool;
         inner_group_eyelets[s].children[2].text =
           config_file_json.all[_index_of_chosen_config].sides[s].eyelets_distance;
         inner_group_eyelets_02[s].children[1].text =
           config_file_json.all[_index_of_chosen_config].sides[s].eyelets_size;
         check_for_val_in_drop_pick_the_same(inner_group_eyelets_02[s].children[3],
           config_file_json.all[_index_of_chosen_config].sides[s].eyelets_cmyk);

           inner_group_eyelets_02[s].children[4].value =
           config_file_json.all[_index_of_chosen_config].sides[s].eyelets_outline_bool;

       } else {
         inner_group_eyelets[s].children[0].value = false;
         inner_group_eyelets[s].children[2].text = 0;
         inner_group_eyelets_02[s].children[1].text = 0;
         inner_group_eyelets_02[s].children[3].selection = 0;
         inner_group_eyelets_02[s].children[4].value = false;
       }
     }

   }

   var button_create_new_config = _g_t01.add('button', u , 'Zapisz nowe | Save new');

    button_create_new_config.onClick = function () {
      save_or_overwrite_configuration('save_new');
    }

    function save_or_overwrite_configuration(job, inform) {
      if (inform == undefined || inform == null) {
        inform = true;
      }
      var user_name;
      if        (job == 'save_new') {
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
          "name" : user_name,
          "sides" : []
        });
        for (var s = 0; s < 4; s++) {
          config_file_json.all[config_file_json.all.length-1].sides.push(
            {
              "finishing_type" : inner_drop[s].selection.text,
              "finishing_value" : inner_drop_d[s].text,
              "eyelets_bool" : inner_group_eyelets[s].children[0].value,
              "eyelets_distance" : inner_group_eyelets[s].children[2].text,
              "eyelets_size" : inner_group_eyelets_02[s].children[1].text,
              "eyelets_cmyk" : inner_group_eyelets_02[s].children[3].selection.text,
              "eyelets_outline_bool" : inner_group_eyelets_02[s].children[4].value
            }
          )
        }
        var parsed_to_json_from_js_object = JSON.stringify(config_file_json);
        save_config_json(parsed_to_json_from_js_object);
        config_file_json = load_json_config();

        var dev = false;
        var dat = '';
          if (dev == true) {
            dat =  JSON.stringify(config_file_json.all[load_config_drop.selection.index]).replace(/[.{}]/g, ' ').replace(/,"/g, '\n')
          }

            if        (job == 'save_new') {
              update_list_of_configs('add', user_name);
              if (inform) {
              alert(user_name + '\nzapisany\n' + user_name + '\nhas been saved!\n\n' + dat );
              }
            } else if (job == 'overwrite'){
              update_configuration_front_end();
              if (inform) {
                alert(user_name + '\nnadpisany\n' + user_name + '\noverwritten!\n\n' + dat );
              }
            } else if (job == 'create_custom'){
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
      while(!FILE.eof)
      json_unparsed += FILE.readln();
      json_parsed = JSON.parse(json_unparsed);
      FILE.close();
      return json_parsed;
    }

    function save_config_json(jsn) {
      var FILE = new File((new File($.fileName)).parent + '/finish_configs/config.json');
      FILE.open("w");
      FILE.writeln('');
      FILE.close();

      FILE.open("e", "TEXT");
      FILE.writeln(jsn);
      FILE.close();
    }

    var button_create_overwrite_config = _g_t01.add('button', u , 'Nadpisz | Overwrite');

    button_create_overwrite_config.onClick = function () {
        save_or_overwrite_configuration('overwrite');
    }

    var button_delete_config = _g_t01.add('button', u , 'Usun | Delete');

    button_delete_config.onClick = function () {
      var deleted_tag_text = load_config_drop.selection.text;
      delete_configuration();
      if (load_config_drop.selection.text != 'Fabryczne - Default') {
        update_list_of_configs('delete', load_config_drop.selection.text);
        config_file_json = load_json_config();
        alert(deleted_tag_text + '\nusuniety\n' + deleted_tag_text + '\ndeleted!\n\n' );
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
            config_file_json.all.splice(i,1);
            var parsed_to_json_from_js_object = JSON.stringify(config_file_json);
            save_config_json(parsed_to_json_from_js_object);
            break;
          }
        }
      }
    }

    var _inner_accept = _g_t02.add('button', u , 'Accept');
    var _inner_cancel = _g_t02.add('button', u , 'Cancel');

    var inner_drop = [];
    var inner_drop_d = [];
    var inner_index = [];
    var inner_group_eyelets = [];
    var inner_group_eyelets_02 = [];

      _inner_cancel.onClick = function () {
      ww.close();
    }

    for (var j = 0; j < 4; j++) {

      var group_to_add;

      if (j===0) {
        group_to_add = mm_group.add('group {orientation: "column", alignChildren: "fill"}');
        group_to_add.add ('image', undefined, File (script_folder + '/icons/top.png'));
      } else if (j===1) {
        group_to_add = mm_group.add('group {orientation: "column", alignChildren: "fill"}');
        group_to_add.add ('image', undefined, File (script_folder + '/icons/right.png'));
      } else if (j===2) {
        group_to_add = mm_group_02.add('group {orientation: "column", alignChildren: "fill"}');
        group_to_add.add ('image', undefined, File (script_folder + '/icons/left.png'));
      } else if (j===3) {
        group_to_add = mm_group_02.add('group {orientation: "column", alignChildren: "fill"}');
        group_to_add.add ('image', undefined, File (script_folder + '/icons/down.png'));
      }

      group_to_add.add('statictext', u, 'Wykonczenie | Finishing :' );

      inner_drop[j] = group_to_add.add ('dropdownlist', u, finishings )

      inner_drop[j].onChange = function () {
        var that_ = this;
        if        (this.selection == 1){
          that_.parent.children[4].text = small_weld.text;
        } else if (this.selection == 2){
          that_.parent.children[4].text = big_weld.text;
        } else if (this.selection == 0) {
          that_.parent.children[4].text = 0;
        } else {
          that_.parent.children[4].text = 0;
        }
      };

      group_to_add.add('statictext', u, 'Wartosc | Value :' );

      inner_drop_d[j] = group_to_add.add('edittext', u, 0 );

      inner_drop[j].selection = 0;

      inner_group_eyelets[j] = group_to_add.add('group {orientation: "row"}');

      inner_group_eyelets[j].add('checkbox', u, 'Oczka | Eyelets').onClick = function () {
        if (this.value) {
          // distance
          this.parent.children[2].text = 50;
          // size
          this.parent.parent.children[6].children[1].text = 0.7;
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
      inner_group_eyelets[j].add('edittext', u, 0);
      inner_group_eyelets_02[j] = group_to_add.add('group {orientation: "row"}');
      inner_group_eyelets_02[j].add('statictext', u, 'Wielkosc | Size');
      inner_group_eyelets_02[j].add('edittext', u, 0);
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
    sp_ind = [1,3,5,7]

    check_for_val_in_drop_pick_the_same(load_config_drop,
      PARENT_OF_THIS_BUTTON.children[8].children[1].text);

    for (var s = 0; s < 4; s++) {
      var _sp_ind_inner = sp_ind[s];

      check_for_val_in_drop_pick_the_same(inner_drop[s],
        PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[0].children[0].text);

      inner_drop_d[s].text =
       PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[0].children[1].text;

      if (
          (PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[1].text != not) &&
          (PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[2].text != not) &&
          (PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[3].text != bigger_not)
        ) {

          inner_group_eyelets[s].children[0].value = true;

          inner_group_eyelets[s].children[2].text =
          PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[1].text ;
        inner_group_eyelets_02[s].children[1].text =
          PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[2].text;

        check_for_val_in_drop_pick_the_same(inner_group_eyelets_02[s].children[3],
          PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[3].text);

        if (PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[4].text == tick) {
          inner_group_eyelets_02[s].children[4].value = true;
        }

      }
    }

    _inner_accept.onClick = function () {
      if        (load_config_drop.selection.text != 'Fabryczne - Default') {
        if (load_config_drop.selection.text.indexOf('Temporary') !== -1) {
          save_or_overwrite_configuration('overwrite', false);
        }
        PARENT_OF_THIS_BUTTON.children[8].children[1].text = load_config_drop.selection.text;
      } else if (load_config_drop.selection.text == 'Fabryczne - Default'){
        save_or_overwrite_configuration('create_custom', false);
        PARENT_OF_THIS_BUTTON.children[8].children[1].text = load_config_drop.selection.text;
      }
      for (var s = 0; s < 4; s++) {
        var _sp_ind_inner = sp_ind[s];
        PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[0].children[0].text = inner_drop[s].selection.text;
        PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[0].children[1].text = inner_drop_d[s].text;

        if (inner_group_eyelets[s].children[0].value) {
          PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[1].text =
            inner_group_eyelets[s].children[2].text;
          PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[2].text =
            inner_group_eyelets_02[s].children[1].text;
          PARENT_OF_THIS_BUTTON.children[_sp_ind_inner].children[1].children[3].text =
            inner_group_eyelets_02[s].children[3].selection.text ;
            if (inner_group_eyelets_02[s].children[4].value ) {
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

  scroll_offset = Math.ceil(scrollGroup.children.length/8);
  scrollBar.value = 0;
}

new Module ();

W.show();

/////////////////////////////////// UI END ***********************

// ACTIONS AFTER UI IS CLOSED

delete_temporary_configurations();
delete_temporary_configurations();

function delete_temporary_configurations() {
  var FILE = new File((new File($.fileName)).parent + '/finish_configs/config.json');
  FILE.open("r");
  var json_unparsed = '';
  while(!FILE.eof)
  json_unparsed += FILE.readln();
  var json_parsed = JSON.parse(json_unparsed);
  FILE.close();

  var at_least_one = false;

  amount_of_t = 0;

  for (var i = 0; i < json_parsed.all.length; i++) {
    if (json_parsed.all[i].name.indexOf('Temporary') !== -1) {
      at_least_one = true;
      amount_of_t++;
      json_parsed.all.splice(i,1);
    }
  }

  if (at_least_one) {
    jsn = JSON.stringify(json_parsed);

    FILE.open("w");
    FILE.writeln('');
    FILE.close();

    FILE.open("e", "TEXT");
    FILE.writeln(jsn);
    FILE.close();

  }

}
