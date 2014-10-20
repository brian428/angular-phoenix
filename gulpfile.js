// Required Libraries
var gulp = require( "gulp" ),
    gutil = require( "gulp-util" );
    ts = require( "gulp-typescript" ),
    tslint = require( "gulp-tslint" ),
    tsdoc = require( "gulp-typedoc" ),
    concat = require( "gulp-concat-sourcemap" )
    sourcemaps = require( "gulp-sourcemaps" ),
    tsd = require( "gulp-tsd" );
    
// Config variables
var appName = "angular-phoenix",
    jsAppRoot = "./app",
    outputRoot = jsAppRoot + "/release/js",
    sourceMapSourceRoot = "../../src/ts",
    tsAppRoot = "./app/src/ts",
    tsDefRoot = "./app/src/ts_definitions",
    tsPaths = [ tsAppRoot + "/**/*.ts", tsDefRoot + "/libs/**/*.ts" ];
    
/*
    gutil.colors options (e.g.: gutil.colors.blue.bgRed.bold('Hello world!') ):
    reset bold dim underline inverse hidden
    black red green yellow blue magenta cyan white gray
    bgBlack bgRed bgGreen bgYellow bgBlue bgMagenta bgCyan bgWhite
*/    
    
// Error logging    
var errorHandler = function( text ) {
    gutil.log( gutil.colors.white.bgRed( text ) );
};

// TypeScript compile task
var tsProject = ts.createProject({
    declarationFiles: false,
    noExternalResolve: true,
    sortOutput: true,
    sourceRoot: "./"
});

gulp.task( "scripts", function() {
    var tsResult = gulp.src( tsPaths )
                       .pipe( sourcemaps.init() )
                       .pipe( ts( tsProject )
                       .on( "error", errorHandler ) );

    // Comment in to generate definition files for application classes.
    //tsResult.dts.pipe( gulp.dest( tsDefRoot + "/app" ).on( "error", errorHandler ) );
    
    tsResult.js.pipe( concat( appName + "-all.js" ) )
               .pipe( sourcemaps.write( "./", { sourceRoot: sourceMapSourceRoot } ) )
               .pipe( gulp.dest( outputRoot )
               .on( "error", errorHandler )
               .on( "error", gutil.beep ) );
});

gulp.task( "watch", [ "scripts" ], function() {
    gutil.log( gutil.colors.green( "Watching for changes to TypeScript source folders: " + tsPaths ) );
    gutil.log( gutil.colors.green( "Compiling TypeScript to: " + jsAppRoot + "/release/js/" + appName + "-all.js" ) );
    gulp.watch( tsPaths, [ "scripts" ] );
});

gulp.task( "tsd", function ( callback ) {
    gutil.log( gutil.colors.green( "To update the tsd.json, install definitions using the command: tsd query {name} -rosa install" ) );
    tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});

gulp.task( "compile", [ "scripts" ] );

// Default task
gulp.task( "default", [ "watch" ] );
