var {Response} = require('ringo/webapp/response');
var {Buffer} = require('ringo/buffer');
var {getErrors} = require('ringo/engine');
require('core/string');

// TODO fall back to normal error middleware for ordinary users
exports.middleware = function(app) {
    return function(env) {
        var result = trycatch(function() {return app(env); });
        if (result instanceof org.mozilla.javascript.RhinoException) {
            var res = new Response();
            res.status = 500;
            res.contentType = 'text/html';
            res.writeln('<h2>', result.details(), '</h2>');
            var errors = getErrors();
            for each (var error in errors) {
                res.writeln(processSyntaxError(error));
            }
            res.writeln('<p>In file<b>', result.sourceName(),
                        '</b>, line<b>', result.lineNumber(), '</b></p>');
            res.writeln('<h3>Script Stack</h3>');
            processScriptStack(result.scriptStackTrace);
            res.writeln(processScriptStack(result.scriptStackTrace));
            return res.close();
        }
        return result;
   };
};

function processSyntaxError(error) {
    var buffer = new Buffer();
    buffer.write("<div class='stack'>in <a href='javascript:parent.openModule(\"");
    buffer.write(error.sourceName).write("\")'>").write(error.sourceName);
    buffer.write("</a>, line ").write(error.line);
    buffer.write(": <b>").write(error.message).write("</b></div>");
    if (error.lineSource) {
        buffer.write("<pre>").write(error.lineSource).write("\n");
        for (var i = 0; i < error.offset - 1; i++) {
            buffer.write(' ');
        }
        buffer.write("<b>^</b></pre>");
    }
    return buffer;
}

function processScriptStack(stack) {
    stack = stack.trim().split(/[\n\r\t]+/);
    stack = stack.map(function(e) {
        e = e.substring(3).trim();
        return "<div class='stack'>in <a href='javascript:parent.openModule(\"" + e + "\")'>" + e + "</a></div>";
    }).join('');
    return stack;
}
