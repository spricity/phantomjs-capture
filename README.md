# phantomjs-capture for NodeJS

Simple and lightweight HTML to image capture and html using Node and PhantomJS.

## 1、Installation

```
npm install phantomjs-capture
```

## 2、Dependencies

1. node-phantom-simple
2. mkdirp
3. commander
4. colors
5. Phantom [http://phantomjs.org/download.html](http://phantomjs.org/download.html)


The API exposes a single function 'capture'. Using this function, you can input a multitude of settings, which are further specified below:

```
var capture = require('phantomjs-capture');

capture(options, function(err, result) {

    console.log(result.fullPNGPath);        // PNG PATH
    console.log(result.filePNGName);        // PNG File Name
    console.log(result.fileHTMLPath);       // HTML PATH
    console.log(result.fileHTMLName);       // HTML File Name
});

```

## 3、Using on node

You must install phantom from [http://phantomjs.org/download.html](http://phantomjs.org/download.html)

### 3.1、Options

Calling capture() requires an options object, which includes the following definitions:

```
{
   'url': 'http://ju.taobao.com', // 需要截图的页面的URL，必须的参数; Remote URL, Required.
   'dir': '.', // 输出文件目录; Directory
   'output': 'xxx.png', // 输出文件名; File name
   'size': '1920x768', // 需要截图的页面的宽度x高度, eg: -s 800x600; Captrue width x height, eg: -size 800x600
   'screenTimer': 1000, // 滚屏的时间，如果该时间太短，可能造成一些异步加载的数据未返回时，页面出现空白等，单位:ms。 eg: -t 10000; Screen Timer
   'domHook': 'ju-footer' // DOM上的ID节点，表示此元素出现后将停止截屏，如 <div id="footer"></div>， -hook footer; DOM Hook
}
```
### 3.2 Example

test.js 

```
var capture = require('phantomjs-capture');

capture({
    dir: '.',
    output: 'xx.png',
    url: 'http://ju.taobao.com',
    size: '1920x800',
    domHook: 'ju-footer',
    screenTimer: 6000
}, function(err, results){
    console.log(arguments);
});
```

## 5、Using on shell

You must install phantom from [http://phantomjs.org/download.html](http://phantomjs.org/download.html)

### 5.1 Command

  Usage: capture [options]

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -d, --dir [string]            输出文件目录。eg: -d ./
    -o, --output [string]         输出文件名。eg: -o xxx.png
    -u, --url [string]            需要截图的页面的URL。eg: -u http://ju.taobao.com
    -s, --size [string]           需要截图的页面的宽度x高度, eg: -s 800x600
    -dh, --dom-hook [string]      DOM上的ID节点，表示此元素出现后将停止截屏，如 <div id="footer"></div>， -hook footer
    -phantomPath, --phantomPath [string] phantomjs的路径， -phantomPath /usr/local/bin/phantomjs
    -t, --screen-timer [integer]  滚屏的时间，如果该时间太短，可能造成一些异步加载的数据未返回时，页面出现空白等，单位:ms。 eg: -t 10000
    
### 5.2 example

```
capture --dir . --output xx --url http://ju.taobao.com -size 1920x800 -dom-hook ju-footer -screen-timer 6000 -phantomPath /usr/local/bin/phantomjs
```

or

```
capture -d . -o xx -u http://ju.taobao.com -s 1920x800 -dh ju-footer -s 6000
```