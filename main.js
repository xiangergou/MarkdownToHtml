// clean dir-build

const path = require('path');
const fs = require('fs-extra');

const pages = './pages';
const pageTemplate = require('./template');
const outputPath = './dist';
const pagesMetaPath = './fileConfig';
const pagesMeta = {};

// fs.readdir(outputPath, (err, files) => {
//   if (err) throw err;

//   for (const file of files) {
//     console.log((path.join(outputPath, file)));
//     fs.unlinkSync(path.join(outputPath, file), err => {
//       if (err) throw err;
//     });
//   }
// });
// fs.removeSync(outputPath)
// for (var file of fs.readdirSync(outputPath)) {
//   console.log(path.join(outputPath, file))
//   fs.unlinkSync(path.join(outputPath, file))
// }
for (var file of fs.readdirSync(outputPath)) {
  fs.removeSync(path.join(outputPath, file));
}


//Loading
console.log('Loading pages metadata...');
for (var pageMeta of fs.readdirSync(pagesMetaPath)) {
  pagesMeta[pageMeta] = fs.readFileSync(path.join(pagesMetaPath, pageMeta), 'utf8');
}

// console.log('Generating pages...');
// for (var page of Object.entries(pages)) {
//   var pageName = page[0].slice(0, page[0].lastIndexOf('.'));
//   console.log(pageName)
//   var metaData = pagesMeta.hasOwnProperty(pageName + '.json')
//     ? JSON.parse(pagesMeta[pageName + '.json'])
//     : {};
//   metaData.title = metaData.title || pageName;
//   var pageContent = page[1];
//   fs.writeFileSync(
//     path.join(outputPath, pageName + '.html'),
//     pageTemplate.generatePage(pageContent, metaData));
// }

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