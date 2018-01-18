var fs = require('fs');
var html, js, css, cui_html = '', polymer_cui_html = ''
var XAML_Model_Obj = {}, XAML_Obj = {}, next_Obj = {}, html_JSON = {}
var sequence = 1
var key_XAML_Model = '', key_Child = '', key_tag = '', key_XAML_tag = '', key_next_Obj = '', key_temp_html = ''

var startStr = '', mergedStr = ''
var xaml_Tag_Stack = [], end_Tag_Stack = [], Seq_Stack = [], Obj_Stack = []

cui_html = fs.readFileSync('./Template_CUI_HTML.html','utf-8')
polymer_cui_html = fs.readFileSync('./Template_Polymer_CUI_HTML.html','utf-8')

XAML_Model_Obj = JSON.parse(fs.readFileSync('./XAML_Model_final.json', 'utf-8'));
XAML_Model_CUI_Obj = JSON.parse(fs.readFileSync('./XAML_Model_CUI_1.json', 'utf-8'));

var cui_Obj = XAML_Model_CUI_Obj;
var temp_xaml_html_Obj = JSON.parse(fs.readFileSync('./Template_HTML_XAML_MAPPING.json', 'utf8'));

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}

function appendStart_tag(key_Tag_Str, start_Tag_Str) {
  var cui_start = ''
  if (temp_xaml_html_Obj.hasOwnProperty(key_Tag_Str)) {
    //getting a single tag
    var id_text = " id='" + sequence + "' ";
    cui_start = JSON.stringify(temp_xaml_html_Obj[key_Tag_Str].Start)
    cui_start = cui_start.replace(/["]/g, "");

    if (cui_start.includes(" ")) {
      cui_start = cui_start.replace(" ", id_text)
      start_Tag_Str = start_Tag_Str.concat(cui_start)
    }
  }
  return start_Tag_Str
}

function appendEnd_tag(key_Tag_Str, start_Tag_Str) {
  var cui_end = ''
  if (temp_xaml_html_Obj.hasOwnProperty(key_Tag_Str)) {
    cui_end = JSON.stringify(temp_xaml_html_Obj[key_Tag_Str].End)
    cui_end = cui_end.replace(/["]/g, "");
    start_Tag_Str = start_Tag_Str.concat(cui_end)
  }
  return start_Tag_Str
}

function generate_CUI(element_Obj, startStr) {

  seq: for (key_XAML_Model in element_Obj) {
    if (key_XAML_Model == sequence) {
      XAML_Obj = element_Obj[key_XAML_Model]

      //Obj_Stack.push(XAML_Obj)

      XAML: for (key_tag in XAML_Obj) {
        //***THIS CAN BE MORE THAN ONE */

        //take an array of all tags
        child_Obj = XAML_Obj[key_tag]

        //start tag call
        if (temp_xaml_html_Obj.hasOwnProperty(key_tag)) {
          //pop the last element out of the array
          xaml_Tag_Stack.push(key_tag)
          Seq_Stack.push(sequence)
          startStr = appendStart_tag(key_tag, startStr)
        }

        function children_Tag(Children_Obj, Seq_Stack, xaml_Tag_Stack) {
          //start tag call
          for (key_Chilren in Children_Obj) {
            if (temp_xaml_html_Obj.hasOwnProperty(key_tag)) {
              //pop the last element out of the array
              xaml_Tag_Stack.push(key_tag)
              Seq_Stack.push(sequence)
              startStr = appendStart_tag(key_tag, startStr)
            }

            //end tag call
            if (temp_xaml_html_Obj.hasOwnProperty(key_tag)) {
              startStr = appendEnd_tag(key_tag, startStr)

              //pop the last element out of the array
              xaml_Tag_Stack.pop(key_tag)
              console.log(startStr)
            }


            console.log(JSON.stringify(child_Obj))
          }
        }

        //CHILD Loop call
        if (child_Obj) {
          children_Tag(child_Obj)
          for (key_Child in child_Obj) {
            //it will execute for all children

            if (isEmpty(child_Obj) != true) {
              //console.log(JSON.stringify(child_Obj))
              generate_CUI(child_Obj, startStr)
            }
          }
        }

        //end tag call
        if (temp_xaml_html_Obj.hasOwnProperty(key_tag)) {
          startStr = appendEnd_tag(key_tag, startStr)

          //pop the last element out of the array
          xaml_Tag_Stack.pop(key_tag)
          console.log(startStr)
        }

        //  console.log(startStr)
      }
    }
    sequence++
  }
  return startStr
}
console.log(generate_CUI(cui_Obj, mergedStr))
