Ride - a Ringo in-browser code editor
=====================================

Ride is a [Ringo][1] webapp [extension][2] that allows editing of the
webapp in the browser.

[1]: http://ringojs.org/
[2]: http://ringojs.org/wiki/Webapp_Extensions

Ride uses [CodeMirror][3] as editor. You need to fetch CodeMirror
using git-submodule:

    git submodule init
    git submodule update

[3]: http://marijn.haverbeke.nl/codemirror/

To enable Ride in a web application, add `ride/ide` to the list 
of extensions exported in your config.js module:

    exports.extensions = [
        "ride/ide"
    ];

After restarting your web application, you should be able to access 
Ride at `/_ride_/` in your webapp.

Note that giving someone access to Ride gives them full access to your machine.
Think twice before installing Ride on a publicly accessible server, and
definitely use some sort of protection (Ride comes preconfigured with
[basicauth middleware](http://ringojs.org/api/master/ringo/middleware/basicauth),
you only have to define an auth role in your main app's `config` module). 


