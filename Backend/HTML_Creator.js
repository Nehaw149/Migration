var fs = require('fs');
var html, js, css, cui_html = '', cui_start = '', cui_end = '';
var XAML_Model_Obj = {}, XAML_Obj = {}, next_Obj = {}, html_JSON = {}
var sequence = 0
var key_XAML_Model = '', key_tag = '', key_XAML_tag = '', key_next_Obj = '', key_temp_html = ''

var startStr = '', endStr = ''

XAML_Model_Obj = JSON.parse(fs.readFileSync('./XAML_Model_final.json', 'utf-8'));
XAML_Model_CUI_Obj = JSON.parse(fs.readFileSync('./XAML_Model_CUI_1.json', 'utf-8'));

var cui_Obj = XAML_Model_CUI_Obj;
var data = fs.readFileSync('./Migrated_template.html', 'utf8');
var temp_xaml_html_Obj = JSON.parse(fs.readFileSync('./Template_HTML_XAML_MAPPING.json', 'utf8'));

function generate_CUI(duplicateJSON, startStr, endStr){
  sequence++;
  for (key_XAML_Model in duplicateJSON) {
    if (key_XAML_Model == sequence) {
      XAML_Obj = duplicateJSON[key_XAML_Model]
      if (isEmpty(XAML_Obj) === false) {
        XAML:for (key_tag in XAML_Obj) {
          TEMP_Start:for (key_temp_html in temp_xaml_html_Obj) {
            if(key_temp_html === key_tag){
              //getting a single tag
              var id_text = " id='" + sequence + "' ";
              cui_start = JSON.stringify(temp_xaml_html_Obj[key_temp_html].Start)
              cui_start = cui_start.replace(/["']/g, "");

              if(cui_start.includes(" ")){
                cui_start = cui_start.replace(" ", id_text )
                startStr = startStr.concat(cui_start)
              }              
            break TEMP_Start             
            }
          }
          child_Obj = XAML_Obj[key_tag]
          if(isEmpty(XAML_Obj) != true){
          //  console.log(JSON.stringify(child_Obj))
            generate_CUI(child_Obj, startStr, endStr)
          }
          key_temp_html = ''
          TEMP_End:for (key_temp_html in temp_xaml_html_Obj) {
            if(key_temp_html === key_tag){
              //getting a single tag
              cui_end = JSON.stringify(temp_xaml_html_Obj[key_temp_html].End)           
              endStr = endStr.concat(cui_end)
            //  console.log(endStr)
              break TEMP_End             
            }
          }
        } 
      }
      else {
        sequence++
      }
    }
  }
//  console.log(JSON.stringify(duplicateJSON))
console.log(startStr)

cui_html = startStr.concat(endStr)
//console.log(cui_html)

}
generate_CUI(cui_Obj, startStr, endStr)


// fs.writeFileSync('./XAML_CUI.html', cui_html)
// fs.writeFileSync('./XAML_FUI.html', html)
// fs.writeFileSync('./XAML_FUI.js', js)
// fs.writeFileSync('./XAML_FUI.css', css)
//generate_Web(XAML_Model_Obj);

// function generate_Web(XAML_Model_Obj) {
//   sequence++;

//   for (key_XAML_Model in XAML_Model_Obj) {
//     if (key_XAML_Model == sequence) {
//       XAML_Obj = XAML_Model_Obj[key_XAML_Model]
//       console.log(key_XAML_Model + '***')
//       key_tag = ''
//       cui_html = html;
//       html = ''
      
//       if (isEmpty(XAML_Obj) === false) {
//         identifyTags(XAML_Obj, sequence, html)
//       }
//       else {
//         sequence++
//       }

//       for (key_XAML_tag in XAML_Obj) {
//         next_Obj = XAML_Obj[key_XAML_tag]
//         generate_Web(next_Obj)
//       }
//     }
//   }
//   console.log(JSON.stringify(html_JSON))
// }

// function identifyTags(XAML_Obj, sequence, html) {
//   for (key_tag in XAML_Obj) {
//     if (key_tag === 'Window') {
//       html = '<div id="'+sequence+'"></div>'            
//     } 
//     if (key_tag === 'DockPanel') {
//       html = '<div id="'+sequence+'"></div>'            
//     }
//     if (key_tag === 'StackPanel') {
//       html = '<div id="'+sequence+'"></div>'            
//     }
//     if (key_tag === 'Label') {
//     } 
//     if (key_tag === 'PasswordBox') {
//     } 
//     if (key_tag === 'TextBlock') {
//     } 
//     if (key_tag === 'RadioButton') {
//     } 
//     if (key_tag === 'CheckBox') {
//     } 
//     if (key_tag === 'Button') {
//     } 
//     if (key_tag === 'Image') {
//     }
//   }
// }

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
    //  console.log('false')
    return false;
  }
//  console.log('true')
  return true;
}

// function formatXAML_StackPanel(stackPanel_Obj) {
//   for (var key_stack in stackPanel_Obj) {
//     if (key_stack === "_attributes") {
//       var stack_attrs_Obj = stackPanel_Obj[key_stack];
//       for (var stack_attr in stack_attrs_Obj) {
//         if (stack_attr === "Margin") {
//           console.log(stack_attr);
//         }
//       }
//     }
//     if (key_stack === "_text") {
//       console.log(key_stack);
//     }
//     if (key_stack != "_attributes" && key_stack != "_text") {
//       console.log(key_stack);
//       var control_Obj = stackPanel_Obj[key_stack];
//       identifyControl(key_stack, control_Obj)
//     }
//   }
// }
// function formatXAML_DockPanel(dockPanel_Obj) {
//   dockOb = { dock_Ob: templateXAMLob.xaml.Elements.formatXAML_DockPanel }

//   for (var key_dock in dockPanel_Obj) {
//     if (key_dock === "_attributes") {
//       var dock_attrs_Obj = dockPanel_Obj[key_dock];
//       for (var dock_attr in dock_attrs_Obj) {
//         var each_Dock_att = dock_attrs_Obj[dock_attr]
//         if (dock_attr === "LastChildFill") {
//           console.log("LastChildFill");
//         }
//         if (dock_attr === "LastChildFill") {
//           console.log("LastChildFill");
//         }
//       }
//     }
//     if (key_dock != "_attributes" && key_dock != "_text") {
//       console.log(key_dock);
//       var control_Obj = dockPanel_Obj[key_dock];
//       identifyControl(key_dock, control_Obj)
//     }
//   }
// }
// function identifyControl(ctrl_Name, ctrl_Obj) {
//   console.log('***' + ctrl_Name);
//   for (var len_ctrl in ctrl_Obj) {
//     if (ctrl_Name === "Label") {
//       console.log('in label')
//       formatXAML_Label(ctrl_Obj[len_ctrl])
//     }
//     if (ctrl_Name === "RadioButton") {
//       console.log('in RadioButton')
//       formatXAML_RadioButton(ctrl_Obj[len_ctrl])
//     }
//     if (ctrl_Name === "Button") {
//       console.log('in Button')
//       formatXAML_Button(ctrl_Obj[len_ctrl])
//     }
//   }
// }
// function formatXAML_Label(label_ctrl_Obj) {
//   for (var key_label in label_ctrl_Obj) {
//     if (key_label === "_attributes") {
//       for (var label_attr in label_ctrl_Obj[key_label]) {
//         if (label_attr === 'FontWeight') {
//           console.log(label_attr);

//         }
//       }
//     }
//     if (key_label === "_text") {

//     }
//     if (key_label != "_attributes" && key_label != "_text") {

//     }
//   }
// }
// function formatXAML_RadioButton(radiobtn_ctrl_Obj) {
//   for (var key_radio in radiobtn_ctrl_Obj) {
//     if (key_radio === "_attributes") {
//       console.log('in RadioButton');
//       //radio_attr
//     }
//     if (key_radio === "_text") {
//       console.log('in RadioButton');

//     }
//     if (key_radio != "_attributes" && key_radio != "_text") {
//       console.log('in RadioButton');

//     }
//   }
// }
// function formatXAML_Button(button_control_Obj) {
//   for (var key_button in button_control_Obj) {
//     if (key_button === "_attributes") {
//       console.log(key_button);
//       var cont_Obj = button_control_Obj[key_button];
//       for (var button_attr in cont_Obj) {
//         if (button_attr === "DockPanel.Dock") {
//           console.log(button_attr);
//         }
//         if (button_attr === "HorizontalAlignment") {
//           console.log(button_attr);
//         }
//         if (button_attr === "ToolTip") {
//           console.log(button_attr);
//         }
//         if (button_attr === "VerticalAlignment") {
//           console.log(button_attr);
//         }
//       }
//     }
//     if (key_button === "_text") {
//       console.log(key_button);
//     }
//     if (key_button != "_text" && key_button != "_attributes") {
//       console.log(key_button);
//     }
//   }
// }
// function formatXAML_StackPanel(stackPanel_Obj) {
//   for (var key_stack in stackPanel_Obj) {
//     if (key_stack === "_attributes") {
//       var stack_attrs_Obj = stackPanel_Obj[key_stack];
//       for (var stack_attr in stack_attrs_Obj) {
//         if (stack_attr === "Margin") {
//           console.log(stack_attr);
//         }
//       }
//     }
//     if (key_stack === "_text") {
//       console.log(key_stack);
//     }
//     if (key_stack != "_attributes" && key_stack != "_text") {
//       console.log(key_stack);
//       var control_Obj = stackPanel_Obj[key_stack];
//       identifyControl(key_stack, control_Obj)
//     }
//   }
// }
// function formatXAML_DockPanel(dockPanel_Obj) {
//   dockOb = { dock_Ob: templateXAMLob.xaml.Elements.formatXAML_DockPanel }

//   for (var key_dock in dockPanel_Obj) {
//     if (key_dock === "_attributes") {
//       var dock_attrs_Obj = dockPanel_Obj[key_dock];
//       for (var dock_attr in dock_attrs_Obj) {
//         var each_Dock_att = dock_attrs_Obj[dock_attr]
//         if (dock_attr === "LastChildFill") {
//           console.log("LastChildFill");
//         }
//         if (dock_attr === "LastChildFill") {
//           console.log("LastChildFill");
//         }
//       }
//     }
//     if (key_dock != "_attributes" && key_dock != "_text") {
//       console.log(key_dock);
//       var control_Obj = dockPanel_Obj[key_dock];
//       identifyControl(key_dock, control_Obj)
//     }
//   }
// }
// function identifyControl(ctrl_Name, ctrl_Obj) {
//   console.log('***' + ctrl_Name);
//   for (var len_ctrl in ctrl_Obj) {
//     if (ctrl_Name === "Label") {
//       console.log('in label')
//       formatXAML_Label(ctrl_Obj[len_ctrl])
//     }
//     if (ctrl_Name === "RadioButton") {
//       console.log('in RadioButton')
//       formatXAML_RadioButton(ctrl_Obj[len_ctrl])
//     }
//     if (ctrl_Name === "Button") {
//       console.log('in Button')
//       formatXAML_Button(ctrl_Obj[len_ctrl])
//     }
//   }
// }
// function formatXAML_Label(label_ctrl_Obj) {
//   for (var key_label in label_ctrl_Obj) {
//     if (key_label === "_attributes") {
//       for (var label_attr in label_ctrl_Obj[key_label]) {
//         if (label_attr === 'FontWeight') {
//           console.log(label_attr);

//         }
//       }
//     }
//     if (key_label === "_text") {

//     }
//     if (key_label != "_attributes" && key_label != "_text") {

//     }
//   }
// }
// function formatXAML_RadioButton(radiobtn_ctrl_Obj) {
//   for (var key_radio in radiobtn_ctrl_Obj) {
//     if (key_radio === "_attributes") {
//       console.log('in RadioButton');
//       //radio_attr
//     }
//     if (key_radio === "_text") {
//       console.log('in RadioButton');

//     }
//     if (key_radio != "_attributes" && key_radio != "_text") {
//       console.log('in RadioButton');

//     }
//   }
// }
// function formatXAML_Button(button_control_Obj) {
//   for (var key_button in button_control_Obj) {
//     if (key_button === "_attributes") {
//       console.log(key_button);
//       var cont_Obj = button_control_Obj[key_button];
//       for (var button_attr in cont_Obj) {
//         if (button_attr === "DockPanel.Dock") {
//           console.log(button_attr);
//         }
//         if (button_attr === "HorizontalAlignment") {
//           console.log(button_attr);
//         }
//         if (button_attr === "ToolTip") {
//           console.log(button_attr);
//         }
//         if (button_attr === "VerticalAlignment") {
//           console.log(button_attr);
//         }
//       }
//     }
//     if (key_button === "_text") {
//       console.log(key_button);
//     }
//     if (key_button != "_text" && key_button != "_attributes") {
//       console.log(key_button);
//     }
//   }
// }

// function writeJSON(jsonOut) {
//   fs.writeFile("./Parsed_JSON.json", jsonOut, (err) => {
//     if (err) {
//       console.error(err);
//       return;
//     };
//   });
// }
// function generate_HTML(XAML_Model_ob){

// }
// function generate_Widget(){

// }
// function generate_Elements(){

// }
// function assign_attributes(){

// }