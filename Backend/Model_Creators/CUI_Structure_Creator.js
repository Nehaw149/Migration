var fs = require('fs')
var XAML_Model_Obj = {}, XAML_Obj = {}, next_Obj = {}, html_JSON = {}
var sequence = 0
var key_XAML_Model = '', key_Child = '', key_tag = '', key_XAML_tag = '', key_next_Obj = '', key_temp_html = ''

var startStr = '', polymerStr = '', polymerImportStr = '', cui_html = '', polymer_cui_html = '', write_CUI_Data = ''
var end_Tag_Stack = [], Obj_Stack = []
var XAML_Stack = [], Sequence_Stack = [], start_Stack = [], end_Stack = [], customElement_Stack = []
var test_counter = 0

cui_html = fs.readFileSync('../Templates/Template_CUI_HTML.html', 'utf-8')
polymer_cui_html = fs.readFileSync('../Templates/Template_Polymer_CUI_HTML.html', 'utf-8')

XAML_Model_CUI_Obj = JSON.parse(fs.readFileSync('../Models/CUI/CUI_Model.json', 'utf-8'))
Template_HTML_XAML_MAPPING_OBJ = JSON.parse(fs.readFileSync('../Templates/Template_HTML_XAML_MAPPING.json', 'utf-8'))

var cui_Obj = XAML_Model_CUI_Obj
var temp_xaml_html_Obj = Template_HTML_XAML_MAPPING_OBJ

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
        //  getting a single tag
        var id_text = " id='id_" + sequence + "' ";
        cui_start = JSON.stringify(temp_xaml_html_Obj[key_Tag_Str].HTML.Start)
        cui_start = cui_start.replace(/["]/g, "");

        if (cui_start.includes(" ")) {
            cui_start = cui_start.replace(" ", id_text)
            start_Tag_Str = start_Tag_Str.concat(cui_start)
        }
    }
    return start_Tag_Str
}

// FOR POLYMER ELEMENT STARTTAG
function append_Poly_Start_tag(key_Tag_Str, polymer_Tag_Str) {
    var polymer_cui_start = '', polymer_import = '', replacementStr = '', temp_Custom_Element = '', id_text_Polymer = ''
    var emptyStr = '', fileName = '', cui_start = '', customElement_endTag = ''
    if (temp_xaml_html_Obj.hasOwnProperty(key_Tag_Str)) {
        //  getting a single tag        
        polymer_cui_start = JSON.stringify(temp_xaml_html_Obj[key_Tag_Str].Polymer.Start)

        //  if a Web Component
        if (polymer_cui_start != emptyStr) {
            polymer_cui_start = polymer_cui_start.replace(/["]/g, "")
            polymer_import = JSON.stringify(temp_xaml_html_Obj[key_Tag_Str].Polymer.Import)
            polymer_import = polymer_import.replace(/["]/g, "");
        }
        //  if NOT a Web Component: Create Custom Element
        if (polymer_cui_start === emptyStr) {
            id_text_Polymer = "'xaml-" + key_Tag_Str.toLowerCase() + "'"
            customElement_endTag = "</xaml-" + key_Tag_Str.toLowerCase() + ">"
            customElement_Stack.push(customElement_endTag)
            replacementStr = "'define-element'"
            temp_Custom_Element = fs.readFileSync('../Templates/Template_Polymer_CustomElement.html', 'utf-8')
            temp_Custom_Element = temp_Custom_Element.replaceAll(replacementStr, id_text_Polymer)

            //  start tag in custom element
            replacementStr = "<define-element>"
            cui_start = JSON.stringify(temp_xaml_html_Obj[key_Tag_Str].HTML.Start)
            cui_start = cui_start.replace(/["]/g, "");
            temp_Custom_Element = temp_Custom_Element.replaceAll(replacementStr, cui_start)

            //  end tag in custom element
            replacementStr = "</define-element>"
            cui_start = JSON.stringify(temp_xaml_html_Obj[key_Tag_Str].HTML.End)
            cui_start = cui_start.replace(/["]/g, "");
            temp_Custom_Element = temp_Custom_Element.replaceAll(replacementStr, cui_start)

            polymer_cui_start = "<" + "xaml-" + key_Tag_Str.toLowerCase() + " >"
            //  write the custom element
            fileName = "../Models/CUI/Polymer/CustomElements/" + "xaml-" + key_Tag_Str.toLowerCase() + ".html"
            fs.writeFileSync(fileName, temp_Custom_Element)
            polymer_import = "<link rel='import' href='" + fileName + "'>"
        }

        //  write ELEMENTS in the main HTML file
        if (polymer_cui_start.includes(" ")) {
            id_text_Polymer = " id='id_" + sequence + "' "
            polymer_cui_start = polymer_cui_start.replace(" ", id_text_Polymer)
            polymer_Tag_Str = polymer_Tag_Str.concat(polymer_cui_start)
        }

        //  write IMPORTS in the main HTML file
        if (!polymerImportStr.includes(polymer_import)) {
            polymerImportStr = polymerImportStr.concat(polymer_import)
        }
    }
    start_Stack.push(polymer_cui_start)
    return polymer_Tag_Str
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}

// FOR POLYMER ELEMENT ENDTAG
function append_Poly_End_tag(key_Tag_Str, polymer_Tag_Str) {
    var polymer_cui_end = '', emptyStr = ''
    if (temp_xaml_html_Obj.hasOwnProperty(key_Tag_Str)) {
        polymer_cui_end = JSON.stringify(temp_xaml_html_Obj[key_Tag_Str].Polymer.End)
        if (polymer_cui_end != emptyStr) {
            polymer_cui_end = polymer_cui_end.replace(/["]/g, "");
        }
        if (polymer_cui_end === emptyStr) {
            //  for custom element
            polymer_cui_end = customElement_Stack.pop()
        }
        polymer_Tag_Str = polymer_Tag_Str.concat(polymer_cui_end)
    }
    end_Stack.push(polymer_cui_end)
    return polymer_Tag_Str
}

function appendEnd_tag(key_Tag_Str, start_Tag_Str) {
    var cui_end = '', polymer_cui_end = ''
    if (temp_xaml_html_Obj.hasOwnProperty(key_Tag_Str)) {
        cui_end = JSON.stringify(temp_xaml_html_Obj[key_Tag_Str].HTML.End)
        cui_end = cui_end.replace(/["]/g, "");
        start_Tag_Str = start_Tag_Str.concat(cui_end)
    }
    return start_Tag_Str
}
function generate_CUI(element_Obj, xaml_Tag_Stack, Seq_Stack) {
    if (sequence === 0) { sequence++ }
    seq: for (key_XAML_Model in element_Obj) {

        if (key_XAML_Model == sequence) {
            XAML_Obj = element_Obj[key_XAML_Model]

            XAML: for (key_tag in XAML_Obj) {
                //  ***THIS IS ONLY ONE */
                child_Obj = XAML_Obj[key_tag]

                if (temp_xaml_html_Obj.hasOwnProperty(key_tag)) {
                    Seq_Stack.push(sequence)
                    xaml_Tag_Stack.push(key_tag)
                    startStr = appendStart_tag(key_tag, startStr)
                    polymerStr = append_Poly_Start_tag(key_tag, polymerStr)
                    sequence++
                }
                //  CHILD Loop call
                if (child_Obj) {
                    for (key_Child in child_Obj) {
                        if (isEmpty(child_Obj) != true) {
                            generate_CUI(child_Obj, xaml_Tag_Stack, Seq_Stack)
                        }
                    }

                }
                var endPop = xaml_Tag_Stack.pop()
                if (temp_xaml_html_Obj.hasOwnProperty(endPop)) {
                    startStr = appendEnd_tag(endPop, startStr)
                    polymerStr = append_Poly_End_tag(endPop, polymerStr)
                    Seq_Stack.pop()
                }
            }
        }
        else {
            console.log('here')
        //    console.log('popped' + stack_Obj.pop())
        }
    }
}
generate_CUI(cui_Obj, XAML_Stack, Sequence_Stack)

String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem))
}

var append_at_html_index = cui_html.indexOf("Mig-Proj'>");
write_CUI_Data = cui_html.splice((append_at_html_index + 10), 0, startStr)
fs.writeFileSync("../Models/CUI/HTML/CUI_Model_HTML.html", write_CUI_Data)
fs.writeFileSync("../OUTPUT/FUI/HTML/FUI_Model_HTML.html", write_CUI_Data)

var append_at_polymer_html_index = polymer_cui_html.indexOf("Mig-Proj'>");
polymer_cui_html = polymer_cui_html.splice((append_at_polymer_html_index + 10), 0, polymerStr)
append_at_polymer_html_index = polymer_cui_html.indexOf("<head>");
polymer_cui_html = polymer_cui_html.splice((append_at_polymer_html_index + 6), 0, polymerImportStr)
fs.writeFileSync("../Models/CUI/Polymer/CUI_Model_Polymer_HTML.html", polymer_cui_html)
