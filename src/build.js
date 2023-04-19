const fs = require('fs');
const juice = require('juice');
const he = require('he');
const minify = require('html-minifier').minify;

// Read contents of file passed in as command line argument
fs.readFile(process.argv[2], 'utf8', (err, data) => {
	// Validate links
	let dataArr = data.split('<body>');
	dataArr[0] += '<body>';
	dataArr[1] = dataArr[1]
		.replaceAll(/http:\/\//g, 'https://')
		.replaceAll(/https:\/\/www./g, 'https://')
	data = dataArr.join('');

	// Cache html tag
	let htmlRegExp = /<html.*?>/;
	let htmlTag = data.match(htmlRegExp)[0];

	// Encode html entities
	data = he.encode(data, {
		allowUnsafeSymbols: true
	});

	// Inline CSS
	data = juice(data, {
		removeStyleTags: false,
	});

	// Autoclose tags (they are removed by juice)
	const tags = ['br', 'img', 'meta', 'hr'];
	for (tag of tags) {
		let pattern = new RegExp(`(<${tag}.*?)(/?>)`, 'g')
		data = data.replaceAll(pattern, '$1/>');
	}
	
	// Replace styled html tag for old one,
	// effectively removing the style attr
	data = data.replace(htmlRegExp, htmlTag);

	// Minify
	const minified = minify(data, {
		removeComments: true,
		collapseWhitespace: true,
		keepClosingSlash: true,
		minifyCSS: true
	});

	let miniName = process.argv[2].split('.')[0] + '.html';
	
	// Write minified file
	fs.writeFile(miniName, minified, () => console.log('Minified file ready'));
	
});
