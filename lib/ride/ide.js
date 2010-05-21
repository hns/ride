var {join} = require("fs");

exports.serverStarted = function(server) {
    var mountpoint = "/_ride_";
    server.getContext(mountpoint + "/static").serveStatic(join(module.directory, "static"));
    server.getContext(mountpoint).serveApplication({config: "ride/config", app: "app"});
};