# Grunt vs gulp

## Gulp

Gulp 优势：

1. **代码优于配置策略**
1. 高效：核心设计基于Unix流的概念。通过利用Node.js强大的**流，通过管道连接，不需要往磁盘写中间文件**，可以更快地完成构建。
1. **插件纯粹**：Gulp 的每个插件只完成一个功能，这也是Unix的设计原则之一，各个功能通过流进行整合并完成复杂的任务。
1. Gulp 的核心 API 只有5个

```javascript
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

// Lint JS
gulp.task('lint', function() {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concat & Minify JS
gulp.task('minify', function(){
  return gulp.src('src/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

// Watch Our Files
gulp.task('watch', function() {
  gulp.watch('src/*.js', ['lint', 'minify']);
});

// Default
gulp.task('default', ['lint', 'minify', 'watch']);
```

## Grunt

```javascript
// core
grunt.initConfig({huge json})
// Load Our Plugins
grunt.loadNpmTasks('grunt-contrib-watch');
// Register Default Task
grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
```

```javascript
// Invoke 'strict' JavaScript mode
'use strict';

// Define the Grunt configuration method
module.exports = function(grunt) {
    // Initialize Grunt configuration
    grunt.initConfig({
        // Configure the grunt-env task
        env: {
            test: {
                NODE_ENV: 'test'
            },
            dev: {
                NODE_ENV: 'development'
            }
        },
        // Configure the grunt-nodemon task
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    ext: 'js,html',
                    watch: ['server.js', 'config/**/*.js', 'app/**/*.js']
                }
            },
            debug: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug'],
                    ext: 'js,html',
                    watch: ['server.js', 'config/**/*.js', 'app/**/*.js']
                }
            }
        },
        // Configure the grunt-mocha-test task
        mochaTest: {
            src: 'app/tests/**/*.js',
            options: {
                reporter: 'spec'
            }
        },
        // Configure the grunt-karma task
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        // Configure the grunt-protractor-runner task
        protractor: {
            e2e: {
                options: {
                    configFile: 'protractor.conf.js'
                }
            }
        },
        // Configure the grunt-contrib-jshint task
        jshint: {
            all: {
                src: ['server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/*.js', 'public/modules/**/*.js'],
                options: {
                    node: true,
                    predef: [
                        "define",
                        "require",
                        "exports",
                        "module",
                        "describe",
                        "before",
                        "beforeEach",
                        "after",
                        "afterEach",
                        "it",
                        "inject",
                        "expect"
                    ]
                }
            }
        },
        // Configure the grunt-contrib-csslint task
        csslint: {
            all: {
                src: 'public/modules/**/*.css'
            }
        },
        // Configure the grunt-contrib-watch task
        watch: {
            js: {
                files: ['server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/*.js', 'public/modules/**/*.js'],
                tasks: ['jshint']
            },
            css: {
                files: 'public/modules/**/*.css',
                tasks: ['csslint']
            }
        },
        // Configure the grunt-concurrent task
        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            },
            debug: {
                tasks: ['nodemon:debug', 'watch', 'node-inspector'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        // Configure the grunt-node-inspector task
        'node-inspector': {
            debug: {}
        }
    });

    // Load the external Grunt tasks
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-node-inspector');

    // Create the 'default' Grunt task
    grunt.registerTask('default', ['env:dev', 'lint', 'concurrent:dev']);

    // Create the 'debug' Grunt task
    grunt.registerTask('debug', ['env:dev', 'lint', 'concurrent:debug']);

    // Create the 'test' Grunt task
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma', 'protractor']);

    // Create the 'lint' Grunt task
    grunt.registerTask('lint', ['jshint', 'csslint']);
};
```

## Gulp

