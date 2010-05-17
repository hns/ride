var {join} = require("fs");

exports.serverStarted = function(server) {
    var mountpoint = "/_ride_";
    server.addStaticResources(mountpoint + "/static", null, join(module.directory, "static"));
    server.addApplication(mountpoint, null, {config: "ride/config", app: "app"});
};