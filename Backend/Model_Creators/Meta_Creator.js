var fs = require('fs')
var GenerateSchema = require('generate-schema')

var Meta_Element_Obj = {}, properties_Obj = {}, events_Obj = {}
var key_Elements = '', properties_Str = '', events_Str = ''

var template_XAML_Obj = JSON.parse(fs.readFileSync('../Templates/TEMPLATE_XAML_tags.json', 'utf-8'));
var temp_com_attr_Obj = JSON.parse(JSON.stringify(template_XAML_Obj.xaml.com_attr));
var temp_com_events_Obj = JSON.parse(JSON.stringify(template_XAML_Obj.xaml.com_events));
// var temp_idm_Obj = JSON.parse(JSON.stringify(template_XAML_Obj.xaml.idm));
var temp_ele_Obj = JSON.parse(JSON.stringify(template_XAML_Obj.xaml.Elements));

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

function Meta_Creator(){
    for( key_Elements in temp_ele_Obj){
        Meta_Element_Obj = {}, events_Str = '', properties_Str = ''
        fileName = "../Models/META/Schema_Elements/" + key_Elements + ".json"
        Meta_Element_Obj = {[key_Elements] : {"_attributes" : temp_ele_Obj[key_Elements]}}
        properties_Str = JSON.stringify(Meta_Element_Obj[key_Elements]._attributes.properties) + JSON.stringify(temp_com_attr_Obj)
        if(isEmpty(Meta_Element_Obj[key_Elements]._attributes.properties) === true){
            properties_Str = properties_Str.replace("}{" , "")
        }else{
            properties_Str = properties_Str.replace("}{" , ",")
        }        
        events_Str = JSON.stringify(Meta_Element_Obj[key_Elements]._attributes.events) + JSON.stringify(temp_com_events_Obj)
        if(isEmpty(Meta_Element_Obj[key_Elements]._attributes.events) === true){
            events_Str = events_Str.replace("}{" , "")
        }else{
            events_Str = events_Str.replace("}{" , ",")
        }
        Meta_Element_Obj[key_Elements]._attributes.properties = JSON.parse(properties_Str)
        Meta_Element_Obj[key_Elements]._attributes.events = JSON.parse(events_Str)
        Meta_Element_Obj[key_Elements]._attributes.seq = Number.prototype

        //console.log(JSON.stringify(Meta_Element_Obj))
        var schema = GenerateSchema.json(key_Elements, Meta_Element_Obj)
        fs.writeFileSync(fileName, JSON.stringify(schema))
    }
}   

Meta_Creator()