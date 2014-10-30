var capture = require('../index');

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


//var nodes = document.body.childNodes;
//console.log(nodes[nodes.length - 1]);