var convert = require('xml-js');
var fs = require('fs');
var readPathName = "./Parsed_RC_TEST.json";
var fileText = "";
var writePathName = "./Parsed_RC_TEST_MODEL.xml";

var json = fs.readFileSync(readPathName, 'utf8');
var options = { ignoreComment: true, spaces: 4, compact: true };
var result = convert.json2xml(json, options);
writeFiles(writePathName, result);

fs.readFile(readPathName, function (err, data) {
    if (err) { console.log(err); }
    else {
        RC_json = data.toString();
        RC_Ob = JSON.parse(RC_json);
    }
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