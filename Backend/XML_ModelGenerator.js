var fs = require('fs');
var XAMLjson, XAMLob;
fs.readFile('./Parsed_XAML.json', 'utf-8', function (err, data) {
  if (err)
    console.log(err);
  XAMLjson = data.toString();
  XAMLob = JSON.parse(XAMLjson);
  // keys = Object.keys(XAMLob)[0];
  // if(XAMLjson.hasOwnProperty("Window")){
  //   console.log(true);
  // }
  for (var keys in XAMLob) {
    if (keys === "Window") {
      //   if(XAMLob.hasOwnProperty(key1)) {
      //     var value = XAMLob[key1];
      //     if(value === "_attributes"){
      //       for (var atts in key1) {
      //       var atts = 
      //     }
      //     //do something with value;
      //   }
      console.log("Window");
      
      var windowAttObject = XAMLob[keys];
      for (var win_atts in windowAttObject) {
        if (win_atts === "_attributes") {
          console.log("_attributes");
          var win_atts_attsObj = windowAttObject[win_atts];
          for (var detailed_atts in win_atts_attsObj) {
            if (detailed_atts === "x:Class") {
              var Class = win_atts_attsObj[detailed_atts];
              console.log("x:Class + ", Class);
            }
            if (detailed_atts === "xmlns") {
              var xmlns = win_atts_attsObj[detailed_atts];
              console.log("xmlns + ", xmlns);            
            }
            if (detailed_atts === "xmlns:x") {
              var x = win_atts_attsObj[detailed_atts];
              console.log("xmlns:x + ", x);
            }
            if (detailed_atts === "Title") {
              var Title = win_atts_attsObj[detailed_atts];
              console.log("Title + ", Title);
            }
            if (detailed_atts === "Height") {
              var Height = win_atts_attsObj[detailed_atts];
              console.log("Height + ", Height);
            }
            if (detailed_atts === "Width") {
              var Width = win_atts_attsObj[detailed_atts];
              console.log("Width + ", Width);
            }
          }
        }
        if (win_atts === "_text") {
          console.log("_text");
        }
        if (win_atts === "DockPanel") {
          console.log("DockPanel");
          var dock_atts_attsObj = windowAttObject[win_atts];
          for (var detailed_atts in dock_atts_attsObj) {
            if (detailed_atts === "x:Class") {
              var Class = win_atts_attsObj[detailed_atts];
              console.log("x:Class + ", Class);
            }
            if (detailed_atts === "x:Class") {
              var Class = win_atts_attsObj[detailed_atts];
              console.log("x:Class + ", Class);
            }
            if (detailed_atts === "x:Class") {
              var Class = win_atts_attsObj[detailed_atts];
              console.log("x:Class + ", Class);
            }
            if (detailed_atts === "x:Class") {
              var Class = win_atts_attsObj[detailed_atts];
              console.log("x:Class + ", Class);
            }
          }
        }
      }
      js = { keys: window_att };
    //  writeJSON(JSON.parse(js));
    }
  }

  function writeJSON(jsonOut) {
    fs.writeFile("./Parsed_JSON.json", jsonOut, (err) => {
      if (err) {
        console.error(err);
        return;
      };
    });
  }
  // Object.keys(XAMLob).forEach(function(k) {
  //   if(k === "Window") {
  //     console.log(k[name]);

  //     var result = XAMLob.row;
  //     for (var i = 0; i < result.length; i++) {
  //       var object = result[i];
  //        for (property in object) {
  //         var value = object[property];
  //       }
  //     }
  //   }
  //   else if (k === "DockPanel") {
  //       // do more stuff
  //       console.log(k);      
  //   }
  //   else {
  //       // do something
  //   }
  // });

})