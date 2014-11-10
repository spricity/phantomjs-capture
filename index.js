#!/usr/bin/env node

/*!
 * Capture - simple screenshot tool using PhantomJS
 * Copyright(c) 2014 spricity <spricity@gmail.com>
 * MIT Licensed
 */
var util = require('util');
var begin = new Date();
var program = require('commander');
var helpInfo = {
    'dir':['输出文件目录。eg: -d ./','Directory'],
    'output':['输出文件名。eg: -o xxx','File name'],
    'url':['需要截图的页面的URL。eg: -u http://ju.taobao.com', 'Remote URL'],
    'size':['需要截图的页面的宽度x高度, eg: -s 800x600', 'Captrue width x height, eg: -size 800x600'],
    'screenTimer':['滚屏的时间，如果该时间太短，可能造成一些异步加载的数据未返回时，页面出现空白等，单位:ms。 eg: -t 10000', 'Screen Timer'],
    'domHook':['DOM上的ID节点，表示此元素出现后将停止截屏，如 <div id="footer"></div>， -dh footer', 'DOM Hook'],
    'phantomPath':['phantomjs的路径，eg: -phantomPath /usr/local/bin/phantomjs', 'phantomjs path in your system'],
    'help':['帮助','Help']
};
var exec = require('child_process').exec,
    child;


var LANG = process.env.LANG || 'zh';
var langIndex = (LANG.indexOf('zh') === 0) ? 0 : 1;
program
    .version(require(__dirname+'/package.json').version)
    .option('-d, --dir [string]', helpInfo.dir[langIndex])
    .option('-o, --output [string]', helpInfo.output[langIndex])
    .option('-u, --url [string]', helpInfo.url[langIndex])
    .option('-s, --size [string]', helpInfo.size[langIndex])
    .option('-dh, --dom-hook [string]', helpInfo.domHook[langIndex])
    .option('-t, --screen-timer [integer]', helpInfo.screenTimer[langIndex])
    .option('-phantomPath, --phantomPath [string]', helpInfo.phantomPath[langIndex])
    .parse(process.argv);


var url = program.url || '';
var dir = program.dir || '.';

var param = {};
param.dir = dir;
param.url = url;
param.output = program.output || '';
param.size = program.size || '';
param.screenTimer = program.screenTimer || 1000;
param.domHook = program.domHook || '';
param.phantomPath = program.phantomPath || '';

var Capture = require('./capture/index');

var end = new Date();
var spend = end.getTime()-begin.getTime();
util.log('Server starup in ' +spend+' ms');

var init = function(config, callback){
    if(config){
        for(var key in config){
            param[key] = config[key];
        }
    }

    child = exec('which phantomjs', function(err, phantomPath, stderr){
        if(!err){
            phantomPath = phantomPath.replace('\n', '', phantomPath);
            Capture(param, callback, phantomPath);
        }else{
            Capture(param, callback);
        }
    });

}

module.exports = init;

