var fs = require('fs');

var abstract_Model_Obj = JSON.parse(fs.readFileSync('../Models/AUI/Abstract_Model.json', 'utf-8'));
var cui_Model_Str = '', style_Model_Str = '', sequence = 0

var key_Element_ID = '', key_Element_Name = '', key_Property_Name = ''
var element_Obj = {}, elements_Child_Obj = {}

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)){
      return false;
    }
  }
  return true;
}

function generate_CUI_Model(abstract_Model) {
  if (sequence === 0) { sequence++ }

  for (key_Element_ID in abstract_Model) {
    //  key_Element_ID: Many Siblings possible
    if(key_Element_ID === "_attributes") {
      //  delete if "_attributes" found
      delete abstract_Model._attributes
    }
    if (key_Element_ID == sequence ) {
      element_Obj = abstract_Model[key_Element_ID]
      for (key_Element_Name in element_Obj) {
        //  key_Element_Name: ONLY one always
        sequence++
        //  console.log(key_Element_Name)
        elements_Child_Obj = element_Obj[key_Element_Name]

        if(!isEmpty(elements_Child_Obj)){
          generate_CUI_Model(elements_Child_Obj)
        }
      }
    }
  }
}

generate_CUI_Model(abstract_Model_Obj)
fs.writeFileSync("../Models/CUI/CUI_Model.json", JSON.stringify(abstract_Model_Obj))
