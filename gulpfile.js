var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var clean = require('gulp-clean');

gulp.task('clean', function() {
    return gulp.src('dist', {read: false, allowEmpty:true})
        .pipe(clean());
});

gulp.task('default', function() {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest('dist'));
});