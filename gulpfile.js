/*
  /gulfile.js
  Listingslab's Gulp Build Process
*/

var clear 		= require('clear');
var colors 		= require('colors');
var del 		= require('del');
var runSequence = require('run-sequence');
var gulp 		= require('gulp');
var uglify 		= require('gulp-uglify');

gulp.task('compress', function() {
  return gulp.src('build/bundle.js')
    .pipe(uglify())
    .pipe(gulp.dest('api/public/'));
});

gulp.task('clean', function() {
  return del('build');
});

gulp.task('default',function (){
	clear ();
	console.log('Listingslab MEAN Stack Software'.america);
	runSequence(
		'compress',
		'clean'
	);
	// gulp.watch('build/bundle.js', ['compress', 'clean']);
});
