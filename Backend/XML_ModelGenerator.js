var fs = require('fs');
var XAML_json = '', XAML_ob = {}, template_XAML_json = '', templateXAMLob = {}, model_json = {};
var winOb, child_Obj ;
var sequence = 0, win_flag = 0;
var windowAttObject

fs.readFile('./Parsed_XAML2.json', 'utf-8', function (err, data) {
  if (err)
    console.log(err);
  XAML_json = data.toString();
  XAML_ob = JSON.parse(XAML_json);
  formatXAML_window(XAML_ob);
})

function formatXAML_window(XAMLob) {
  fs.readFile('./TEMPLATE_XAML_tags.json', 'utf-8', function (err, data) {
    if (err)
      console.log(err);
    template_XAML_json = data.toString();
    templateXAMLob = JSON.parse(template_XAML_json);

    var windowAttObject = {}, win_atts_Obj = {}, key_win = '', keys_XAML, key_template = '';
    var win_attr = '', key_winOb_idm = '', key_winOb_prop = '', key_winOb_events = '', key_winOb_com_attr = '', key_winOb_com_events = '', key_winOb_text = '';
    var winOb_idm = {}, winOb_prop = {}, winOb_com_events = {}, winOb_com_attr = {}, winOb_event = {};
    for (key_win in windowAttObject) { delete windowAttObject[key_win]; key_win = '' }
    //for (key_win in winOb) { delete winOb[key_win]; key_win = '' }
    for (key_win in win_atts_Obj) { delete win_atts_Obj[key_win]; key_win = '' }
    var temp_com_attr_Obj = {}, temp_com_events_Obj = {}, temp_props_Obj = {}, temp_events_Obj = {}, temp_idm_Obj = {}, temp_ele_Obj = {}, temp_text_Obj = {};

    temp_com_attr_Obj = templateXAMLob.xaml.com_attr;
    temp_com_events_Obj = templateXAMLob.xaml.com_events;
    temp_idm_Obj = templateXAMLob.xaml.idm;
    temp_ele_Obj = templateXAMLob.xaml.Elements;

    XAML_Object: for (keys_XAML in XAMLob) {
      elements: for (key_template in temp_ele_Obj) {
        if (keys_XAML === key_template) {
          sequence++;
          temp_props_Obj = templateXAMLob.xaml.Elements[keys_XAML].properties;
          temp_events_Obj = templateXAMLob.xaml.Elements[keys_XAML].events;
          temp_text_Obj = templateXAMLob.xaml.Elements[keys_XAML];
          windowAttObject = XAMLob[keys_XAML];

          arrayAttr: for (var len = 0; len < windowAttObject.length; len++) {
            var attribute_Length = windowAttObject.length
            if (len >= 0) {
              setAttributes(windowAttObject[len])
              sequence++              
            }
            else {
              break arrayAttr;
            }
          }
          setAttributes(windowAttObject)
          
          function setAttributes(windowAttObject) {
            if(winOb === {} && win_flag === 0){
              winOb = {xaml: [sequence] }
              win_flag++
            }else{
              winOb = {xaml: [sequence][winOb] }
            //  winOb = {xaml: [winOb]}
            }
            //console.log(JSON.stringify(winOb))
            attribute:  for (key_win in windowAttObject) {
              win_atts_Obj = windowAttObject[key_win];
              key_winOb_text = ''
              if (key_win === "_text") {
                _text: for (key_winOb_text in temp_text_Obj) {
                  if (key_win === key_winOb_text) {
                    winOb[sequence][keys_XAML]._attributes._text = windowAttObject[key_win];
                    break _text
                  }
                }
              }
            
              if (key_win === "_attributes") {
                winOb[sequence] = { [keys_XAML]: { "_attributes": templateXAMLob.xaml.Elements[keys_XAML] } }
                winOb[sequence][keys_XAML]._attributes.seq = sequence

                for (win_attr in win_atts_Obj) {
                  key_winOb_idm = ''
                  idm: for (key_winOb_idm in temp_idm_Obj) {
                    //idm
                    if (win_attr === key_winOb_idm) {
                      winOb[sequence][keys_XAML]._attributes._text = win_atts_Obj[win_attr];
                      break idm
                    }
                  }
                  key_winOb_com_attr = ''
                  com_attr: for (key_winOb_com_attr in temp_com_attr_Obj) {
                    if (win_attr === key_winOb_com_attr) {
                      winOb[sequence][keys_XAML]._attributes.properties[win_attr] = win_atts_Obj[win_attr];
                    }
                  }
                  key_winOb_com_events = ''
                  com_events: for (key_winOb_com_events in temp_com_events_Obj) {
                    //com_events
                    if (win_attr === key_winOb_com_events) {
                      winOb[sequence][keys_XAML]._attributes.events[win_attr] = win_atts_Obj[win_attr];
                    }
                  }
                  key_winOb_prop = ''
                  properties: for (key_winOb_prop in temp_props_Obj) {
                    if (win_attr === key_winOb_prop) {
                      winOb[sequence][keys_XAML]._attributes.properties[win_attr] = win_atts_Obj[win_attr];
                    }
                  }
                  key_winOb_events = ''
                  events: for (key_winOb_events in temp_events_Obj) {
                    //events
                    if (win_attr === key_winOb_events) {
                      winOb[sequence][keys_XAML]._attributes.events[win_attr] = win_atts_Obj[win_attr];
                    }
                  }
                }
                for (var key_clearVal1 in winOb) {
                  for (var key_clearVal2 in winOb[key_clearVal1]) {
                    for (var key_clearVal3 in winOb[key_clearVal1][key_clearVal2]) {
                      for (var key_clearVal4 in winOb[key_clearVal1][key_clearVal2][key_clearVal3]) {
                        for (var key_clearVal5 in winOb[key_clearVal1][key_clearVal2][key_clearVal3][key_clearVal4]) {
                          var ob_attr1 = winOb[key_clearVal1][key_clearVal2][key_clearVal3][key_clearVal4]
                          if (ob_attr1[key_clearVal5] === "") {
                            delete ob_attr1[key_clearVal5]
                          }
                        }
                      }
                    }
                  }
                }
                 read_window_Obj(winOb)              
              }
              break attribute
            }
            //  read_window_Obj(winOb) 
            nodes: for (key_win in windowAttObject) {
              if (key_win != "_attributes" && key_win != "_text") {
                var parsedEleOb = windowAttObject                
                formatXAML_window(parsedEleOb)
                break;
              }
            }
          }
        }
      }
    }
    function read_window_Obj(winOb){
      console.log(JSON.stringify(winOb));
    }
  })
}

function error_outScoped() {
  // TODO
  console.log('ERROR: ELEMENTS OUT OF SCOPE.')
}



