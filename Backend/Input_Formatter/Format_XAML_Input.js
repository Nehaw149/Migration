var util = require('util');
var fs = require('fs');
var convert = require('xml-js');
var parseString = require('xml2js').parseString;

var json_xmljs = fs.readFileSync('../INPUT_Examples/XAML_Test2.xaml', 'utf8');
var result1 = convert.xml2json(json_xmljs, { compact: true, spaces: 4 });
writeJSON(result1);

function writeJSON(jsonOut) {
    fs.writeFile("../INPUT_Examples/JSONs/Parsed_XAML.json", jsonOut, (err) => {
        if (err) {
            console.error(err);
            return;
        };
    });
}

parseString(json_xmljs, {
    tagNameProcessors: [nameToUpperCase]},
    (err, result) => {
        console.log(result)
    });

function nameToUpperCase(name) {
    return name.toUpperCase();
}

// parseString(json_xmljs, {
//     tagNameProcessors: [nameToUpperCase],
//     attrNameProcessors: [nameToUpperCase],
//     valueProcessors: [nameToUpperCase],
//     attrValueProcessors: [nameToUpperCase]},
//     (err, result) => {
//         console.log(result)
//     });

// var resultXML, jsonTest;
// var fileXML = fs.readFile('./Parsed_XAML.json', 'utf8', function (err, data) {
//     parseString(data, { trim: true }, function (err, result) {
//         resultXML = util.inspect(result, false, null);
//         writeXML(resultXML);
//     })
// });

// function writeXML(resultXML){
//     fs.writeFile("./Parsed_RC_TEST_MODEL.xml", resultXML, (err) => {
//         if (err) {
//             console.error(err);
//             return;
//         };
//     });
// }
//     // function clean(obj) {
    //     for (var propName in obj) {
    //         if (obj[propName] === null || obj[propName] === undefined) {
    //             delete obj[propName];
    //         }
    //     }
    // }
    // function Object_keys(obj) {
    //     if (typeof Object.keys !== "function") {
    //         (function() {
    //             var hasOwn = Object.prototype.hasOwnProperty;
    //             Object.keys = Object_keys;
    //             function Object_keys(obj) {
    //                 var keys = [], name;
    //                 for (name in obj) {
    //                     if (hasOwn.call(obj, name)) {
    //                         keys.push(name);
    //                     }
    //                 }
    //                 return keys;
    //             }
    //         })();
    //     }
    // }
