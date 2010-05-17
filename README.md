Ride - a Ringo in-browser code editor
=====================================

Ride is a Ringo [webapp extension][1] that allows editing of the 
webapp in the browser. 

[1]: http://ringojs.org/wiki/Webapp_Extensions

Ride uses [CodeMirror][2] as editor. You need to fetch CodeMirror 
using git-submodule:

    git submodule init
    git submodule update

[2]: http://marijn.haverbeke.nl/codemirror/

To enable Ride in a web application, add `ride/ide` to the list 
of extensions exported in your config.js module:

    exports.extensions = [
        "ride/ide"
    ];

After restarting your web application, you should be able to access 
Ride at `/_ride_/` in your webapp. You may want to define an auth 
rule for this resource to protect it against unauthorized access.


