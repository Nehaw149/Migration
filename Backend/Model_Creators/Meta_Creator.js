var fs = require('fs')
var GenerateSchema = require('generate-schema')
// var Validator = require('jsonschema').Validator
// var v = new Validator()

var chai = require('chai');
var expect = chai.expect
chai.use(require('chai-json-schema'));

var schema = JSON.parse(fs.readFileSync("../Models/META/MetaSchema.json", "utf-8"))
var correct_AUI = JSON.parse(fs.readFileSync("../Models/AUI/Abstract_Model.json", ""))
var correct_AUI1 = { "65": { "Window": { "45": { "Window": { "_attributes": {} } }, "55": { "DockPanel": { "894": { "Window": { "_attributes": {} } }, "_attributes": {} } }, "_attributes": {} } } }
var Meta_Element_Obj = {}, properties_Obj = {}, events_Obj = {}
var key_Elements = '', properties_Str = '', events_Str = ''

var template_XAML_Obj = JSON.parse(fs.readFileSync('../Templates/Template_XAML_tags.json', 'utf-8'))
var temp_com_attr_Obj = JSON.parse(JSON.stringify(template_XAML_Obj.xaml.com_attr))
var temp_com_events_Obj = JSON.parse(JSON.stringify(template_XAML_Obj.xaml.com_events))
var temp_ele_Obj = JSON.parse(JSON.stringify(template_XAML_Obj.xaml.Elements))
var template_meta_element_Obj = JSON.parse(fs.readFileSync('../Templates/Template_Meta_Elements.json', 'utf-8'))
var template_child_MetaSchema = JSON.parse(fs.readFileSync("../Templates/Template_Child_MetaSchema.json", "utf-8"))

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false
    }
    return true
}

function MetaElements_Creator() {
    for (key_Elements in temp_ele_Obj) {
        var final_PropObj = {}, events_Str = '', properties_Str = ''

        fileName = "../Models/META/Schema_Elements/" + key_Elements + ".json"
        var temp_idm_Obj = temp_ele_Obj[key_Elements].idm
        var template_meta_element_Str = (JSON.stringify(template_meta_element_Obj).replaceAll("UI_ELEMENT", key_Elements)).replaceAll("0", temp_idm_Obj)
        var Meta_Ele_Obj = JSON.parse(template_meta_element_Str)
        var propertyString = '', final_PropString = '', comPropString = '', comEveString = '', eventString = '', final_EveString = ''

        for (var key_Property in temp_ele_Obj[key_Elements].properties) {
            propertyString = (getPropertyString(key_Property, temp_ele_Obj[key_Elements].properties[key_Property]))
            if (final_PropString == '') {
                final_PropString = final_PropString.concat(propertyString)
            }
            else {
                final_PropString = final_PropString.concat(',' + propertyString)
            }
        }
        for (var key_Events in temp_ele_Obj[key_Elements].events) {
            eventString = (getPropertyString(key_Events, temp_ele_Obj[key_Elements].properties[key_Events]))
            if (final_EveString == '') {
                final_EveString = final_EveString.concat(eventString)
            }
            else {
                final_EveString = final_EveString.concat(',' + eventString)
            }
        }
        for (var key_com_Property in temp_com_attr_Obj) {
            comPropString = (getPropertyString(key_com_Property, temp_com_attr_Obj[key_com_Property]))
            if (final_PropString == '') {
                final_PropString = final_PropString.concat(comPropString)
            }
            else {
                final_PropString = final_PropString.concat(',' + comPropString)
            }
        }
        for (var key_com_Events in temp_com_events_Obj) {
            comEveString = (getPropertyString(key_com_Events, temp_com_events_Obj[key_com_Events]))
            if (final_EveString == '') {
                final_EveString = final_EveString.concat(comEveString)
            }
            else {
                final_EveString = final_EveString.concat(',' + comEveString)
            }
        }
        final_PropObj = JSON.parse("[" + final_PropString + "]")
        final_EventObj = JSON.parse("[" + final_EveString + "]")

        Meta_Ele_Obj.properties[key_Elements].allOf[1].properties._attributes.properties.properties.anyOf = final_PropObj
        Meta_Ele_Obj.properties[key_Elements].allOf[1].properties._attributes.properties.events.anyOf = final_EventObj
        fs.writeFileSync(fileName, JSON.stringify(Meta_Ele_Obj))
    }
}
function getPropertyString(Property, Value) {
    var property_String = ''
    if (typeof Value == "boolean") {
        property_String = '{"properties":{"' + Property + '":{"type":"boolean"}}}'
    }
    if (typeof Value == "number") {
        property_String = '{"properties":{"' + Property + '":{"type":"number"}}}'
    }
    if (typeof Value == "string") {
        property_String = '{"properties":{"' + Property + '":{"type":"string"}}}'
    }
    return property_String
}

function MetaSchema_Creator() {
    //var template_child_MetaSchema_String = JSON.stringify(template_child_MetaSchema)
    var replaceString = JSON.stringify({"type":"object","required":["UI_Element"],"properties":{"UI_Element":{"$ref":"UI_Element.json"}}})
    var final_MetaElements_String = "", final_Meta_Obj = {}
    for (key_Elements in temp_ele_Obj) {
        var oneOfElement_String = ""
        oneOfElement_String = replaceString.replaceAll("UI_Element", key_Elements)

        if(final_MetaElements_String == ""){
            final_MetaElements_String = final_MetaElements_String.concat(oneOfElement_String)
        }
        else if(final_MetaElements_String != ""){
            final_MetaElements_String = final_MetaElements_String.concat("," + oneOfElement_String)
        }
    }
    final_Meta_Obj = JSON.parse("[" + final_MetaElements_String + "]")
    //console.log(JSON.stringify(final_Meta_Obj))
    template_child_MetaSchema.definitions.child.patternProperties["^[0-9]+$"].oneOf = final_Meta_Obj
    fs.writeFileSync("../Models/META/MetaSchema.json",JSON.stringify(template_child_MetaSchema))
}

MetaElements_Creator()
MetaSchema_Creator()

chai.tv4.addSchema("Button.json", schema);
chai.tv4.addSchema("CheckBox.json", schema);
chai.tv4.addSchema("DockPanel.json", schema);
chai.tv4.addSchema("Image.json", schema);
chai.tv4.addSchema("Label.json", schema);
chai.tv4.addSchema("PasswordBox.json", schema);
chai.tv4.addSchema("RadioButton.json", schema);
chai.tv4.addSchema("StackPanel.json", schema);
chai.tv4.addSchema("TextBlock.json", schema);
chai.tv4.addSchema("TextBox.json", schema);
chai.tv4.addSchema("Window.json", schema);

expect(correct_AUI).to.be.jsonSchema(schema);


