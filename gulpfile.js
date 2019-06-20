var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var replace = require('gulp-replace');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');
var webpack = require('webpack-stream');
var webpacklast = require('webpack');
var TerserPlugin = require('terser-webpack-plugin');
var purgecss = require('gulp-purgecss');
var cleanCSS = require('gulp-clean-css');

//plumber error

var onError = function (err) {
    console.log(err);
};

//inject

gulp.task('inject', function () {
    return gulp.src('dist/**/*.html')
        .pipe(inject(gulp.src('./dist/**/*.css', {
            read: false
        }), {
            relative: true,
            ignorePath: 'dist',
            addRootSlash: false,
            name: 'styles'
        }))
        .pipe(inject(gulp.src('./dist/**/*.js', {
            read: false
        }), {
            relative: true,
            ignorePath: 'dist',
            addRootSlash: false,
            name: 'scripts'
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream());
});

// function inject() {
//     return gulp.src('dist/**/*.html')
//         .pipe(inject(gulp.src('./dist/**/*.css', {
//             read: false
//         }), {
//             relative: true,
//             ignorePath: 'dist',
//             addRootSlash: false,
//             name: 'styles'
//         }))
//         .pipe(inject(gulp.src('./dist/**/*.js', {
//             read: false
//         }), {
//             relative: true,
//             ignorePath: 'dist',
//             addRootSlash: false,
//             name: 'scripts'
//         }))
//         .pipe(gulp.dest('dist/'))
//         .pipe(browserSync.stream());
// }

// SCSS

gulp.task('scss', function () {
    return gulp.src('dev/scss/style.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(
            sass({
                options: {
                    includePaths: [
                        './node_modules'
                      ]
                }
            })
        )
        .pipe(purgecss({
            content: ['./dist/**/*.html']
        }))
        .pipe(
            autoprefixer({
                browsers: ['last 3 versions'],
                cascade: false
            })
        )
        .pipe(
            cleanCSS()
        )
        .pipe(gulp.dest('dist/'))
    // .pipe(browserSync.reload({ stream: true }));
    // .pipe(browserSync.stream());
});

// function scss() {
//     return gulp.src('dev/scss/style.scss')
//         .pipe(plumber({
//             errorHandler: onError
//         }))
//         .pipe(
//             sass()
//         )
//         // .pipe(purgecss({
//         //     content: ['./dist/**/*.html']
//         // }))
//         .pipe(
//             autoprefixer({
//                 // browsers: ['last 3 versions'],
//                 cascade: false
//             })
//         )
//         // .pipe(
//         //     cleanCSS()
//         // )
//         .pipe(gulp.dest('dist/'))
//     // .pipe(browserSync.reload({ stream: true }));
//     // .pipe(browserSync.stream());
// }

// JS

gulp.task('js', function () {
    return gulp.src('dev/js/**/*.js')
        .pipe(webpack({
            mode: 'production',
            // mode: 'development',
            entry: {
                script: './dev/js/script.js',
            },
            output: {
                publicPath: "/dist/",
                filename: '[name].js',
                chunkFilename: '[name].js',
            },
            optimization: {
                minimizer: [
                    new TerserPlugin({
                        parallel: true,
                        extractComments: 'all',
                        terserOptions: {
                            warnings: false,
                            compress: {
                                collapse_vars: false
                            },
                            output: {
                                comments: false
                            }
                        }
                    })
                ],
                splitChunks: {
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            chunks: 'initial',
                            name: 'vendor',
                            enforce: true
                        }
                    }
                }
            },
            plugins: [
                new webpacklast.ProvidePlugin({
                    $: 'jquery',
                    jQuery: 'jquery',
                    // Vue: ['vue/dist/vue.esm.js', 'default'],
                    // Vuex: 'vuex'
                })
            ],
            module: {
                rules: [{
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    modules: false
                                }]
                            ]
                        }
                    }
                }],
            },
            // resolve: {
            //     alias: {
            //         'vue$': 'vue/dist/vue.esm.js'
            //     }
            // }
        }, webpacklast))
        .pipe(gulp.dest('./dist/'))
    // .pipe(browserSync.reload({ stream: true }));
    // .pipe(browserSync.stream());
})

// function js() {
//     return gulp.src('dev/js/**/*.js')
//         .pipe(webpack({
//             // mode: 'production',
//             mode: 'development',
//             entry: {
//                 script: './dev/js/script.js',
//             },
//             output: {
//                 publicPath: "/dist/",
//                 filename: '[name].js',
//                 chunkFilename: '[name].js',
//             },
//             optimization: {
//                 minimizer: [
//                     // new UglifyWebpackPlugin({
//                     //     parallel: true,
//                     //     uglifyOptions: {
//                     //         compress: {
//                     //             collapse_vars: false
//                     //         }
//                     //     }
//                     // })
//                     new TerserPlugin({
//                         extractComments: true,
//                         terserOptions: {
//                             warnings: true,
//                             compress: {
//                                 collapse_vars: false
//                             },
//                         }
//                     })
//                 ],
//                 splitChunks: {
//                     cacheGroups: {
//                         vendor: {
//                             test: /[\\/]node_modules[\\/]/,
//                             chunks: 'initial',
//                             name: 'vendor',
//                             enforce: true
//                         }
//                     }
//                 }
//             },
//             plugins: [
//                 new webpacklast.ProvidePlugin({
//                     $: 'jquery',
//                     jQuery: 'jquery'
//                     // Vue: ['vue/dist/vue.esm.js', 'default'],
//                     // Vuex: 'vuex'
//                 })
//             ],
//             module: {
//                 rules: [{
//                     test: /\.(js|jsx)$/,
//                     exclude: /(node_modules)/,
//                     use: {
//                         loader: 'babel-loader',
//                         options: {
//                             presets: [
//                                 ['@babel/preset-env', {
//                                     modules: false
//                                 }]
//                             ]
//                         }
//                     }
//                 }],
//             },
//             resolve: {
//                 alias: {
//                     // 'vue$': 'vue/dist/vue.esm.js'
//                 }
//             }
//         }, webpacklast))
//         .pipe(gulp.dest('./dist/'))
//     // .pipe(browserSync.reload({ stream: true }));
//     // .pipe(browserSync.stream());
// }

// PUG

gulp.task('pug', function () {
    return gulp.src(['dev/pug/**/*.pug', '!**/_*/**'])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist/'))
    // .pipe(browserSync.reload({ stream: true }));
    // .pipe(browserSync.stream());
})

// function pug() {
//     return gulp.src(['dev/pug/**/*.pug'])
//         .pipe(plumber({
//             errorHandler: onError
//         }))
//         .pipe(pug({
//             pretty: false
//         }))
//         .pipe(gulp.dest('dist/'))
//     // .pipe(browserSync.reload({ stream: true }));
//     // .pipe(browserSync.stream());
// }

//browser sync

gulp.task('serve', function (cb) {
    browserSync.init({
        // proxy: 'http://localhost/',
        // injectChanges: true,
        server: {
            baseDir: "dist/"
        },
        open: false
    })
    cb()
})

// function serve(cb) {
//     browserSync.init({
//         // proxy: 'http://localhost/',
//         // injectChanges: true,
//         server: {
//             baseDir: "dist/"
//         },
//         open: false
//     })
//     cb()
// }

// gulp.task('default', ['serve', 'pug', 'scss', 'js'], function () {
//     gulp.watch('**/*.scss', {
//         cwd: 'dev/scss'
//     }, ['scss', 'inject']);
//     gulp.watch('**/*.pug', {
//         cwd: 'dev/pug'
//     }, ['pug', 'inject']);
//     gulp.watch('**/*.js', {
//         cwd: 'dev/js'
//     }, ['js', 'inject']);
// });


function watchFiles() {
    gulp.watch("./dev/scss/**/*.scss", gulp.series('scss', 'inject'))
    gulp.watch("./dev/pug/**/*.pug", gulp.series('pug', 'inject'))
    gulp.watch("./dev/js/**/*.js", gulp.series('js', 'inject'))
}

gulp.task('watch', watchFiles);

gulp.task('default', gulp.series('pug', 'scss', 'js', 'serve', 'inject', 'watch'));