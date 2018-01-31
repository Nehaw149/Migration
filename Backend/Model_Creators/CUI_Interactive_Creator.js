var fs = require('fs');

var abstract_Model_Obj = JSON.parse(fs.readFileSync('../Models/AUI/Abstract_Model.json', 'utf-8'));
var style_Model_Str = '', events_Model_Str = '', sequence = 0

var key_Element_ID = '', key_Element_Name = '', key_Property_Name = '', key_Sub_Prop = ''
var element_Obj = {}, child_Obj = {}, style_Model_Obj = {}, event_Model_Obj = {}, sub_Property_Obj = {}
var element_Stack = [], sequence_Stack = [], object_STACK = []
var property_Obj = {}, popped_Obj = {}

var style_Array = [], event_Array = []

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
}

function generate_CUI_Model(abstract_Model) {
  var popped_Element = '', popped_Seq = 0
  if (sequence === 0) {
    sequence++
  }

  seq: for (key_Element_ID in abstract_Model) {
    //  key_Element_ID: Many Siblings possibles

    style_Model_Obj = {}
    event_Model_Obj = {}

    if (key_Element_ID != "_attributes" && key_Element_ID == sequence) {

      sequence++
      element_Obj = abstract_Model[key_Element_ID]

      name: for (key_Element_Name in element_Obj) {
        //  key_Element_Name: ONLY one always

        child_Obj = element_Obj[key_Element_Name]
        object_STACK.push(child_Obj)
        element_Stack.push(key_Element_Name)
        sequence_Stack.push(key_Element_ID)
      //  console.log(element_Stack)

        for (key_Property_Name in child_Obj) {

          if (key_Property_Name != "_attributes") {
            generate_CUI_Model(child_Obj)
          }
          if (key_Property_Name === "_attributes") {
            popped_Obj = object_STACK.pop()
            popped_Seq = sequence_Stack.pop()
            popped_Element = element_Stack.pop()
          //  console.log(popped_Element + " *** " + popped_Seq + " *** " + JSON.stringify(popped_Obj))

            for (var key_Attr in popped_Obj) {
              if (key_Attr === "_attributes") {
              //  console.log("****")
                prop_Obj = popped_Obj[key_Attr]

                set_Attributes(prop_Obj, ("id_"+ popped_Seq))
              //  console.log(element_Stack)
                break name
              }
            }
          }
        }
      }
    }
  }
}

function set_Attributes(prop_Obj, popped_Seq) {

  style_Model_Obj = { [popped_Seq]: { _attributes: { idm: {}, properties: {} } } }
  event_Model_Obj = { [popped_Seq]: { _attributes: { idm: {}, events: {} } } }

  //if "_attributes" found
  for (key_Sub_Prop in prop_Obj) {
    if (key_Sub_Prop === "idm") {
      style_Model_Obj[popped_Seq]._attributes.idm = prop_Obj[key_Sub_Prop]
      event_Model_Obj[popped_Seq]._attributes.idm = prop_Obj[key_Sub_Prop]
    }
    if (key_Sub_Prop === "properties") {
      style_Model_Obj[popped_Seq]._attributes.properties = prop_Obj[key_Sub_Prop]
    }
    if (key_Sub_Prop === "events") {
      event_Model_Obj[popped_Seq]._attributes.events = prop_Obj[key_Sub_Prop]
    }
  }
  style_Array.push(JSON.stringify(style_Model_Obj))
  event_Array.push(JSON.stringify(event_Model_Obj))
}
generate_CUI_Model(abstract_Model_Obj)

var STYLE_MODEL = {"STYLE": style_Array}
var EVENT_MODEL = {"EVENT": event_Array}

fs.writeFileSync("../Models/CUI/Interaction/CUI_Interaction_STYLE_Model.json", JSON.stringify(STYLE_MODEL))
fs.writeFileSync("../Models/CUI/Interaction/CUI_Interaction_EVENT_Model.json", JSON.stringify(EVENT_MODEL))

//console.log(style_Array)
//console.log("***********************")
//console.log(event_Array)
