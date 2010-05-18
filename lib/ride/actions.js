var {skinResponse} = require('ringo/webapp/response');
var {Buffer} = require('ringo/buffer');
var {join, list, isAbsolute, isDirectory, isFile, exists, read, remove, write, canonical} = require('fs');
require('core/string');

exports.index = function(req) {
    return skinResponse('./skins/index.html', {});
};

var appdir = canonical(require.paths[0]);

exports.dir = function(req) {
    var buffer = new Buffer('<ul class="jqueryFileTree" style="display: none;">');
    var fileTemp = '<li class="file ext_%ext"><a href="#" rel="%path">%name</a></li>';
    var dirTemp = '<li class="directory collapsed"><a href="#" rel="%path/">%name</a></li>';
    var path = checkPath(req.params.dir);
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
    var file = checkPath(path);
    var content;
    if (exists(file)) {
        content = read(file);
    } else if (!isAbsolute(path)) {
        content = getResource(path).content;
    } else {
        throw new Error("invalid path: " + path);
    }
    return {
        status: 200,
        headers: {'Content-Type': 'text/plain'},
        body: ["<textarea>", content.escapeHtml(), "</textarea>"]
    };
};


exports.save = function(req) {
    for (var path in req.params) {
        var file = checkPath(path);
        if (exists(file)) {
            remove(file);
            write(file, req.params[path]);
        }
    }
    return {status: 200, headers: {}, body: ["ok"]};
};

function checkPath(path) {
    var file = canonical(join(appdir, path));
    // make sure file is contained in appdir
    if (file.indexOf(appdir) != 0) {
        throw new Error("invalid path: " + path);
    }
    return file;
}
