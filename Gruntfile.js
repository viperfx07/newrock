module.exports = function(grunt) {
    'use strict';
    
    // 0. Speed up the grunt
    require('jit-grunt')(grunt);

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        concat: {
            main: {
                src: ['src/js/main.js'],
                dest: 'build/assets/js/global.js'
            }
        },

        uglify: {
            my_target: {
                files: {
                    'build/assets/js/global.min.js': ['build/assets/js/global.js']
                }
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build/assets/img/'
                }],
                options: {
                    cache: false
                }
            }
        },

        concurrent: {
            first: {
                tasks: ['css', 'js', 'jade', 'connect', 'watch']
            }
        },

        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['src/js/*.js'],
                tasks: ['concat', 'uglify', 'notify:js'],
                options: {
                    spawn: false
                }
            },
            css: {
                files: ['src/css/*.css'],
                tasks: ['postcss:dist', 'notify:css'],
                options: {
                    spawn: false,
                }
            },
            html: {
                options: {
                    livereload: true
                },
                files: ['**/*.jade'],
                tasks: ['jade']
            }
        },

        jade: {
            compile: {
                options: {
                    pretty: true,
                    data: {
                        debug: false
                    }
                },
                files: [{
                    expand: true,
                    ext: '.html',
                    cwd: "src/jade",
                    src: "*.jade",
                    dest: "build/"
                }]
            }
        },

        connect:{
            all:{
                options:{
                    port: 9999,
                    hostname: "0.0.0.0",
                    keepalive: true
                }
            }
        },

        postcss: {
            options: {
                map: true, // inline sourcemaps
                processors: [
                    require('precss'),
                    require('postcss-assets')({
                      relativeTo: 'assets/css'
                    }),
                    require('autoprefixer-core').postcss, //autoprefixer
                    //require('cssgrace').postcss, //add fallbacks
                    require('postcss-focus').postcss, //auto :focus,:hover styles
                    require('csswring').postcss //minify
                ]
            },
            dist: {
                src: 'src/css/main.css',
                dest: 'build/assets/css/main.css'
            }
        },

        notify: {
            css: {
                options: {
                    enabled: true,
                    title: 'Grunt Complete', // optional
                    message: '[postcss] finished' //required
                }
            },
            js: {
                options: {
                    enabled: true,
                    title: 'Grunt Complete', // optional
                    message: '[scripts] finished' //required
                }
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('css', ['postcss']);
    grunt.registerTask('js', ['concat', 'uglify']);
    grunt.registerTask('img', ['imagemin']);
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin', 'jade', 'postcss', 'watch']);
    grunt.registerTask('server', ['connect']);
    grunt.registerTask('me', 'concurrent:first');
};
