var fs = require('fs');

function xamlGenerator() {
    var readPathName = './Parsed_XAML.json'
    fs.readFile(readPathName, function (err, data) {
        if (err) { console.log(err); }
        xaml_Ob_String = data.toString();
        xaml_Ob = JSON.parse(xaml_Ob_String);
        console.log('hey'+ data.toString());
        formatting(xaml_Ob)
    })
}

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
        if (key === "Window") {
            
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