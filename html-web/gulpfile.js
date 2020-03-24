var gulp = require('gulp');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var clean = require('gulp-clean');
var prdPath = "https://acexy-1251164268.cos.ap-shanghai.myqcloud.com/imgs/static/";
gulp.task('css', function () {
    return gulp.src('dist/static/css/*.css')
        .pipe(rev())
        .pipe(gulp.dest('www/static/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});

gulp.task('js', function () {
    return gulp.src('dist/static/js/*.js')
        .pipe(rev())
        .pipe(gulp.dest('www/static/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});

gulp.task('fonts', function () {
    return gulp.src('dist/static/fonts/*')
        .pipe(gulp.dest('www/static/fonts'))
});

gulp.task('img', function () {
    return gulp.src('dist/static/img/*')
        .pipe(gulp.dest('www/static/img'))
});

gulp.task('rev', function () {
    return gulp.src(['rev/**/*.json', 'dist/*.html'])
        .pipe(revCollector({
            replaceReved: true,//允许替换, 已经被替换过的文件
            dirReplacements: {
                '/static/css': prdPath + 'css',
                '/static/js': prdPath + 'js'
            }
        }))
        .pipe(gulp.dest('www'));
});

gulp.task('clean', function () {
    return gulp.src(['www', 'rev'], {
        read: false,
        allowEmpty: true
    })
        .pipe(clean());
});
gulp.task('replace', gulp.series('clean', 'css', 'js', 'fonts', 'img', 'rev', function (done) {
    done();
}));
