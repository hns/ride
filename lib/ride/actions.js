var {skinResponse} = require('ringo/webapp/response');
var {Buffer} = require('ringo/buffer');
var {join, list, isDirectory, isFile, exists, read, remove, write} = require('fs');
require('core/string');

exports.index = function(req) {
    return skinResponse('./skins/index.html', {});
};

var appdir = require.paths[0];

exports.dir = function(req) {
    var buffer = new Buffer('<ul class="jqueryFileTree" style="display: none;">');
    var fileTemp = '<li class="file ext_%ext"><a href="#" rel="%path">%name</a></li>';
    var dirTemp = '<li class="directory collapsed"><a href="#" rel="%path/">%name</a></li>';
    var path = join(appdir, req.params.dir);
    var dirlist = list(path).sort(function(a, b) {
        var fa = join(path, a);
        var fb = join(path, b);
        if (isDirectory(fa) && isFile(fb)) {
            return 1;
        } else if (isFile(fa) && isDirectory(fb)) {
            return -1;
        }
        return (a.toLowerCase() > b.toLowerCase());
    });
    for each (var file in dirlist) {
        var absPath = join(path, file);
        var relPath = absPath.substring(appdir.length);
        if (isDirectory(absPath)) {
            buffer.write(dirTemp.replace(/%path/, relPath).replace(/%name/, file));
        } else {
            buffer.write(fileTemp.replace(/%ext/, "txt").replace(/%path/, relPath).replace(/%name/, file));
        }
    }
    buffer.write('</ul>');
    return {status: 200, headers: {}, body: buffer};
};

exports.load = function(req) {
    var path = req.params.path;
    if (path.startsWith('/')) {
        path = path.substring(1);
    }
    var file = join(appdir, path);
    var content = exists(file) ? read(file) : getResource(path).content;
    return {status: 200, headers: {'Content-Type': 'text/plain'}, body: ["<textarea>", content, "</textarea>"]};
};


exports.save = function(req) {
    for (var p in req.params) {
        var file = join(appdir, p);
        if (exists(file)) {
            remove(file);
            write(file, req.params[p]);
        }
    }
    return {status: 200, headers: {}, body: ["ok"]};
};
