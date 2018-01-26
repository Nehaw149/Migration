// let RC_content, json1, cleanData, grammer, content, parser;
// const peg = require("pegjs");
// var pegimport = require('pegjs-import');
var convert = require('xml-js');
var fs = require('fs');
var abstractModel, structuralModel, presInterModel, dir_JSON, states_JSON, attributes_JSON;
var rcOb, rcOb_String;
var state_Count = 0;
var attributes_Count = 0;
var loop_Count = 0;
var loopS_Count = 0;
var loopE_Count = 0;
var child_Count = 0;
var loopStart, loopEnd;
loopStart = 'loopStart_' + loopS_Count;
loopEnd = 'loopEnd_' + loopE_Count;
var attrArray = [];
var finalAttrArray = [];
var subStateObj = {}
var readPathName = "./Parsed_RC_TEST.json";
var fileText = "";
var writePathName = "./Parsed_RC_TEST_MODEL.xml";

var jsonData = fs.readFileSync(readPathName, 'utf8');
var options = { ignoreComment: true, spaces: 4, compact: true };
//var result = convert.json2xml(jsonData, options);
//writeFiles(writePathName, result);

fs.readFile(readPathName, function (err, data) {
    if (err) { console.log(err); }
    rcOb_String = data.toString();
    rcOb = JSON.parse(rcOb_String);
    formatting(rcOb);
})
function writeFiles(pathName, fileText) {
    //clear the file first
    fs.writeFile(pathName, "", (err) => {
        if (err) {
            console.error(err);
        }
        //write new data to clean file
        fs.writeFile(pathName, fileText, (err) => {
            if (err) {
                console.error(err);
            }
        })
    })
}

function formatting(rcOb) {
    for (var key in rcOb) {
        if (key === "Parsed_RC") {
            var rcAttObject = rcOb[key];
            for (var obj_type in rcAttObject) {
                if (obj_type === "Directive_Obj") {
                    var dirAttObject = rcAttObject[obj_type];
                    dir_Formatting(dirAttObject);
                }
                if (obj_type === "States_Obj") {
                    var stateAttObj = rcAttObject[obj_type];
                    state_Formatting(stateAttObj);
                }
            }
        }
    }
}

function dir_Formatting(dirAttObject) {
    var key_dir, singleDirObj, dirName, dirText, dirObjDetails;
    for (var i = 0; i < dirAttObject.length; i++) {
        dirName = 'Directive_' + i;
        singleDirObj = dirAttObject[i]
        for (dirName in singleDirObj) {
            dirObjDetails = singleDirObj[dirName];
            for (key_dir in dirObjDetails) {
                if (key_dir === 'Dir') {
                    dir_JSON = { "Directive": {} }
                   // console.log(dirObjDetails[key_dir]);
                }
                if (key_dir === '_text') {
                    dir_JSON = { "Directive": {} }
                   // console.log(dirObjDetails[key_dir]);
                }
            }
        }
    }
}
//gets the state object
function getState() {
    var state_Obj, stateName, finalState, key_state, y, stateIdentifier, attrIdentifier ;
    for (var j = 0; j < arguments.length; j++) {
        state_Obj = arguments[j];
        childName = 'child_' + child_Count;
        stateName = 'StateName_Obj' + state_Count;
        for (var k = 0; k < state_Obj.length; k++) {
            finalState = state_Obj[k];
            // for (var x = 0; x < finalState.length; x++) {
            //     y = finalState[x];
                for (key_state in finalState) {                    
                    if (key_state === stateName) {
                         stateIdentifier = finalState[key_state];
                        // console.log(finalState[key_state]);                        state_Count++;
                    }
                }
                if (k === 1) {
                    attrIdentifier = getAttributes(finalState);
                    setState(stateIdentifier, attrIdentifier);                    
                }
            } if (j === 1) {
                //loop_Obj = attrs_Obj[key_att];
                //console.log(state_Obj);    
                //getLoop(state_Obj);
            }

        }

    }
//}

function setAttributes(finalAttrArray) {
    var stateAttributes = [];
    var formattedString = '';
    var flag = 0;
    var getStringStart = 0, getStringEnd = 0;
    var countStrings
    //finalAttrArray = [ '8', '"MS', 'Shell', 'Shell', 'Dlg"', '0', '0', '0x1' , '"Hey', 'Second', 'Test"' ]
    for (var arr = 0; arr < finalAttrArray.length; arr++) {
        if (finalAttrArray[arr].includes('\"')){
            flag ++;                
            if (flag === 1) {
                getStringStart = arr;                
            }
            if (flag === 2) {
                getStringEnd = arr;
                flag = 0;
            }
            if (getStringEnd !== undefined && getStringEnd > getStringStart){
                for( var jS = getStringStart; jS <= getStringEnd; jS++){
                    formattedString = formattedString.concat(finalAttrArray[jS]);
                }            
                stateAttributes.push(formattedString)
                formattedString = ''                            
            }
         }
         else if (flag!== 1) {
             stateAttributes.push(finalAttrArray[arr])            
         }
    }
    return stateAttributes;                
}

function setState(stateIdentifier, attrIdentifier) {
    readPathName = './TEMPLATE_RC_tags.json'
    var subStateObj;
    var stateAttributes = [];
    var newVal, arrVal;
    fs.readFile(readPathName, function reading(err, data) {
        if (err) { console.log(err); }
        var rcOb_String = data.toString();
        var rcTemplate_Obj = JSON.parse(rcOb_String);
        var key_rc, key_idealState;
        for (key_rc in rcTemplate_Obj) {
            if (key_rc === 'rc') {
                var idealStates = rcTemplate_Obj[key_rc];
                for (key_idealState in idealStates) {
                    if (key_idealState === stateIdentifier) {
                        subStateObj = idealStates[key_idealState]
                    }
                }
            }
        }
        var elementJson = [];
        if (stateIdentifier === 'FONT') {
            var key_Font;
            for (key_Font in subStateObj) {

                var attrSetLen = attrIdentifier.length;
                var idealAttrLen = subStateObj[key_Font].length;

            //    console.log(idealAttrLen + '****' + attrSetLen);
                for (var no = 0; no < attrSetLen; no++) {
                    if (key_Font === 'idm') {
                    //    console.log('idm');
                    }
                    if (key_Font === 'pointsize' && no === 0) {
                        console.log('pointsize'+attrIdentifier[no]);
                        var fontAtt = {
                            'pointsize': attrIdentifier[no]
                        }
                        elementJson.push(fontAtt)
                        console.log(fontAtt.toString());                        
                    }
                    if (key_Font === 'typeface') {

                    }
                    if (key_Font === 'weight') {

                    }
                    if (key_Font === 'italic') {

                    }
                    if (key_Font === 'charset') {

                    }
                }
            }
        }
        if (stateIdentifier === 'include') {

        }
        if (stateIdentifier === 'define') {

        }
        if (stateIdentifier === 'define') {

        }
        if (stateIdentifier === 'ShapesCursor') {
            // formatJSON(model_RC_JSON);
        }
        if (stateIdentifier === 'ShapesIcon') {

        }
        if (stateIdentifier === 'ShapesMenu') {

        }
        if (stateIdentifier === 'POPUP') {

        }
        if (stateIdentifier === 'MENUITEM') {

        }
        if (stateIdentifier === 'LTEXT') {

        }
    })
}

function getAttributes(y) {
    var attrs_Obj, attributeName, key_att;
    var attr_Count = 0;
    for (var x = 0; x < y.length; x++) {
        attrs_Obj = y[x];
        attributeName = '_attributes_Obj' + x;
        for (key_att in attrs_Obj) {
            if (key_att === attributeName) {
                if ((attrs_Obj[key_att]) !== null) {
                    attrArray = getDataFromJSONArray(attrs_Obj[key_att]);
                }
                attr_Count++;
            }
        }    
        finalAttrArray = finalAttrArray.concat(attrArray);     
    }
    return setAttributes(finalAttrArray);
}
// for 2 leveled arrays
function getDataFromJSONArray() {
    var eachElement, finalData;
    var y, fData1, fData2;
    attrArray = [];
    for (y = 0; y < arguments.length; y++) {
        eachElement = arguments[y];
        for (fData1 = 0; fData1 < eachElement.length; fData1++) {
            finalData1 = eachElement[fData1];
            for (fData2 = 0; fData2 < finalData1.length; fData2++) {
                finalData2 = finalData1[fData2];
                if (finalData2 !== null && finalData2 !== ',') {
                    if (finalData2 === '|') {
                        console.log('OR Styling');
                    } else {
                        attrArray.push(finalData2)
                       // console.log(finalData2);                        
                    }
                }
            }
        }
    }                        
    return attrArray;    
}

function getLoop(finalState) {
    var childName = 'child_' + child_Count;
    var child_Obj, key_loop, loop_Obj;
    console.log(finalState);
    
    for (var ch = 0; ch < finalState.length; ch++) {
        loop_Obj = finalState[ch];
        for (var l = 0; l < loop_Obj.length; l++) {
            child_Obj = loop_Obj[l];
            console.log(child_Obj);
            for (key_loop in child_Obj) {
                if (key_loop === loopStart) {
                    console.log('inloop' + loopStart);
                    //getLoopStart(attrs_Obj[key_att]);
                    loopS_Count++;
                }
                if (key_loop === childName) {
                    console.log('inchild' + childName);
                    var children = child_Obj[key_loop];
                    getState(children);
                    child_Count++;
                }
            }
            for (var le = 0; le < loop_Obj.length; le++) {
                loopEnd_Obj = child_Obj[le];
                for (key_loopEnd in loopEnd_Obj) {
                    if (key_loopEnd === loopEnd) {
                        //console.log('inloopEnd');
                        loopE_Count++;
                    }
                }

            }
        } if (ch === 1) {
            console.log(loop_Obj);

        }
    }
}
//function gets values param1/param2/.. from array object passed.
function state_Formatting(stateAttObj) {
    var key_state, key_att, states_Obj, loop_Obj, attrs_Obj, x, j, i, k;
    var stateName, attributeName, childName, key_child, child_Obj, key_loop;
   // var stateIdentifier;
    // var ob = clean(stateAttObj);
    // var cleanStateAttObj = removeNullValuesArray(ob);
    for (i = 0; i < stateAttObj.length; i++) {
        states_Obj = stateAttObj[i];
        for (j = 0; j < states_Obj.length; j++) {
            state_Obj = states_Obj[j];
            getState(state_Obj);
            stateName = 'StateName_Obj' + i;
            if (j === 1) {
                //loop_Obj = attrs_Obj[key_att];
                //  console.log(loop_Obj);    
                for (var ch = 0; ch < state_Obj.length; ch++) {
                    loop_Obj = state_Obj[ch];
                    for (var l = 0; l < loop_Obj.length; l++) {
                        child_Obj = loop_Obj[l];
                        for (key_loop in child_Obj) {
                            if (key_loop === loopStart) {
                                //console.log('inloop' + loopStart);
                                //getLoopStart(attrs_Obj[key_att]);
                                loopS_Count++;
                            }
                            if (child_Obj === childName) {
                                //console.log('inchild' + childName);
                                //    getLoopStart(child_Obj[child_Obj]);
                                child_Count++;
                            }
                        }
                    }
                }
            }

            for (k = 0; k < state_Obj.length; k++) {
                finalState = state_Obj[k];
                for (key_state in finalState) {
                    if (key_state === stateName) {
                        //  stateIdentifier = finalState[stateName];
                        //  setState(stateIdentifier);    
                        //  console.log(finalState[stateName]);
                    }
                    // if (key_state === loop_Start) {
                    //   //  child_Obj = finalState[key_state];
                    //     //    getLoopStart();
                    // } else {
                    //     for (var ls = 0; ls < finalState.length; ls++) {
                    //         child_Obj = finalState[ls];
                    //         for (key_child in child_Obj) {
                    //             if (key_child === 'loopStart_0') {
                    //                 //    console.log('loop0');
                    //                 loopS_Count++;
                    //             }
                    //             if (key_child === 'child_0') {
                    //                 //    console.log('child_0');

                    //             }
                    //         }
                    //     }
                    // }
                }
                // if (k === 1) {
                //     getAttributes(finalState);
                //     for (x = 0; x < finalState.length; x++) {
                //         attrs_Obj = finalState[x];
                //         attributeName = '_attributes_Obj' + x;
                //         for (key_att in attrs_Obj) {
                //             if (key_att === attributeName) {
                //                 getDataFromJSONArray(attrs_Obj[key_att]);
                //             }
                //         }
                //     }
                // }
                if (k === 2) {
                    for (key_state in finalState) {
                        if (finalState[key_state] === "NL") {
                            //    console.log('NL hey');
                        }
                    }
                }

            }
        }

    }

    //  console.log(stateName + "*****" + attributeName + "*****" + state_Obj.length );
}   //    return state_Obj;

//send the data for func loopStart
function getLoopStart() {
    var k, fData1, fData2, loop_obj, childName, loopName;
    for (k = 0; k < arguments.length; k++) {
        loop_obj = arguments[k];
        for (fData1 in loop_obj) {
            eachElement = loop_obj[fData1];
            loopName = 'loopStart_' + loopS_Count;
            childName = 'child_' + child_Count++;
            if (eachElement === loopName) {
                console.log(loopName);
                loopS_Count++;
            }
            if (eachElement === childName) {
                child_Obj = eachElement[fData1];
                console.log(childName);
                child_Count++;
            }
        }
    }
}

//remove remove all falsy values: undefined, null, 0, false, NaN and "" (empty string)
function removeNullValuesArray(actual) {
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

//used for removing null objects if any
function clean(RC_Ob) {
    for (var propName in RC_Ob) {
        if (RC_Ob[propName] === null || RC_Ob[propName] === undefined) {
            delete RC_Ob[propName];
        }
    }
    return RC_Ob;
}
function readJSON(readPathName) {
    fs.readFile(readPathName, function (err, data) {
        if (err) { console.log(err); }
        var rcOb_String = data.toString();
        var rcTemplate_Obj = JSON.parse(rcOb_String);
        return rcTemplate_Obj;                    
    })
}

/*parser = pegimport.buildParser('./RC_Grammer.peg');
content = parser.parse(RC_content);
console.log(content); */
// fs.readFile("./RC_Test.txt", function (err, data) {
//     if (err) { console.log(err); }
//     else {
//         RC_content = data.toString();
//         console.log(RC_content);
//     }
// })

// function getIdealStateObj(stateIdentifier, fn) {
//     readPathName = './TEMPLATE_RC_tags.json'
//     var subStateObj;
//     fs.readFile(readPathName, function reading(err, data) {
//         if (err) { console.log(err); }
//         var rcOb_String = data.toString();
//         var rcTemplate_Obj = JSON.parse(rcOb_String);
//         var key_rc, key_idealState;
//         for (key_rc in rcTemplate_Obj) {
//             if (key_rc === 'rc') {
//                 var idealStates = rcTemplate_Obj[key_rc];
//                 for (key_idealState in idealStates) {
//                     if (key_idealState === stateIdentifier) {
//                         subStateObj = idealStates[key_idealState]
//                     }
//                 }
//             }
//         }
//     })
// }