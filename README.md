# MarkdownToHtml
基于Node.js markdown实时转换为html
---

hexo可以将Markdown 格式的内容自动生成方便发布的 HTML 格式。本文将尝试探讨 hexo 的运行原理。

创建md文件，键入markdown格式数据。 



实现思路：
1. 基于node fs模块，读取md文件，生成字符串。
2. 借助markdown-it(Markdown 文件解析器)，将md文件以字符串形式传入。
3. 结合模板生成html文件。
<!-- more -->

目录结构
```js
.
├── README.md
├── dist
│   └── index.html
├── fileConfig
│   └── index.json
├── main.js
├── package-lock.json
├── package.json
├── pages
│   └── index.md
└── template
    └── index.js
```


```js
mkdir dist  && // 生成的html文件夹
mkdir pages && touch index.md && // md文件夹
fileConfig && touch index.json && // 配置文件
&& touch template.js // 模板文件
touch main.js // 入口文件 
```


1.fileConfig/index.json
```json
// html配置文件
{
  "lang": "en",
  "title": "Index",
  "stylesheets": [
    "./css/style.css"
  ],
  "scripts": [
    "./js/main.js"
  ],
  "charset": "utf-8",
  "description": "This is a page",
  "keywords": "page, sample",
  "author": "None",
  "favicon": "./images/favicon.png",
  "viewport": "width=device-width, initial-scale=1",
  "extra": []
}
```
2.template/index.js
```js
// html模板
var md = require('markdown-it')();
module.exports = {
  generatePage: function (pageContent, pageMeta) {
    return `<!DOCTYPE html>
<html lang="${pageMeta.lang || this.defaultMeta.lang}">
  <head>
    <title>${pageMeta.title || this.defaultMeta.title}</title>
    <meta charset="${pageMeta.charset || this.defaultMeta.charset}">
    <meta name="description" content="${pageMeta.description || this.defaultMeta.description}">
    <meta name="keywords" content="${pageMeta.keywords || this.defaultMeta.keywords}">
    <meta name="author" content="${pageMeta.author || this.defaultMeta.author}">
</head>
<body>
  ${md.render(pageContent)}
</body>
</html>
    `;
  }
}
```
3.main.js
```js
const path = require('path');
const fs = require('fs-extra');

const pages = './pages';
const pageTemplate = require('./template');
const outputPath = './dist';
const pagesMetaPath = './fileConfig';
const pagesMeta = {};

// 1.清空dist
console.log('clearing dist...');
for (var file of fs.readdirSync(outputPath)) {
  fs.removeSync(path.join(outputPath, file));
}

// 2.加载配置文件
console.log('Loading pages metadata...');
for (var pageMeta of fs.readdirSync(pagesMetaPath)) {
  pagesMeta[pageMeta] = fs.readFileSync(path.join(pagesMetaPath, pageMeta), 'utf8');
}

// 3.生成html

for (var page of fs.readdirSync(pages)) {
  var pageName = page.slice(0, page.lastIndexOf('.'));
  var metaData = pagesMeta.hasOwnProperty(pageName + '.json')
    ? JSON.parse(pagesMeta[pageName + '.json'])
    : {};
  metaData.title = metaData.title || pageName;

  var pageContent = fs.readFileSync((path.join(pages, page))).toString()
  fs.writeFileSync(
    path.join(outputPath, pageName + '.html'),
    pageTemplate.generatePage(pageContent, metaData));
}

```
4.pages/index.md
```md
# Home page
Hello world!  
[Link to another page](./other.html)
1. 222222222222222233
  不思量自难忘
好多年以前
```

最后处理下环境
```js
npm i -s live-server — 该模块支持本示例生成静态 HTML 站点，提供热部署能力
npm i -s nodemon — 该模块支持当文件变化自动执行重构任务
npm i -s concurrently — 该模块支持支持并发执行任务、脚本(scripts/tasks)

// package.json
{
  "name": "markdowntohtml",
  "version": "1.0.0",
  "description": "基于Node.js html生成。",
  "main": "index.js",
  "scripts": {
    "build-pages": "node main.js",
    "start": "concurrently --kill-others \"nodemon -e js,json,css,md -i build -x \\\"npm run build-pages\\\"\" \"live-server ./dist\"",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "concurrently": "^4.1.0",
    "fs": "0.0.1-security",
    "fs-extra": "7.0.1",
    "live-server": "^1.2.1",
    "markdown-it": "8.4.2",
    "nodemon": "^1.18.11"
  }
}

```
![示例图](markdown.jpg)
[github地址](https://github.com/xiangergou/MarkdownToHtml.git)

参考资料：
[玩转编程语言:基于Node.js构建自定义代码生成器](https://riboseyim.github.io/2017/12/21/Language-Auto-Generator/) ---一堆bug
[node官方文档](http://nodejs.cn/api/fs.html)

