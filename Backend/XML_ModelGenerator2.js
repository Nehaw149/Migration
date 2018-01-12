var fs = require('fs');

var sequence = 0;
var migratedXAMLObj = {};
var sequence = 0;
var count = 0;

// reading the files synchronously
var XAML_ob = JSON.parse(fs.readFileSync('./Parsed_XAML2.json', 'utf-8'));
var templateXAMLob = JSON.parse(fs.readFileSync('./TEMPLATE_XAML_tags.json', 'utf-8'));

var temp_com_attr_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.com_attr));
var temp_com_events_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.com_events));
// var temp_idm_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.idm));
var temp_ele_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.Elements));

function formatXAML_window(XAMLob, migratedXAMLObj){
	console.log(XAMLob);
	for(var keys_XAML in XAMLob) {
		if(temp_ele_Obj.hasOwnProperty(keys_XAML)){
			var windowAttObject = JSON.parse(JSON.stringify(XAMLob[keys_XAML]));

			// if windowAtObject is an array
			if(Array.isArray(windowAttObject) && windowAttObject.length > 0){
				for(var len=0; len<windowAttObject.length; len++){
					sequence++;
					setAttributes(JSON.parse(JSON.stringify(windowAttObject[len])), migratedXAMLObj, sequence, keys_XAML);
            	}
			} else if(Object.keys(windowAttObject).length > 0){
				sequence++;
				setAttributes(JSON.parse(JSON.stringify(windowAttObject)), migratedXAMLObj, sequence, keys_XAML)
			} else {
				console.log('empty object')
			}
		}
	}
}

function setAttributes(windowAttObject, migratedXAMLObj, sequence, element){
	migratedXAMLObj[sequence] = {};
	migratedXAMLObj[sequence][element] = {};

	console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
	console.log(windowAttObject)
	console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

	for(var key in windowAttObject){
		if(key === '_attributes'){
			// set the attributes
			win_atts_Obj = JSON.parse(JSON.stringify(windowAttObject[key]));

			migratedXAMLObj[sequence][element]._attributes = {};
			migratedXAMLObj[sequence][element]._attributes = 
				JSON.parse(JSON.stringify(getAttributeObjForAnElement(win_atts_Obj, element)));
			migratedXAMLObj[sequence][element]._attributes.seq = sequence
		}else if(key === '_text'){
			// set the text
			if(!migratedXAMLObj[sequence][element]._attributes){
				migratedXAMLObj[sequence][element]._attributes = {}
			}
			if(!migratedXAMLObj[sequence][element]._attributes._text){
				migratedXAMLObj[sequence][element]._attributes._text = {}
			}
			migratedXAMLObj[sequence][element]._attributes._text = JSON.parse(JSON.stringify(windowAttObject[key]));
		}else {
			// recursion
			formatXAML_window(JSON.parse(JSON.stringify(windowAttObject)), migratedXAMLObj[sequence][element]);
			return;
		}
	}
}

function getAttributeObjForAnElement(attributes, xaml_element){
	var att_obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.Elements[xaml_element]));

	var temp_props_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.Elements[xaml_element].properties));
	var temp_events_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.Elements[xaml_element].events));
	var temp_text_Obj = JSON.parse(JSON.stringify(templateXAMLob.xaml.Elements[xaml_element]));

	for(var key in attributes){
		// skipped idm because its undefined, add it when its defined

		// com_attr
		if(temp_com_events_Obj.hasOwnProperty(key)){
			att_obj.properties[key] = JSON.parse(JSON.stringify(attributes[key]));
		}
		// com_events
		if(temp_com_events_Obj.hasOwnProperty(key)){
			att_obj.events[key] = JSON.parse(JSON.stringify(attributes[key]));
		}
		// properties
		if(temp_props_Obj.hasOwnProperty(key)){
			att_obj.properties[key] = JSON.parse(JSON.stringify(attributes[key]));
		}
		// events
		if(temp_events_Obj.hasOwnProperty(key)){
			att_obj.events[key] = JSON.parse(JSON.stringify(attributes[key]));
		}
	}

	return att_obj;
}

formatXAML_window(XAML_ob, migratedXAMLObj);

// printing the migrated obj
console.log('\n\n\n~~~~~~~~~~~~~~~~~migrated obj~~~~~~~~~~~~~~~~~~~\n');
console.log(JSON.stringify(migratedXAMLObj));
console.log('\n~~~~~~~~~~~~~~~~~migrated obj~~~~~~~~~~~~~~~~~~~\n');