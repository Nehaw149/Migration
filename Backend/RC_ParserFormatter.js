// let RC_content, json1, cleanData, grammer, content, parser;
// const peg = require("pegjs");
// var pegimport = require('pegjs-import');
var convert = require('xml-js');
var fs = require('fs');
var abstractModel, structuralModel, presInterModel, states_JSON, attributes_JSON, RC_json, RC_Ob;
var state_Count = 0;
var attributes_Count = 0;
var loop_Count = 0;
var loopS_Count = 0;
var loopE_Count = 0;
var child_Count = 0;
var loopStart, loopEnd;
loopStart = 'loopStart_' + loopS_Count;
loopEnd = 'loopEnd_' + loopE_Count;

fs.readFile("./Parsed_RC_TEST.json", function (err, data) {
    if (err) { console.log(err); }
    else {
        RC_json = data.toString();
        RC_Ob = JSON.parse(RC_json);
        formatting(RC_Ob);
    }
})
var jsonk = fs.readFileSync('./Parsed_RC_TEST.json', 'utf8');
var options = {ignoreComment: true, spaces: 4};
var resultXML = convert.json2xml(jsonk, options);
console.log(resultXML);
// function writeXML(resultXML){
//     fs.writeFile("./Parsed_RC_TEST_MODEL.xml", resultXML, (err) => {
//         if (err) {
//             console.error(err);
//             return;
//         };
//     });
// }

var json2xml = require('json2xml');
 
fs.readFile('./Parsed_RC_TEST.json', 'utf8', function read (err, data) {
  if (err) console.log(err);
  fs.writeFile('./Parsed_RC_TEST_MODEL.xml', json2xml(JSON.parse(data)));
});

function formatting(RC_Ob) {
    for (var key in RC_Ob) {
        if (key === "Parsed_RC") {
            var rcAttObject = RC_Ob[key];
            for (var obj_type in rcAttObject) {
                if (obj_type === "Directive_Obj") {
                    var dirAttObject = rcAttObject[obj_type];
                    dir_Formatting(dirAttObject);
                }
                if (obj_type === "States_Obj") {
                    var stateAttObj = rcAttObject[obj_type];
                    state_Formatting(stateAttObj);
                    //   state_Formatting(eachState_Obj);
                }
            }
        }
    }
}

function dir_Formatting(dirAttObject) {
    var key;
    clean(dirAttObject);
    removeNullValuesArray(dirAttObject);
    for (var i = 0; i < dirAttObject.length; i++) {
        for (key in dirAttObject[i]) {
            //   console.log(key + " = " + dirAttObject[i][key].Dir);
            //var Directive_Obj = {}
            //formattedJSON = {}
            // dirAttObject_Val = dirAttObject[key];
        }
    }
}
//gets the state object
function getState() {
    var state_Obj, stateName, finalState, key_state, y;
    for (var j = 0; j < arguments.length; j++) {
        state_Obj = arguments[j];
        childName = 'child_' + child_Count;
        stateName = 'StateName_Obj' + state_Count;
        for (var k = 0; k < state_Obj.length; k++) {
            finalState = state_Obj[k];
            for (var x = 0; x < finalState.length; x++) {
                y = finalState[x];
                for (key_state in y) {
                    //console.log(y[key_state]);
                    if (key_state === stateName) {
                        structuralState = y[key_state];
                        structuralModel = {structuralModel: structuralState}
                        //  stateIdentifier = finalState[stateName];
                        //  setState(stateIdentifier);    
                        console.log(structuralModel.toString());
                        state_Count++;
                    }
                }
                if (x === 1) {
                   // getAttributes(y);
                }
            } if (k === 1) {
                //loop_Obj = attrs_Obj[key_att];
                //console.log(finalState);    
                getLoop(finalState);
            }

        }

    }
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
                    getDataFromJSONArray(attrs_Obj[key_att]);
                }
                attr_Count++;
            }
        }
    }
}
// for 2 leveled arrays
function getDataFromJSONArray() {
    var eachElement, finalData;
    var y, fData1, fData2;
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
                        console.log(finalData2);
                    }
                }
            }
        }
    }
}

function getLoop(finalState) {
    var childName = 'child_' + child_Count;
    var child_Obj, key_loop, loop_Obj;
    for (var ch = 0; ch < finalState.length; ch++) {
        loop_Obj = finalState[ch];
        for (var l = 0; l < loop_Obj.length; l++) {
            child_Obj = loop_Obj[l];
            // console.log(child_Obj);
            for (key_loop in child_Obj) {
                if (key_loop === loopStart) {
                    //console.log('inloop' + loopStart);
                    //getLoopStart(attrs_Obj[key_att]);
                    loopS_Count++;
                }
                if (key_loop === childName) {
                    //console.log('inchild' + childName);
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
        }if(ch === 1){
            console.log(loop_Obj);

        }
    }
}
    //function gets values param1/param2/.. from array object passed.
    function state_Formatting(stateAttObj) {
        var key_state, key_att, states_Obj, loop_Obj, attrs_Obj, x, j, i, k;
        var stateName, attributeName, childName, key_child, child_Obj, key_loop;
        var stateIdentifier;
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


    function arrayLooping() {
        var a, b;
        for (a = 0; a < arguments.length; a++) {
            for (b in arguments[a]) {
                getIsPresent(b, arguments[a]);
            }
        }
    }

    function getIsPresent() {

    }

    function setState() {
        if (arguments === 'ShapesCursor') {
            // formatJSON(model_RC_JSON);
        }
        if (arguments === 'ShapesIcon') {

        }
        if (arguments === 'ShapesMenu') {

        }
        if (arguments === 'POPUP') {

        }
        if (arguments === 'MENUITEM') {

        }
        if (arguments === 'LTEXT') {

        }
    }

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
    function returnArray() {
        var obj;
        for (var a = 0; a < arguments.length; a++) {
            obj = arguments[a];
        }

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

/*
{
    var dirCount = 0, stCount = 0, data = {};
    var nameArray = new Array(), valuesArray = new Array();
    var nA = "", vA = "";
    function setData() {
        // if (d) {
        //     dirCount++ ;
        //     { "directive":{ "d": d.join(""), "val":v.join("") } }
        // }
        // if (st_name){
        stCount++;
        function createKeys(stCount) {
            name = "name" + stCount;
            values = "values" + stCount;
        }
        nameArray[stCount] = st_name1.join("");
        valuesArray[stCount] = [st_val1.join(""), st_val2.join("")];
        nA = nameArray[stCount]
        vA = valuesArray[stCount]
        data: { name: nameArray };
    }
    return data;
}*/

