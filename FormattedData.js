var fs = require('fs');
var XAML_json, XAML_ob, RC_json, RC_ob;
fs.readFile('./Parsed_XAML.json', 'utf-8', function (err_xaml, data_xaml) {
  if (err_xaml){
    console.log(err_xaml);
    fs.readFile('./Parsed_RC.json', 'utf-8', function (err_rc, data_rc) {
    // if error in XAML reading, RC file will be taken 
    if (err_rc){
        console.log(err_rc);
    }
    RC_json = data_rc.toString();
    RC_ob = JSON.parse(RC_json);
    })
    }
  XAML_json = data_xaml.toString();
  XAML_ob = JSON.parse(XAML_json);
})