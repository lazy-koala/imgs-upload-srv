var gulp = require('gulp');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var clean = require('gulp-clean');
var date = new Date();
var month = date.getMonth() + 1;
month = month > 9 ? month : '0'+month;
var day = date.getDate();
var time = month + day + '/';
var prdPath = "https://acexy-1251164268.cos.ap-shanghai.myqcloud.com/imgs/static/" + time;
gulp.task('css', function () {
    return gulp.src('dist/static/css/*.css')
        .pipe(rev())
        .pipe(gulp.dest('www/static/' + time + 'css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});

gulp.task('js', function () {
    return gulp.src('dist/static/js/*.js')
        .pipe(rev())
        .pipe(gulp.dest('www/static/' + time + 'js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});

gulp.task('fonts', function () {
    // return gulp.src('dist/static/fonts/*')
    //     .pipe(gulp.dest('www/static/fonts'))
    return gulp.src('dist/static/fonts/*')
      .pipe(rev())
      .pipe(gulp.dest('www/static/' + time + 'fonts'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('rev/fonts'));
});

gulp.task('img', function () {
    return gulp.src('dist/static/img/*')
        .pipe(rev())
        .pipe(gulp.dest('www/static/' + time + 'img'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/img'));
});

// gulp.task('revhtml', function () {
//     return gulp.src(['rev/**/*.json', 'dist/*.html'])
//         .pipe(revCollector({
//             replaceReved: true,//允许替换, 已经被替换过的文件
//             dirReplacements: {
//                 '/static/css': prdPath + 'css',
//                 '/static/js': prdPath + 'js'
//             }
//         }))
//         .pipe(gulp.dest('www'));
// });
gulp.task('revcss', gulp.series('fonts', 'img', 'css', function () {
    return gulp.src(['rev/**/*.json', 'www/static/' + time + 'css/*'])
    .pipe(revCollector({
        replaceReved: true, //允许替换, 已经被替换过的文件
        dirReplacements: {
            '/static/img/': prdPath + 'img',
            '/static/fonts/': prdPath + 'fonts'
        }
    }))
    .pipe(gulp.dest('www/static/' + time + 'css'));
}));
gulp.task('revhtml', gulp.series('js', 'revcss', function () {
    return gulp.src(['rev/**/*.json', 'dist/*.html'])
    .pipe(revCollector({
        replaceReved: true, //允许替换, 已经被替换过的文件
        dirReplacements: {
            '/static/css': prdPath + 'css',
            '/static/js': prdPath + 'js'
        }
    }))
    .pipe(gulp.dest('www/static' ));
}));
// gulp.task('revhtml',  function () {
//     return gulp.src(['rev/**/*.json', 'dist/*.html'])
//         .pipe(revCollector({
//             replaceReved: true, //允许替换, 已经被替换过的文件
//             dirReplacements: {
//                 '/static/css': prdPath + 'css',
//                 '/static/js': prdPath + 'js'
//             }
//         }))
//         .pipe(gulp.dest('www'));
// });

gulp.task('clean', function () {
    return gulp.src(['www', 'rev'], {
        read: false,
        allowEmpty: true
    })
        .pipe(clean());
});
// gulp.task('revhtml', ['clean', 'fonts', 'img'], done => {
//     done();
// });

// gulp.task('replace', gulp.parallel('clean', 'revhtml', 'revcss', function (done) {
//     done();
// }));

gulp.task('default', gulp.series('clean', 'revhtml', function (done) {
    done();
}));
