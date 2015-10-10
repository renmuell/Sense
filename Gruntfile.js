module.exports = function (grunt) {

  var

  // Config
  base = 'app',
  jsBase = base + '/js'
  config = {
    path: {
      base: base,
      js: jsBase,
      jsAll: jsBase + '/**/*.js',
      jsCore: jsBase + '/core/**/*.js',
      jsUtil: jsBase + '/util/**/*.js',
      css: base + '/css/**/*.css',
      html: '**/*.html',
      less: base + '/less',
      jade: base + '/jade',
      media: base + '/media',
      build: 'build',
      debug: 'debug',
      test: 'test',
    },
    server: {
      port: 9000,
      livereload: 35729,
      hostname: '0.0.0.0'
    }
  };

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    config: config,
    connect: {
      options: {
        port: '<%= config.server.port %>',
        livereload: '<%= config.server.livereload %>',
        hostname: '<%= config.server.hostname %>'
      },
      livereload: {
        options: {
          open: true,
          base: ['<%= config.path.debug %>']
        }
      },
      build: {
        options: {
          open: true,
          base: ['<%= config.path.build %>']
        }
      }
    },
    watch: {
      js: {
        files: ['<%= config.path.jsAll %>'],
        tasks: ['copy:debug']
      },
      jade: {
        files: ['<%= config.path.jade %>/**/*.jade'],
        tasks: ['jade:debug']
      },
      less: {
        files: ['<%= config.path.less %>/**/*.less'],
        tasks: ['less:debug']
      },
      media: {
        files: ['<%= config.path.media %>/**'],
        tasks: ['copy:debug']
      },
      reload: {
        options: {
          livereload: '<%= config.server.livereload %>'
        },
        files: [
          '<%= config.path.base %>/**/*',
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      build: [
        '<%= config.path.jsCore %>',
        '<%= config.path.jsUtil %>'
      ]
    },
    requirejs: {
      build: {
        options: {
          baseUrl: '<%= config.path.base %>/js',
          mainConfigFile: '<%= config.path.base %>/js/app.js',
          name: 'app',
          out: '<%= config.path.build %>/js/app.js',
        }
      }
    },
    less: {
      build: {
        options: {
          paths: ['<%= config.path.build %>/css]']
        },
        files: {
          '<%= config.path.build %>/css/normalize.css': '<%= config.path.less %>/normalize.less',
          '<%= config.path.build %>/css/app.css': '<%= config.path.less %>/app.less',
        }
      },
      debug: {
        options: {
          paths: ['<%= config.path.debug %>/css]']
        },
        files: {
          '<%= config.path.debug %>/css/normalize.css': '<%= config.path.less %>/normalize.less',
          '<%= config.path.debug %>/css/app.css': '<%= config.path.less %>/app.less',
        }
      },
    },
    jade: {
      build: {
        options: {
          pretty: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.path.jade %>',
          dest: '<%= config.path.build %>',
          src: '*.jade',
          ext: '.html'
        }]
      },
      debug: {
        options: {
          pretty: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.path.jade %>',
          dest: '<%= config.path.debug %>',
          src: '*.jade',
          ext: '.html'
        }]
      }
    },
    copy: {
      build: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['<%= config.path.base %>/*'],
            dest: '<%= config.path.build %>/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: '<%= config.path.media %>/',
            src: ['**'],
            dest: '<%= config.path.build %>/media/'
          },
          {
            expand: true,
            cwd: '<%= config.path.js %>/vendors/require-js-2.1.20/',
            src: ['require.js'],
            dest: '<%= config.path.build %>/js/vendors/require-js-2.1.20/'
          },
          {
            expand: true,
            cwd: '<%= config.path.js %>/vendors/cannon-js-0.6.2/',
            src: ['cannon.js'],
            dest: '<%= config.path.build %>/js/vendors/cannon-js-0.6.2'
          },
          {
            expand: true,
            cwd: '<%= config.path.base %>/vendors-css/',
            src: ['**'],
            dest: '<%= config.path.build %>/css/'
          }
        ]
      },
      debug: {
        files: [
          {
            expand: true,
            cwd: '<%= config.path.media %>/',
            src: ['**'],
            dest: '<%= config.path.debug %>/media/'
          },
          {
            expand: true,
            cwd: '<%= config.path.js %>/',
            src: ['**'],
            dest: '<%= config.path.debug %>/js/'
          },
          {
            expand: true,
            cwd: '<%= config.path.base %>/vendors-css/',
            src: ['**'],
            dest: '<%= config.path.debug %>/css/'
          }
        ]
      },
      test: {
        files: [
          {
            expand: true,
            cwd: '<%= config.path.js %>/vendors/require-js-2.1.20/',
            src: ['require.js'],
            dest: '<%= config.path.test %>/vendors/'
          }
        ]
      }
    },
    clean: {
      build: ['<%= config.path.build %>/**/*'],
      test: ['<%= config.path.test %>/vendors/require.js'],
      debug: ['<%= config.path.debug %>/**/*'],
    },
    mocha: {
      test: {
        src: ['test/test.html'],
        options: {
          run: false,
        }
      },
    },
  });

  grunt.registerTask('serve', function () {
    grunt.task.run([
      'connect:livereload',
      'watch'
      ]);
  });

  grunt.registerTask(
    'Test',
    [
      'clean:test',
      'copy:test',
      'mocha:test'
    ]);

  grunt.registerTask(
    'Hint',
    [
      'jshint:build'
    ]);

  grunt.registerTask(
    'Debug',
    [
      'clean:debug',
      'less:debug',
      'jade:debug',
      'copy:debug',
      'serve'
    ]);

  grunt.registerTask(
    'Build',
    [
      'clean:build',
      'clean:test',
      'copy:test',
      'mocha:test',
      'jshint:build',
      'requirejs:build',
      'less:build',
      'jade:build',
      'copy:build',
      'connect:build',
      'watch'
    ]);

  grunt.registerTask('default', 'serve');
};