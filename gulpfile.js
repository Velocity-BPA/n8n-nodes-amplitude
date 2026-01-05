const { src, dest, series } = require('gulp');
const rename = require('gulp-rename');

function copyIcons() {
	return src('nodes/**/*.svg')
		.pipe(rename((path) => {
			path.dirname = path.dirname.replace(/^nodes\//, '');
		}))
		.pipe(dest('dist/nodes/'));
}

exports['build:icons'] = series(copyIcons);
exports.default = series(copyIcons);
