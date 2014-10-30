var capture = require('phantomjs-capture');

capture({
    dir: '.',
    output: 'xx2',
    url: 'http://ju.taobao.com',
    size: '1920x800',
    domHook: 'ju-footer',
    screenTimer: 6000
}, function(err, results){
    console.log(results);
})