var fs = require('fs');
var convert = require('xml-js');

var XAML_json = '', XAML_ob = {}, template_XAML_json = '', templateXAMLob = {}, tagsModel_Obj = {};
var winOb;
var sequence = 0;
var windowAttObject

var migratedXAMLObj = {};

var XAML_ob = JSON.parse(fs.readFileSync('./Parsed_XAML2.json', 'utf-8'));
var templateXAMLob = JSON.parse(fs.readFileSync('./TEMPLATE_XAML_tags.json', 'utf-8'));

function formatXAML_window(XAMLob, migratedXAMLObj) {
  var windowAttObject = {}, win_atts_Obj = {}, key_win = '', keys_XAML = '', key_template = '';
  var win_attr = '', key_winOb_idm = '', key_winOb_prop = '', key_winOb_events = '', key_winOb_com_attr = '', key_winOb_com_events = '', key_winOb_text = '';
  var winOb_idm = {}, winOb_prop = {}, winOb_com_events = {}, winOb_com_attr = {}, winOb_event = {};
  for (key_win in windowAttObject) { delete windowAttObject[key_win]; key_win = '' }
  for (key_win in winOb) { delete winOb[key_win]; key_win = '' }
  for (key_win in win_atts_Obj) { delete win_atts_Obj[key_win]; key_win = '' }
  var temp_com_attr_Obj = {}, temp_com_events_Obj = {}, temp_props_Obj = {}, temp_events_Obj = {}, temp_idm_Obj = {}, temp_ele_Obj = {}, temp_text_Obj = {};

  temp_ele_Obj = templateXAMLob.xaml.Elements;

  for (keys_XAML in XAMLob) {
    for (key_template in temp_ele_Obj) {
      if (keys_XAML === key_template) {
        sequence++
        windowAttObject = XAMLob[keys_XAML];
        tagsModel_Obj = { [sequence]: [keys_XAML] }

        // arrayAttr: for (var len = 0; len < windowAttObject.length; len++) {
        //   if (len >= 0) {
        //     noAttributes(windowAttObject[len], migratedXAMLObj, sequence, keys_XAML)
        //     sequence++
        //   }
        //   else {
        //     break arrayAttr;
        //   }
        // }
        noAttributes(windowAttObject, migratedXAMLObj, sequence, keys_XAML)
        function noAttributes(windowAttObject, migratedXAMLObj, sequence, keys_XAML) {
          for (key_win in winOb) { delete winOb[key_win]; key_win = '' }
          migratedXAMLObj = {[sequence] : {}};
          winOb = { [sequence]: keys_XAML }
          //  console.log(JSON.stringify(winOb))

          for (key_win in windowAttObject) {
            // adding the object to migratedXAMLObj
            // if (key_win != "_attributes" && key_win != "_text" && key_win) {
            //   migratedXAMLObj[sequence] = winOb[sequence];
            //   console.log(JSON.stringify(migratedXAMLObj)+JSON.stringify(winOb))
            // }
            if (key_win != "_attributes" && key_win != "_text" && key_win) {
              var parsedEleOb = windowAttObject
              migratedXAMLObj[sequence] = winOb[sequence];
              console.log(JSON.stringify(migratedXAMLObj))
              formatXAML_window(parsedEleOb, migratedXAMLObj[sequence][keys_XAML])
              break;
            }
          }
        }
      }
    }
  }
}


formatXAML_window(XAML_ob, migratedXAMLObj);

//printing the migrated obj
fs.writeFileSync('./XAML_Model_CUI.json', JSON.stringify(migratedXAMLObj, null, 2))

var result1 = convert.json2xml(JSON.stringify(migratedXAMLObj, null, 2), { compact: true, spaces: 4 });
//console.log(result1);
//fs.writeFileSync('./XAML_Model_final.xml', result1)

//console.log('\n\n\n~~~~~~~~~~~~~~~~~migrated obj~~~~~~~~~~~~~~~~~~~\n');
//console.log(JSON.stringify(migratedXAMLObj, null, 2));
//console.log('\n~~~~~~~~~~~~~~~~~migrated obj~~~~~~~~~~~~~~~~~~~\n');

function error_outScoped() {
  // TODO
  console.log('ERROR: ELEMENTS OUT OF SCOPE.')
}
function error_invalidXAML() {
  // TODO
  console.log('ERROR: INVALID XAML File.')
}

function createJson(k, val) {
  var json_Model1 = { k: val }
  // var string = JSON.stringify(json_Model1);
  // console.log(JSON.parse(string));
  writeJSON(json_Model1);
}
function writeJSON(jsonOut) {
  fs.writeFile("./Parsed_JSON.json", jsonOut, (err) => {
    if (err) {
      console.error(err);
      return;
    };
  });
}