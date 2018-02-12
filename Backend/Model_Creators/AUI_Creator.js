var fs = require('fs')
var convert = require('xml-js')

var common_Modules  = require("../CommonModules/common_Modules.js")
var readFileAt = "../CommonModules/errorLog.txt"
var writeFileAt = "../CommonModules/errorLog.txt"

var sequence = 0
var migratedXAMLObj = {}
var sequence = 0
var count = 0

var json_xmljs = fs.readFileSync('../INPUT_Examples/XAML_Test.xaml', 'utf-8')
var XAML_Obj = convert.xml2json(json_xmljs, { compact: true, spaces: 4 })
fs.writeFileSync('../INPUT_Examples/Parsed_XAML.json', XAML_Obj)

var XAML_ob = JSON.parse(XAML_Obj)
var templateXAMLob = JSON.parse(fs.readFileSync('../Templates/Template_XAML_tags.json', 'utf-8'))

var temp_com_attr_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.com_attr))
var temp_com_events_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.com_events))
// var temp_idm_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.idm))
var temp_ele_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.Elements))

function create_AUI(XAMLob, migratedXAMLObj){
	//	console.log(XAMLob)
	for(var keys_XAML in XAMLob) {
		if(temp_ele_Obj.hasOwnProperty(keys_XAML)){
			var windowAttObject = JSON.parse(JSON.stringify(XAMLob[keys_XAML]))

			// if windowAtObject is an array
			if(Array.isArray(windowAttObject) && windowAttObject.length > 0){
				for(var len=0; len<windowAttObject.length; len++){
					sequence++
					setAttributes(JSON.parse(JSON.stringify(windowAttObject[len])), migratedXAMLObj, sequence, keys_XAML)
            	}
			} else if(Object.keys(windowAttObject).length > 0){
				sequence++
				setAttributes(JSON.parse(JSON.stringify(windowAttObject)), migratedXAMLObj, sequence, keys_XAML)
			} else {
				console.log('empty object')
			}
		}
	}
}

function setAttributes(windowAttObject, migratedXAMLObj, sequence, element){
	migratedXAMLObj[sequence] = {}
	migratedXAMLObj[sequence][element] = {}

	for(var key in windowAttObject){
		if(key === '_attributes'){
			// set the attributes
			win_atts_Obj = JSON.parse(JSON.stringify(windowAttObject[key]))

			migratedXAMLObj[sequence][element]._attributes = {}
			migratedXAMLObj[sequence][element]._attributes = 
			JSON.parse(JSON.stringify(getAttributeObjForAnElement(win_atts_Obj, element)))
			migratedXAMLObj[sequence][element]._attributes.seq = sequence
		}else if(key === '_text'){
			// set the text
			if(!migratedXAMLObj[sequence][element]._attributes){
				migratedXAMLObj[sequence][element]._attributes = {}
			}
			if(!migratedXAMLObj[sequence][element]._attributes._text){
				migratedXAMLObj[sequence][element]._attributes._text = {}
			}
			migratedXAMLObj[sequence][element]._attributes._text = JSON.parse(JSON.stringify(windowAttObject[key]))
		}else {
			// recursion
			create_AUI(JSON.parse(JSON.stringify(windowAttObject)), migratedXAMLObj[sequence][element])
			return
		}
	}
}

function clearValue(winOb) {
	for (var key_clearVal1 in winOb) {
		for (var key_clearVal2 in winOb[key_clearVal1]) {
			//	console.log(key_clearVal2)
			var ob_attr1 = winOb[key_clearVal1]
			if (ob_attr1[key_clearVal2] === "" || ob_attr1[key_clearVal2] == 0) {
			//	console.log(ob_attr1[key_clearVal2])
				delete ob_attr1[key_clearVal2]
			}
		}
	}
	return winOb
	//console.log(JSON.stringify(winOb))
}

function getAttributeObjForAnElement(attributes, xaml_element){
	var att_obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.Elements[xaml_element]))
	var temp_props_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.Elements[xaml_element].properties))
	var temp_events_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.Elements[xaml_element].events))
	var temp_text_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.Elements[xaml_element]))

	for(var key in attributes){
		// skipped idm because its undefined, add it when its defined

		// com_attr
		if(temp_com_attr_Obj.hasOwnProperty(key)){
			att_obj.properties[key] = JSON.parse(JSON.stringify(attributes[key]))
		}
		// com_events
		if(temp_com_events_Obj.hasOwnProperty(key)){
			att_obj.events[key] = JSON.parse(JSON.stringify(attributes[key]))
		}
		// properties
		if(temp_props_Obj.hasOwnProperty(key)){
			// if(isNaN(attributes[key])){
			// }
			att_obj.properties[key] = (attributes[key])

		}
		// events
		if(temp_events_Obj.hasOwnProperty(key)){
			att_obj.events[key] = JSON.parse(JSON.stringify(attributes[key]))
		}
	}
	
	return clearValue(att_obj)
}

create_AUI(XAML_ob, migratedXAMLObj)
fs.writeFileSync("../Models/AUI/Abstract_Model.json",JSON.stringify(migratedXAMLObj))

