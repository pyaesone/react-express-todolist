var gulp            = require('gulp'),
    liveServer      = require('gulp-live-server')
    compass         = require('gulp-compass'),
    sass            = require('gulp-sass'),
    path            = require('path'),
    reactify        = require('reactify'),
    source          = require('vinyl-source-stream'),
    browserify      = require('browserify');

gulp.task('server',function(){
    var server = new liveServer('app.js');
    server.start();
});

gulp.task('jsx',function(){
    return browserify({
        entries: 'frontend/src/js/main.jsx',
        debug: true,
    })
    .transform(reactify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./frontend/dist/js'));
});

gulp.task('compass',function(){
    gulp.src( './frontend/src/sass/**/*.scss' )
        .pipe( compass( {
            config_file: './config.rb',
            project: path.join( __dirname ),
            css: 'frontend/dist/css',
            sass: 'frontend/src/sass'
         } ) );
})

gulp.task('watch',function(){
     // watch jade file
    gulp.watch( './frontend/src/js/**/*.jsx', ['jsx'] );
    gulp.watch( './frontend/src/sass/**/*.scss', ['compass']);
});

gulp.task('default',['jsx','compass','server','watch']);