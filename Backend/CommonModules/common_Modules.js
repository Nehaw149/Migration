var fs = require('fs')
//var errorLog = function(){this.errorText = this.arguments}
//var readFileAt = "./errorLog.txt"
//var writeFileAt = "./errorLog.txt"

var errorLog = function(line, readFileAtLoc, writeFileAtLoc) {    
    var errorText = line
    var readError = fs.readFileSync(readFileAtLoc, "utf-8")

    fs.writeFileSync(writeFileAtLoc, (readError + '\n' + errorText))
}

var cleanup = function(writeFileAtLoc){
    fs.writeFileSync(writeFileAtLoc, "")
}

module.exports = {
    errorLog: errorLog,
    cleanup: cleanup
}