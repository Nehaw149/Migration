var convert = require('xml-js');
var fs = require('fs');
var readPathName = "./Parsed_XAML.json";
var fileText = "";
var writePathName = "./Parsed_XAML.json";

var json = fs.readFileSync('./Parsed_XAML.json', 'utf8');
var options = {ignoreComment: true, spaces: 4};
var result = convert.js2xml(json, options);
console.log(result);


fs.readFile(writePathName, function (err, data) {
    if (err) { console.log(err); }
    else {
        RC_json = data.toString();
        RC_Ob = JSON.parse(RC_json);        
    }
})


function writeFiles(pathName, fileText) {
    fs.writeFile(pathName, fileText, (err) => {
        if (err) {
            console.error(err);
            return;
        };
    });
}