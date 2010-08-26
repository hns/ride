
exports.serverStarted = function(server) {
    var mountpoint = "/_ride_";
    server.getContext(mountpoint + "/static").serveStatic(module.resolve("static"));
    server.getContext(mountpoint).serveApplication({config: "ride/config", app: "app"});
};