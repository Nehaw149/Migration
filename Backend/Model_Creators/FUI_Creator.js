var fs = require('fs')
var structure_HTML = fs.readFileSync('../Models/CUI/HTML/CUI_Model_HTML.html', 'utf-8')
var interaction_Event = JSON.parse(fs.readFileSync('../Models/CUI/Interaction/CUI_Interaction_EVENT_Model.json', 'utf-8'))
var interaction_Style = JSON.parse(fs.readFileSync('../Models/CUI/Interaction/CUI_Interaction_STYLE_Model.json', 'utf-8'))
var template_Event = JSON.parse(fs.readFileSync('../Templates/Template_EVENT.json', 'utf-8'))
var template_Style = JSON.parse(fs.readFileSync('../Templates/Template_STYLE.json', 'utf-8'))
var CUI_HTML = fs.readFileSync("../Models/CUI/HTML/CUI_Model_HTML.html", "utf-8")
var value_Event = "", attr_Str = "", len = 0, finalEvents = "", attr_Obj = {}, event_Obj = {}, style_Obj = {}, event_DOMLoaded = ''
var eventsArray = [], styleID_Array = [], finalStyle = "", value_Style = "", eachStyle_Obj = {}, finalAttributes = ''

var common_Modules  = require("../CommonModules/common_Modules.js")
var readFileAt = "../CommonModules/errorLog.txt"
var writeFileAt = "../CommonModules/errorLog.txt"

// write the JS file
function assign_Events() {
    for (var key_EVENT in interaction_Event) {
        len = interaction_Event[key_EVENT].length
        for (var arr_len = 0; arr_len < len; arr_len++) {
            attr_Str = interaction_Event[key_EVENT].pop()
            attr_Obj = JSON.parse(attr_Str)
            for (var key_id in attr_Obj) {
                event_Obj = attr_Obj[key_id]._attributes.events
                for (var key_Events in event_Obj) {
                    for (var key_Temp_Event in template_Event.EVENT) {
                        if (key_Events === key_Temp_Event) {
                            finalEvents = write_DOM_JS(key_id, template_Event.EVENT[key_Events], JSON.stringify(event_Obj[key_Events]))
                        }
                    }
                }
            }
        }
    }
    event_DOMLoaded = "document.addEventListener('DOMContentLoaded', function() {\n" + assign_Style() + "\n\n\t});"
    finalEvents = "{\n" + event_DOMLoaded + "\n\n" + finalEvents + "\n}"
    return finalEvents
}

function write_DOM_JS(id, event, value) {
    var findElement = '', addEvent = ''

    value = value.replaceAll("\"", "")
    findElement = "document.getElementById('" + id + "')"
    addEvent = "\nif(" + findElement + "){\n\t" + findElement + ".addEventListener('" + event + "', " + value + ")}; \nfunction " + value + "(){}"
    value_Event = value_Event.concat(addEvent)
    //console.log(value_Event)
    return value_Event
    // eventsArray.push(value_Event)
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}

var filePath_HTML_FUI_JS = "../OUTPUT/FUI/HTML/FUI_JS.js"
var filePath_Polymer_CUI_JS = "../Models/CUI/Polymer/CUI/FUI_JS.js"

fs.writeFileSync(filePath_HTML_FUI_JS, assign_Events())
fs.writeFileSync(filePath_Polymer_CUI_JS, assign_Events())


// write the CSS file

function assign_Style() {
    for (var key_STYLE in interaction_Style) {
        len_Style = interaction_Style[key_STYLE].length
        for (var arr_len = 0; arr_len < len_Style; arr_len++) {
            attr_Str_Style = interaction_Style[key_STYLE].pop()
            attr_Style_Obj = JSON.parse(attr_Str_Style)
            for (var key_id in attr_Style_Obj) {
                write_DOM_CSS(key_id, attr_Style_Obj[key_id]._attributes.properties)
            }
        }
    }
    fs.writeFileSync("../OUTPUT/FUI/HTML/FUI_CSS.css", value_Style)
    fs.writeFileSync("../Models/CUI/Polymer/CUI/FUI_CSS.css", value_Style)

    return finalAttributes
}

function write_DOM_CSS(id, style_Obj) {
    var findElement_Att = '', findElement_CSS = '', addStyle = '', flag_Style = 0, addAttribute = '', comma_sep_Val = ''
    for (var key_attributes in style_Obj) {
        var style = template_Style.STYLE.CSS[key_attributes]
        var attribute = template_Style.STYLE.ATTRIBUTES[key_attributes]
        var value = JSON.stringify(style_Obj[key_attributes])
        value = value.replaceAll("\"", "")

        for (var key_Temp_Style in template_Style.STYLE.CSS) {
            if (key_attributes === key_Temp_Style) {
                if (style != "NONE" && value != 0) {
                    //Check if the value is digit
                    findElement_CSS = "#" + id + " {"

                    if (value.match("^[0-9]+$") || (value.split(",")).length > 1) {
                        if ((value.split(",")).length > 1) {
                            value = (value.split(","))
                            for (var i = 0; i < value.length; i++) {
                                //console.log(value[i])
                                comma_sep_Val = comma_sep_Val.concat((value[i] + "px, "))
                            }
                            comma_sep_Val = comma_sep_Val.replace(/,([^,]*)$/, '$1');
                            flag_Style++
                            addStyle = addStyle.concat(style + ": " + comma_sep_Val + "; ")
                        } else {
                            flag_Style++
                            addStyle = addStyle.concat(style + ": " + value + "px ; ")
                        }
                    }
                    else {
                        flag_Style++
                        addStyle = addStyle.concat(style + ": " + value + "; ")
                    }
                    //console.log(addStyle + "}")
                }
                else {
                    //To Do
                    common_Modules.errorLog(("ERROR: FUI_Creator.js: Mapping: Style for\t" + key_Temp_Style), readFileAt, writeFileAt)
                }
            }
        }
        for (var key_Temp_Attribute in template_Style.STYLE.ATTRIBUTES) {
            if (key_attributes === key_Temp_Attribute) {
                if (attribute != "NONE" && value != 0) {
                    //console.log(attribute + value)
                    value = value.replaceAll(/\W+/g, "")
                    findElement_Att = "\n\tdocument.getElementById('" + id + "')"

                    if (attribute == "innerHTML") {
                        addAttribute = findElement_Att + ".innerText = '" + value + "';"
                    }
                    else {
                        addAttribute = findElement_Att + ".setAttribute('" + attribute + "', '" + value + "');"
                    }
                    finalAttributes = finalAttributes.concat(addAttribute)
                    //console.log(finalAttributes)
                }
                else {
                    //To Do
                    common_Modules.errorLog(("ERROR: FUI_Creator.js: Mapping: Attribute for\t" + key_Temp_Attribute), readFileAt, writeFileAt)
                }
            }
        }
    }
    if (flag_Style > 0) {
        value_Style = value_Style.concat(findElement_CSS + addStyle + "}\n")
        //console.log(value_Style)
    }
}

//include the JS file in the HTML header