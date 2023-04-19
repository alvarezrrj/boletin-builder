#!/usr/bin/env node

if (process.argv.length === 3) {
	console.log('building');
	const build = require('./src/build');
} else {
	console.log('boletin-builder');
	console.log();
	console.log('Usage: ');
	console.log('boletin-builder <file_name>');
}
