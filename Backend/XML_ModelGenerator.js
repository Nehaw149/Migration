var fs = require('fs');
var XAML_json, XAML_ob, template_XAML_json, template_XAML_ob, element_json, model_json;
var winOb, dockOb, stackOb, buttonOb, labelOb, radioOb;
var sequence = 0;

fs.readFile('./Parsed_XAML1.json', 'utf-8', function (err, data) {
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
    for (var keys_XAML in XAMLob) {
      if (keys_XAML === "Window") {
        sequence++;
        winOb = { win_Ob : templateXAMLob.xaml.Elements.Window }
        winOb.seq = sequence 
        var windowAttObject = XAMLob[keys_XAML];
        for (var key_win in windowAttObject) {
          if (key_win === "_attributes") {
            var win_atts_attsObj = windowAttObject[key_win];
            for (var win_attr in win_atts_attsObj) {
              if (win_attr === "x:Class") {
                var Class = win_atts_attsObj[win_attr];
                winOb["x:Class"] = Class
              }
              if (win_attr === "xmlns") {
                var xmlns = win_atts_attsObj[win_attr];
                winOb["xmlns"] = xmlns
              }
              if (win_attr === "xmlns:x") {
                var x = win_atts_attsObj[win_attr];
                winOb["xmlns:x"] = xmlns
              }
              if (win_attr === "Title") {
                var Title = win_atts_attsObj[win_attr];
                winOb["Title"] = Title
              }
              if (win_attr === "Height") {
                var Height = win_atts_attsObj[win_attr];
                winOb["Height"] = Height
              }
              if (win_attr === "Width") {
                var Width = win_atts_attsObj[win_attr];
                winOb["Width"] = Width
              }
            }
          }
          if (key_win === "DockPanel") {
            var panel_Obj = windowAttObject[key_win];
            formatXAML_DockPanel(panel_Obj);
          }
          if (key_win === "StackPanel") {
            var panel_Obj = windowAttObject[key_win];
            formatXAML_StackPanel(panel_Obj);
          }
        }
      }
    }
    console.log(JSON.stringify(winOb));
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
  dockOb = { dock_Ob : templateXAMLob.xaml.Elements.formatXAML_DockPanel }

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

