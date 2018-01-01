var fs = require('fs');
var XAML_json, XAML_ob, template_XAML_json, template_XAML_ob, element_json, model_json;
var winOb, dockOb, stackOb, buttonOb, labelOb, radioOb;
var sequence = 0;

fs.readFile('./Parsed_XAML2.json', 'utf-8', function (err, data) {
  if (err)
    console.log(err);
  XAML_json = data.toString();
  XAML_ob = JSON.parse(XAML_json);

  fs.readFile('./TEMPLATE_XAML_tags.json', 'utf-8', function (err, data) {
    if (err)
      console.log(err);
    template_XAML_json = data.toString();
    template_XAML_ob = JSON.parse(template_XAML_json);
    formatXAML_window(XAML_ob, template_XAML_ob);
  })
})

function formatXAML_window(XAMLob, templateXAMLob) {
  XAML_Object: for (var keys_XAML in XAMLob) {
    elements:  for (var key_template in templateXAMLob.xaml.Elements) {
      if (keys_XAML === key_template) {
        sequence++;
        var flag = 0
        var windowAttObject = XAMLob[keys_XAML];
        for (var key_win in windowAttObject) {
          flag++
          var childLen = key_win.length
          //  console.log(childLen);
          var childLen_Count = childLen
          var win_atts_attsObj = windowAttObject[key_win];
          if (key_win === "_attributes") {
            childLen_Count--
            winOb = { [keys_XAML]: { "_attributes": templateXAMLob.xaml.Elements[keys_XAML] } }
            winOb[keys_XAML]._attributes.seq = sequence
            
            for (var win_attr in win_atts_attsObj) {
              idm:  for (var key_winOb_idm in templateXAMLob.xaml.idm) {
                //idm
                if (win_attr === key_winOb_idm) {
                  var winOb_idm = win_atts_attsObj[win_attr];
                  winOb[keys_XAML]._attributes._text[win_attr] = winOb_idm
                }else{
                  break idm;
                }
                
              }
              properties: for (var key_winOb_prop in templateXAMLob.xaml.Elements[keys_XAML].properties) {
                //properties
                if (win_attr === key_winOb_prop) {
                  var winOb_prop = win_atts_attsObj[win_attr];
                  winOb[keys_XAML]._attributes.properties[win_attr] = winOb_prop
                }
              }
              events: for (var key_winOb_events in templateXAMLob.xaml.Elements[keys_XAML].events) {
                //events
                if (win_attr === key_winOb_events) {
                  var winOb_event = win_atts_attsObj[win_attr];
                  winOb[keys_XAML]._attributes.events[win_attr] = winOb_event
                }
              }
              com_attr: for (var key_winOb_com_attr in templateXAMLob.xaml.com_attr) {
                if (win_attr === key_winOb_com_attr) {
                  var winOb_com_attr = win_atts_attsObj[win_attr];
                  winOb[keys_XAML]._attributes.properties[win_attr] = winOb_com_attr
                }
                
              }
              com_events: for (var key_winOb_com_events in templateXAMLob.xaml.com_events) {
                if (win_attr === key_winOb_com_events) {
                  var winOb_com_events = win_atts_attsObj[win_attr];
                  winOb[keys_XAML]._attributes.events[win_attr] = winOb_com_events
                }
                
              }
            }
            for (var key_clearVal1 in winOb) {
              for (var key_clearVal2 in winOb[key_clearVal1]) {
                for (var key_clearVal3 in winOb[key_clearVal1][key_clearVal2]) {
                  for (var key_clearVal4 in winOb[key_clearVal1][key_clearVal2][key_clearVal3]) {
                    var ob_attr1 = winOb[key_clearVal1][key_clearVal2][key_clearVal3]
                    if (ob_attr1[key_clearVal4] === "") {
                      delete ob_attr1[key_clearVal4]
                    }
                  }
                }
              }
            }
            console.log(JSON.stringify(winOb))
          }
          if(key_win === "_text"){
            var winOb_text = win_atts_attsObj[key_win];

          //  console.log(JSON.stringify(winOb_text))

            for (var key_winOb_text in templateXAMLob.xaml.Elements[keys_XAML]._text) {
              if (key_win === key_winOb_text) {
              //  var winOb_text = win_atts_attsObj[key_win];
                winOb[keys_XAML]._attributes._text[key_win] = winOb_text
              }
            }
          }
          if (key_win != "_attributes" && key_win!= "_text" && childLen_Count > 0) {
            childLen_Count--
            var parsedEleOb = windowAttObject
            //  console.log(JSON.stringify(parsedEleOb) + key_win)
            formatXAML_window(parsedEleOb, templateXAMLob)
          }

        }
      }
    }    
  }
  //  console.log(JSON.stringify(winOb));
}

function error_outScoped() {
  // TODO
  console.log('ERROR: ELEMENTS OUT OF SCOPE.')
}

function formatXAML_StackPanel(stackPanel_Obj) {
  for (var key_stack in stackPanel_Obj) {
    if (key_stack === "_attributes") {
      var stack_attrs_Obj = stackPanel_Obj[key_stack];
      for (var stack_attr in stack_attrs_Obj) {
        if (stack_attr === "Margin") {
          console.log(stack_attr);
        }
      }
    }
    if (key_stack === "_text") {
      console.log(key_stack);
    }
    if (key_stack != "_attributes" && key_stack != "_text") {
      console.log(key_stack);
      var control_Obj = stackPanel_Obj[key_stack];
      identifyControl(key_stack, control_Obj)
    }
  }
}
function formatXAML_DockPanel(dockPanel_Obj) {
  dockOb = { dock_Ob: templateXAMLob.xaml.Elements.formatXAML_DockPanel }

  for (var key_dock in dockPanel_Obj) {
    if (key_dock === "_attributes") {
      var dock_attrs_Obj = dockPanel_Obj[key_dock];
      for (var dock_attr in dock_attrs_Obj) {
        var each_Dock_att = dock_attrs_Obj[dock_attr]
        if (dock_attr === "LastChildFill") {
          console.log("LastChildFill");
        }
        if (dock_attr === "LastChildFill") {
          console.log("LastChildFill");
        }
      }
    }
    if (key_dock != "_attributes" && key_dock != "_text") {
      console.log(key_dock);
      var control_Obj = dockPanel_Obj[key_dock];
      identifyControl(key_dock, control_Obj)
    }
  }
}
function identifyControl(ctrl_Name, ctrl_Obj) {
  console.log('***' + ctrl_Name);
  for (var len_ctrl in ctrl_Obj) {
    if (ctrl_Name === "Label") {
      console.log('in label')
      formatXAML_Label(ctrl_Obj[len_ctrl])
    }
    if (ctrl_Name === "RadioButton") {
      console.log('in RadioButton')
      formatXAML_RadioButton(ctrl_Obj[len_ctrl])
    }
    if (ctrl_Name === "Button") {
      console.log('in Button')
      formatXAML_Button(ctrl_Obj[len_ctrl])
    }
  }
}
function formatXAML_Label(label_ctrl_Obj) {
  for (var key_label in label_ctrl_Obj) {
    if (key_label === "_attributes") {
      for (var label_attr in label_ctrl_Obj[key_label]) {
        if (label_attr === 'FontWeight') {
          console.log(label_attr);

        }
      }
    }
    if (key_label === "_text") {

    }
    if (key_label != "_attributes" && key_label != "_text") {

    }
  }
}
function formatXAML_RadioButton(radiobtn_ctrl_Obj) {
  for (var key_radio in radiobtn_ctrl_Obj) {
    if (key_radio === "_attributes") {
      console.log('in RadioButton');
      //radio_attr
    }
    if (key_radio === "_text") {
      console.log('in RadioButton');

    }
    if (key_radio != "_attributes" && key_radio != "_text") {
      console.log('in RadioButton');

    }
  }
}
function formatXAML_Button(button_control_Obj) {
  for (var key_button in button_control_Obj) {
    if (key_button === "_attributes") {
      console.log(key_button);
      var cont_Obj = button_control_Obj[key_button];
      for (var button_attr in cont_Obj) {
        if (button_attr === "DockPanel.Dock") {
          console.log(button_attr);
        }
        if (button_attr === "HorizontalAlignment") {
          console.log(button_attr);
        }
        if (button_attr === "ToolTip") {
          console.log(button_attr);
        }
        if (button_attr === "VerticalAlignment") {
          console.log(button_attr);
        }
      }
    }
    if (key_button === "_text") {
      console.log(key_button);
    }
    if (key_button != "_text" && key_button != "_attributes") {
      console.log(key_button);
    }
  }
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

