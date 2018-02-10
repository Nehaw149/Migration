var fs = require("fs")
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}

var dirAttObject = {}, stateAttObj = {}, elementStack = [], UI_RC_Obj_Stack = [], UI_XAML_Obj_Stack = []
var parentElement = '', parentSeq = 0, final_RC_AUI_Model = {}
var elementIndex = 0, rc_sequence = 0

var template_RC = JSON.parse(fs.readFileSync("../Templates/Template_RC_tags.json", "utf-8"))
var template_RC_XAML = JSON.parse(fs.readFileSync("../Templates/Template_XAML_RC_Mapping.json", "utf-8"))
var template_XAML = JSON.parse(fs.readFileSync("../Templates/Template_XAML_tags.json", "utf-8"))

input_RC_Obj = JSON.parse(fs.readFileSync("../INPUT_Examples/Final_ResourceFileUpdated.json", "utf-8"))

create_AUI_RC_input(input_RC_Obj)
function create_AUI_RC_input(RC_Obj) {
    for (var key_obj_type in RC_Obj.Parsed_RC) {
        if (key_obj_type == "Directive_Obj") {
            dirAttObject = RC_Obj.Parsed_RC[key_obj_type]
            dir_Formatting(dirAttObject)
        }
        if (key_obj_type == "Block_elements_Obj") {
            stateAttObj = RC_Obj.Parsed_RC[key_obj_type]
            state_Seperation(stateAttObj)
        }
    }
    map_RC_XAML_Model()
    fs.writeFileSync("../Models/AUI/Abstract_Model.json", JSON.stringify(final_RC_AUI_Model))
}
function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
}

function map_RC_XAML() {
    var UI_XAML_Obj = {}, newElement_Obj = {}

    for (var eachObj = 0; eachObj < UI_RC_Obj_Stack.length; eachObj++) {
        var eleName = elementStack[eachObj]
        UI_XAML_Obj = UI_RC_Obj_Stack[eachObj]
        //console.log(JSON.stringify(UI_XAML_Obj))

        if (isEmpty(UI_XAML_Obj) !== true) {
            //console.log(JSON.stringify(UI_XAML_Obj[eleName].properties))

            for (var key_EachObj_Prop in UI_XAML_Obj[eleName].properties) {
                if ((template_RC_XAML.rc.Attributes).hasOwnProperty(key_EachObj_Prop)) {
                    //console.log(key_EachObj_Prop)
                    var value = UI_XAML_Obj[eleName].properties[key_EachObj_Prop]
                    var newProp = template_RC_XAML.rc.Attributes[key_EachObj_Prop]
                    //console.log(value + newProp)
                    if (newProp != '') {
                        //format value datatype
                        var isNum = /^\d+$/.test(value.replace('"', ''))
                        var isString = /^\w+$/.test(value.replace('"', ''))
                        var isTrueSet = (value == 'true');

                        if (isNum === true) {
                            UI_XAML_Obj[eleName].properties[newProp] = parseInt(value)
                        }
                        if (isNum === false && isString === true) {
                            UI_XAML_Obj[eleName].properties[newProp] = value
                        }
                        if (typeof (value.replace('"', '')) == "boolean") {
                            UI_XAML_Obj[eleName].properties[newProp] = isTrueSet
                        }
                        delete UI_XAML_Obj[eleName].properties[key_EachObj_Prop]
                    } else {
                        //To Do Error Map Property between XAML-RC
                        delete UI_XAML_Obj[eleName].properties[key_EachObj_Prop]
                        //    console.log("ERROR:Mapping: XAML-RC Properties for " + key_EachObj_Prop)
                    }
                }
            }
            for (var key_EachObj_Name in UI_XAML_Obj) {
                //console.log(key_EachObj_Name)
                if ((template_RC_XAML.rc.Elements).hasOwnProperty(key_EachObj_Name)) {
                    var newElementName = template_RC_XAML.rc.Elements[key_EachObj_Name]

                    if (newElementName != "") {
                        newElement_Obj = { [newElementName]: {} }
                        newElement_Obj[newElementName]._attributes = UI_XAML_Obj[key_EachObj_Name]

                        // format _text properly
                        newElement_Obj[newElementName]._attributes._text = UI_XAML_Obj[key_EachObj_Name].properties._text
                        delete newElement_Obj[newElementName]._attributes.properties._text
                        //console.log(JSON.stringify(newElement_Obj))
                    }
                    else {
                        //TO DO
                        //    console.log("ERROR:Mapping: XAML-RC Elements for " + key_EachObj_Name)
                        newElement_Obj = {}
                    }
                }
            }
        }
        else {
            newElement_Obj = {}
        }
        UI_XAML_Obj_Stack.push(newElement_Obj)
        //console.log(JSON.stringify(newElement_Obj))
    }
    return UI_XAML_Obj_Stack
}

function map_RC_XAML_Model() {
    var final_ObjMapped = {}, sequence = '', finalRC_Stack = []
    var xamlMappedEle_Stack = map_ElementStack()
    var xamlMappedEleProp_Stack = map_RC_XAML()
    var singleXAMLEle = '', singleXAML_Obj = {}, countBegin = 0, countEnd = 0, countChild = 0
    var sequenceStack = []
    var parentElementStack = [], parentSeqStack = []
    for (var countMapped_Ele = 0; countMapped_Ele < elementStack.length; countMapped_Ele++) {
        singleXAMLEle = xamlMappedEle_Stack[countMapped_Ele]
        singleXAML_Obj = xamlMappedEleProp_Stack[countMapped_Ele]

        if (isEmpty(singleXAML_Obj) != true) {
            sequence = singleXAML_Obj[singleXAMLEle]._attributes.seq
            sequenceStack.push(sequence)
        }
        else {
            sequenceStack.push("")
        }

        if (singleXAMLEle == 'BEGIN') {
            for (var parLen = countMapped_Ele - 1; parLen > -1; parLen--) {

                parentElement = xamlMappedEle_Stack[parLen]
                parentSeq = sequenceStack[parLen]
                if (parentElement != '' && parentSeq != '') {
                    parentElementStack.push(parentElement)
                    parentSeqStack.push(parentSeq)
                    break
                }
            }
            countBegin++
            countChild++
        }
        if (singleXAMLEle == 'END') {
            countEnd++
            countChild--
            //final_RC_AUI_Model
        }
        if (singleXAMLEle != 'BEGIN' && singleXAMLEle != 'END' && singleXAMLEle != '') {

            if (countChild == 0) {
                final_RC_AUI_Model = { [sequence]: singleXAML_Obj }
            }
            if (countChild > 0) {
                var sequencedEle = { [sequence]: singleXAML_Obj }
                final_RC_AUI_Model[parentSeq][parentElement][sequence] = singleXAML_Obj
            }
        }
    }
    //console.log(JSON.stringify(final_RC_AUI_Model))
}

function map_ElementStack() {
    var mappedEleStack = []

    for (var count_Ele = 0; count_Ele < elementStack.length; count_Ele++) {
        if ((template_RC_XAML.rc.Elements).hasOwnProperty(elementStack[count_Ele])) {
            if (elementStack[count_Ele] == 'BEGIN') {
                mappedEleStack.push('BEGIN')
            }
            if (elementStack[count_Ele] == 'END') {
                mappedEleStack.push('END')
            }
            if (elementStack[count_Ele] != 'BEGIN' && elementStack[count_Ele] != 'END') {
                mappedEleStack.push(template_RC_XAML.rc.Elements[elementStack[count_Ele]])
            }
        }
        else {
            //TO DO Element not mapped to XAML Error
            //console.log(elementStack[count_Ele])

            if (count_Ele > -1) {
                elementStack.splice(count_Ele, 1)
            }
        }
    }
    //console.log(elementStack + mappedEleStack)
    return mappedEleStack
}

function dir_Formatting(dirAttObject) {
    var key_dir, singleDirObj, dirName, dirText, dirObjDetails;
    for (var i = 0; i < dirAttObject.length; i++) {
        dirName = 'Directive_' + i
        singleDirObj = dirAttObject[i]
        for (dirName in singleDirObj) {
            dirObjDetails = singleDirObj[dirName]
            for (key_dir in dirObjDetails) {
                if (key_dir === 'Dir') {
                    dir_JSON = { "Directive": {} }
                    //    console.log(dirObjDetails[key_dir]);
                }
                if (key_dir === '_text') {
                    dir_JSON = { "Directive": {} }
                    //    console.log(dirObjDetails[key_dir]);
                }
            }
        }
    }
}

//function gets values param1/param2/.. from array object passed.
function state_Seperation(UI_State_Obj) {
    UI_State_len = UI_State_Obj.length
    if (UI_State_len != 0) {
        for (var firstLoop = 0; firstLoop < UI_State_len; firstLoop++) {
            var single_UI_Obj = UI_State_Obj[firstLoop]
            format_UI_Element(single_UI_Obj)
        }
    }
}

function format_UI_Element(element_Outer_Obj) {
    var UI_element_Outer_len = element_Outer_Obj.length
    var loopStartIndex = 0, loopEndIndex = 0
    var elementAttrKey_String = '', elementStartLoopKey_String = '', elementEndLoopKey_String = ''
    var finalArrayAttr = '', finalElement = '', finalElement_Obj = {}
    elementStartLoopKey_String = 'LoopStart_' + loopStartIndex
    elementEndLoopKey_String = 'LoopEnd_' + loopEndIndex
    elementNameKey_String = 'UI_Element_Obj' + elementIndex

    if (UI_element_Outer_len.length != 0) {
        for (var secLoop = 0; secLoop < UI_element_Outer_len; secLoop++) {
            var UI_element_innerElement_Obj = element_Outer_Obj[secLoop]
            var UI_element_innerElement_len = UI_element_innerElement_Obj.length
            if (UI_element_innerElement_len != 0) {
                for (var thirdLoop = 0; thirdLoop < UI_element_innerElement_len; thirdLoop++) {
                    var final_ElementObj = UI_element_innerElement_Obj[thirdLoop]
                    var attr_Element_len = final_ElementObj.length

                    if ((typeof final_ElementObj) == "object" && Array.isArray(final_ElementObj) !== true) {
                        //console.log(JSON.stringify(final_ElementObj))

                        for (var key_UI_Element in final_ElementObj) {

                            if (key_UI_Element == elementNameKey_String) {
                                rc_sequence++
                                finalElement = final_ElementObj[key_UI_Element]
                                //elementStack.push(finalElement)
                                //console.log(finalElement)
                                elementIndex++
                            }
                            if (key_UI_Element == elementStartLoopKey_String) {
                                elementStack.push("BEGIN")
                                loopStartIndex++
                            }
                            if (key_UI_Element == elementEndLoopKey_String) {
                                elementStack.push("END")
                                loopEndIndex++
                            }
                        }
                    }
                    if ((final_ElementObj instanceof Array) === true) {
                        finalArrayAttr = getArray_attributes(final_ElementObj)
                        finalElement_Obj = mapAttr_Elements(rc_sequence, finalElement, finalArrayAttr)
                    }
                }
            }
        }
    }
    //console.log(finalElement_Obj)
    UI_RC_Obj_Stack.push(finalElement_Obj)
}

function mapAttr_Elements(ele_Seq, ele_UI, ele_Attr) {
    var finalRC_Obj = {}
    var flag_Statement = false, flag_Resource = false

    var formatted_Attr = formatAttributeArray(ele_Attr)

    if ((template_RC.rc.Statement).hasOwnProperty(ele_UI)) {
        //Statement found
        flag_Statement = true
        elementStack.push(ele_UI)
    }
    if ((template_RC.rc.Resource).hasOwnProperty(formatted_Attr[0])) {
        //Resource found
        flag_Resource = true
        var nameID = ele_UI
        ele_UI = formatted_Attr[0]
        elementStack.push(formatted_Attr[0])
        formatted_Attr[0] = nameID
    }
    if (flag_Statement && !flag_Resource) {
        finalRC_Obj = setDefinition(formatted_Attr, template_RC.rc.Statement, ele_UI, ele_Seq)
    }
    if (flag_Resource && !flag_Statement) {
        finalRC_Obj = setDefinition(formatted_Attr, template_RC.rc.Resource, ele_UI, ele_Seq)
    }
    return finalRC_Obj
}

function setDefinition(formatted_ele_Attr, template_Obj, ele_UI, ele_Sequence) {
    var concrete_Obj = {}, real_totalProps = 0, temp_totalProps = 0, temp_totalText = 0
    var formatted_ele_Attr_len = 0

    real_totalProps = formatted_ele_Attr.length
    for (var key_rc_Elements in template_Obj) {
        if (key_rc_Elements == ele_UI) {
            concrete_Obj = { [key_rc_Elements]: template_Obj[key_rc_Elements] }
            for (var key_Concrete_Prop in concrete_Obj[key_rc_Elements].properties) {
                temp_totalProps++
            }
            for (var key_Concrete_Text in concrete_Obj[key_rc_Elements]._text) {
                temp_totalText++
                console.log()
            }
            var isPropCountSameStatement = isTotalPropertyNotSame(real_totalProps, (temp_totalProps + temp_totalText))

            if (isPropCountSameStatement === true) {
                if (template_Obj[key_rc_Elements]._text) {
                    concrete_Obj[key_rc_Elements]._text = formatted_ele_Attr[0]
                    formatted_ele_Attr_len = 1
                }
                for (key_Concrete_Prop in concrete_Obj[key_rc_Elements].properties) {
                    if (formatted_ele_Attr_len < real_totalProps) {
                        concrete_Obj[key_rc_Elements].properties[key_Concrete_Prop] = formatted_ele_Attr[formatted_ele_Attr_len]
                        formatted_ele_Attr_len++
                    }
                }
                concrete_Obj[key_rc_Elements].seq = ele_Sequence
            }
            else {
                console.log("PLEASE FORMAT YOUR REAL PROP")
            }
            //    console.log(formatted_ele_Attr)
        }
        else {
            //TO DO Error Handling
        }
    } return concrete_Obj
}
function isTotalPropertyNotSame(realProp, tempProp) {
    var sameProperty = false

    if (realProp == tempProp) {
        sameProperty = true
    }
    return sameProperty
}

function formatAttributeArray(ele_Attr) {
    var quotePresent = false
    var stateAttributes = [], formattedString = '', ele_Attr_Array = []
    var flag = 0, getStringStart = 0, getStringEnd = 0
    //console.log(ele_Attr)
    ele_Attr_Array = ele_Attr.split(',')
    for (var arr = 0; arr < ele_Attr_Array.length; arr++) {
        //console.log(ele_Attr_Array[arr])
        var countQuotes = ele_Attr_Array[arr].split('"').length
        //console.log(countQuotes)
        //ONLY for INCOMPLETELY Parsed Strings
        if (ele_Attr_Array[arr].includes('\"') && countQuotes == 2) {
            quotePresent = true
            flag++;
            if (flag === 1) {
                getStringStart = arr;
            }
            if (flag === 2) {
                getStringEnd = arr;
                flag = 0;
            }
            if (getStringEnd !== undefined && getStringEnd > getStringStart) {
                for (var jS = getStringStart; jS <= getStringEnd; jS++) {
                    formattedString = formattedString.concat(ele_Attr_Array[jS]);
                }
                stateAttributes.push(formattedString)
                formattedString = ''
            }
        }
        else if (flag !== 1 || countQuotes == 3) {
            stateAttributes.push(ele_Attr_Array[arr])
        }
    }
    //console.log(stateAttributes)
    return stateAttributes
}

function getArray_attributes(attribute_ElementObj) {
    var array = '', stringAttr = '', attributeIndex = 0, elementAttrKey_String = ''
    var attribute_Len = attribute_ElementObj.length
    for (var fourLoop = 0; fourLoop < attribute_Len; fourLoop++) {
        var eachAttr_Obj = attribute_ElementObj[fourLoop]
        if ((typeof eachAttr_Obj) == "object" && Array.isArray(eachAttr_Obj) !== true) {
            // console.log("OBJECT")
            // console.log(JSON.stringify(eachAttr_Obj))
            for (var key_Attr_Element in eachAttr_Obj) {
                elementAttrKey_String = '_attributes_Obj' + attributeIndex
                //console.log(key_Attr_Element + "***" + elementAttrKey_String)
                if (key_Attr_Element == elementAttrKey_String) {
                    stringAttr = eachAttr_Obj[key_Attr_Element]
                    if (array == '') {
                        array = array.concat(stringAttr)
                    }
                    else {
                        array = array.concat("," + stringAttr)
                    }
                }
                attributeIndex++
            }
        }
    }
    // if(array.match(/[\w+\,?]+/)){
    // //     var arr = array.match(/[\w+\,?]+/)
    //      console.log(array)
    // }
    array = array.replaceAll("[\|]", "")
    array = array.replaceAll(",,", " ")
    //console.log(array)
    return array
}