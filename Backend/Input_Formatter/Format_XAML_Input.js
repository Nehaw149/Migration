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

