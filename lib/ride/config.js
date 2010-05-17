exports.urls = [
    [ '/', 'ride/actions' ]
];

exports.app = require('ringo/webapp').handleRequest;

exports.middleware = [
    'ringo/middleware/basicauth',
    'ringo/middleware/etag',
    'ringo/middleware/responselog',
    'ringo/middleware/notfound',
    'ringo/middleware/error'
];

exports.macros = [
    'ringo/skin/macros',
    'ringo/skin/filters'
];

exports.charset = 'UTF-8';
exports.contentType = 'text/html';
