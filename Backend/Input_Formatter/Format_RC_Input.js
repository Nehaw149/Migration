var fs = require("fs")
var ASTY = require("asty")
var PEG = require("pegjs")
var PEGUtil = require("pegjs-util")

// var asty = new ASTY()
// var parser = PEG.generate(fs.readFileSync("./RC_Grammer.pegjs", "utf8"))
// var result = PEGUtil.parse(parser, fs.readFileSync("../INPUT_Examples/RC_Test_1.txt", "utf8"), {
//     startRule: "ExpectedSequence",
//     makeAST: function (line, column, offset, args) {
//         return asty.create.apply(asty, args).pos(line, column, offset)
//     }
// })
// if (result.error !== null)
//     console.log("ERROR: Parsing Failure:\n" +
//         PEGUtil.errorMessage(result.error, true).replace(/^/mg, "ERROR: "))
// else
//     console.log(result.ast.dump().replace(/\n$/, ""))

// var grammar = fs.readFileSync("./RC_Grammer.pegjs", "utf8")
// var ast, parser;

// ast = PEG.parser.parse(grammar)
// parser = PEG.compiler.compile(ast)
// parser = PEG.generate(grammar)

// var inputString = fs.readFileSync("../INPUT_Examples/Final_ResourceFile.rc","utf8")
// console.log(parser.parse(inputString))
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}

var input_RC_Obj = JSON.parse(fs.readFileSync("../INPUT_Examples/JSONs/Final_ResourceFile.json", "utf8"))
var dirAttObject = {}, stateAttObj = {}
var input_RC_String = JSON.stringify(input_RC_Obj)

var emptyString = '",","'
var nullArrayElementString = ',null'

input_RC_String = input_RC_String.replaceAll(emptyString,'"')
input_RC_String = JSON.stringify(JSON.parse(input_RC_String.replaceAll(nullArrayElementString,'')))
input_RC_String = input_RC_String.replaceAll('"NL"','')
input_RC_String = input_RC_String.replace(/,\[\]/g, '')
input_RC_Obj = JSON.parse(input_RC_String)
fs.writeFileSync("../INPUT_Examples/JSONs/Final_ResourceFile.json", input_RC_String)

var dirAttObject = {}, stateAttObj = {}
formatting_RC_input(input_RC_Obj)
function formatting_RC_input(RC_Obj) {
    for (var key_obj_type in RC_Obj.Parsed_RC) {
        if (key_obj_type == "Directive_Obj") {
            dirAttObject = RC_Obj.Parsed_RC[key_obj_type];
            dir_Formatting(dirAttObject);
        }
        if (key_obj_type == "Block_elements_Obj") {
            stateAttObj = RC_Obj.Parsed_RC[key_obj_type];
        //    state_Formatting(stateAttObj);
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
                    console.log(dirObjDetails[key_dir]);
                }
                if (key_dir === '_text') {
                    dir_JSON = { "Directive": {} }
                    console.log(dirObjDetails[key_dir]);
                }
            }
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
} 
