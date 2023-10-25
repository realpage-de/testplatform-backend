const gulp = require('gulp'),
	  concat = require('gulp-concat'),
	  include = require('gulp-include'),
	  cleanCss = require('gulp-clean-css'),
	  minifyJs = require('gulp-minify');

if (process.argv.indexOf('--help') != -1 || process.argv.indexOf('-h') != -1) {
	console.log(`  ----------------------------------------
  Jobs:

  -css          run css

  -js           run js

  to run all jobs, use -a or --all

  ----------------------------------------
  Watcher:

  -w  --watch

  ----------------------------------------
  Minify:

  -m  --minify

  ----------------------------------------
  Examples:

  $ gulp --all --watch
  $ gulp -css -js --watch
  ----------------------------------------`);
	process.exit(0);
}

var useWatcher = (process.argv.indexOf('--watch') != -1 || process.argv.indexOf('-w') != -1) ? true : false;

var minifyJobs = (process.argv.indexOf('--minify') != -1 || process.argv.indexOf('-m') != -1) ? true : false;

var jobs = [];

var runAllJobs = (process.argv.indexOf('--all') != -1 || process.argv.indexOf('-a') != -1) ? true : false;


jobs = (runAllJobs || process.argv.indexOf('-css') != -1) ? jobs.concat(['css']) : jobs;
jobs = (runAllJobs || process.argv.indexOf('-js') != -1) ? jobs.concat(['js']) : jobs;

var tasks = jobs;

if (useWatcher) {
	tasks = jobs.concat(['watch']);
}

if (!jobs.length) {
	console.log(`  ----------------------------------------
     no jobs to do     use -h or --help
  ----------------------------------------`);
	process.exit(0);
}

gulp.task('css', () => {
	let stream = gulp.src('./src/Assets/css/app.css')
					.pipe(include())
					.pipe(concat('app.css'));
	if (minifyJobs) {
		stream.pipe(cleanCss());
	}
	stream.pipe(gulp.dest('./webroot/css/'));
	return stream;
});

gulp.task('js', () => {
	let stream = gulp.src('./src/Assets/js/app.js')
					.pipe(include())
					.pipe(concat('app.js'));
	if (minifyJobs) {
		stream.pipe(minifyJs({
			ext:{
				min:'.js'
			},
			noSource: true
		}));
	}
	stream.pipe(gulp.dest('./webroot/js/'));
	return stream;
});

gulp.task('watchCss', () => {
	gulp.watch(['**/*.css', '!webroot/css/*'], ['css']);
});

gulp.task('watchJs', () => {
	gulp.watch(['**/*.js', '!webroot/js/*'], ['js']);
});

gulp.task('watch', () => {
	jobs.forEach(function(job) {
		gulp.start('watch' + job.charAt(0).toUpperCase() + job.slice(1));
	});
});

gulp.task('default', tasks);