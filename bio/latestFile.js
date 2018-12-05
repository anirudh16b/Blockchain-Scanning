var fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

// Return only base file name without dir
 module.exports.getMostRecentFileName = function(dir) {
    var files = fs.readdirSync(dir);
    //    console.log(files)
    // use underscore for max()
    return _.max(files, function (f) {
        var fullpath = path.join(dir, f);

        // ctime = creation time is used
        // replace with mtime for modification time
        return fs.statSync(fullpath).mtime;
    });
}

