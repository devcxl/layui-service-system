const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat')
var minify = require('gulp-minify-css');
gulp.task('babeljs', async function () {
    //压缩转义自己编写的js文件
    gulp.src("src/js/**/*.js")
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'))

    //layui
    gulp.src('src/layui/**/*.js')
        .pipe(gulp.dest('dist/layui/'))

    //移动视图文件
    gulp.src("src/view/**/*")
        .pipe(gulp.dest('dist/view/'))

    //移动样式文件
    gulp.src("src/**/*.css")
        .pipe(minify({ compatibility: 'ie7' }))
        .pipe(gulp.dest('dist'))


    let other_src = ["src/**/*","!src/js/**/*.js","!src/layui/**/*.js","!src/view/**/*","!src/**/*.css"]
    //移动其他文件
    gulp.src(other_src)
        .pipe(gulp.dest('dist'))

});　