var phantom=require('node-phantom-simple');
var util=require('util');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var colors = require('colors');


var startTime = new Date().getTime();
var Capture = function(params, callback, phantomPath){
    if(!params.url){
        util.error('请指定URL'.bold.red);
        return;
    }
    var dir = params.dir || '.';
    var resolve_path = path.resolve(params.dir);
    var date = new Date();
    var output = params.output || '';
    if(!output){
        var str = date.toString() + params.url;
        output = crypto.createHash('md5').update(str).digest("hex") + '.png';
    }
    var real_output = path.join(resolve_path, output);
    if (!fs.existsSync(resolve_path)) {
        mkdirp.sync(resolve_path, {mode: 0777});
    }

    phantomPath = params.phantomPath || phantomPath || 'phantomjs';

    phantom.create(function(err,ph) {
        return ph.createPage(function(err,page) {
            page.onCallback = function(times) {
                process.stdout.write('#'.gray);
                if(times.status == 'end'){
                    process.stdout.write(" 100%".magenta + '\n');
                    var endTime = new Date().getTime();
                    var diffTime = startTime - endTime;
                    var timeMinute = parseInt(diffTime / 1000 / 60, 10);
                    var timeSecond = (diffTime - timeMinute *60 * 1000) / 1000;
                    util.log('Real time spend: ' + timeMinute + 'm ' + timeSecond + 's' );

                    var tmpFilePath = real_output.split('.png');
                    var filePath = tmpFilePath[0];
                    var tmpFileName = output.split('.png');
                    var fileName = tmpFileName[0];

                    var html = times.html.replace('charset="gbk"', 'charset="utf-8"', times.html);


                    fs.open(filePath + '.html',"w",0644,function(e,fd){
                        if(e) throw e;
                        fs.write(fd, html, 0, 'utf8', function(e){
                            if(e) throw e;
                            fs.closeSync(fd);
                        });
                    });

                    page.render(filePath + '.png', function (err) {
                        if(err){
                            callback && callback(err, {});
                        }else{
                            util.log("截图成功：".green + "，" + "图片保存在：".gray + real_output.underline.cyan)
                            callback && callback(null, {
                                fullPNGPath: filePath + '.png',
                                filePNGName: fileName + '.png',
                                fullHTMLPath: filePath + '.html',
                                fileHTMLPath: fileName + '.html'
                            });
                        }
                        ph.exit();
                    });
                }else if(times.status == 'error'){
                    util.log(times.msg.toString().red);
                    ph.exit();
                }
            };
            var size;
            if(params.size){
                size = params.size.split('x');
                try{
                    var width = parseInt(size[0], 10), height = parseInt(size[1], 10);
                    size = {
                        width: width,
                        height: height
                    }
                }catch (e){
                    size = false;
                }
            }
            var screenTimer = params.screenTimer || 1000;
            var domHook = params.domHook || '';
            var open = function(params){
                return page.open(params.url, function(err,status) {
                    util.log("opened site? " + status.green);
                    if(status !== 'success'){
                        ph.exit();
                    }
                    return page.evaluate(function(config) {
                        //此函数在目标页面执行的，上下文环境非本phantomjs，所以不能用到这个js中其他变量

                        //window.scrollTo(0,10000);//滚动到底部
                        //window.document.body.scrollTop = document.body.scrollHeight;
                        var renderTime = new Date().getTime();
                        var height = document.body.scrollHeight;
                        var _height = 0;
                        var itemRenderTime = config.screenTimer || 100;
                        var diffHeight = window.innerHeight;
                        var totalTime = height / diffHeight * itemRenderTime;
                        var run = function(footer){

                            var interval = setInterval(function(){

                                window.scrollTo(0, _height + diffHeight);
                                _height += diffHeight;
                                if(footer){
                                    var top = footer.getBoundingClientRect().top //元素顶端到可见区域顶端的距离
                                    var se = document.documentElement.clientHeight //浏览器可见区域高度。
                                }else{
                                    var top = height;
                                    var se = _height;
                                }

                                if(top <= se ) {
                                    clearInterval(interval);
                                    window.callPhantom({
                                        status: 'end',
                                        top: top,
                                        html: '<!DOCTYPE html><html>'+document.documentElement.innerHTML+'</html>',
                                        doctype: document.doctype,
                                        se: se
                                    });
                                }else{
                                    window.callPhantom({
                                        status: 'ing',
                                        top: top,
                                        se: se
                                    });
                                }
                            }, itemRenderTime);
                        }

                        if(config.domHook){
                            try{
                                var footer = document.getElementById(config.domHook);
                                if(!footer){
                                    window.callPhantom({
                                        status: 'error',
                                        msg: '页面上不存在该【id='+config.domHook+'】的DOM节点'
                                    });
                                    return false;
                                }
                            }catch(e){
                                window.callPhantom({
                                    status: 'error',
                                    msg: '页面上不存在该【id='+config.domHook+'】的DOM节点'
                                });
                                return false;
                            }
                            run(footer);
                        }else{
                            run(null);
                        }
                        return {
                            renderTime: renderTime,
                            totalTime: totalTime * 3
                        };
                    }, function(err, times) {
                        if(times){
                            var mayTime = (times.renderTime - startTime) + times.totalTime;
                            var timeMinute = parseInt(mayTime / 1000 / 60, 10);
                            var timeSecond = (mayTime - timeMinute *60 * 1000) / 1000;
                            util.log('Start Download..., Expected to spend ' + timeMinute + 'm ' + timeSecond + 's');
                        }
                    }, {
                        screenTimer: screenTimer,
                        domHook: domHook
                    });

                });
            }
            if(size){
                return page.set('viewportSize', size, function(){
                    return open(params);
                });
            }else{
                return open(params);
            }


        });
    },{
        phantomPath: phantomPath
    });
}

module.exports = Capture;