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
          base: ['<%= config.path.build %>']
        }
      }
    },
    watch: {
      js: {
        files: ['<%= config.path.jsAll %>'],
        tasks: ['jshint', 'requirejs']
      },
      jade: {
        files: ['<%= config.path.jade %>/**/*.jade'],
        tasks: ['jade']
      },
      less: {
        files: ['<%= config.path.less %>/**/*.less'],
        tasks: ['less']
      },
      media: {
        files: ['<%= config.path.media %>/**'],
        tasks: ['copy:main']
      },
      infos: {
        files: ['<%= config.path.base %>/*'],
        tasks: ['copy:main']
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
        jshintrc: '.jshintrc'
      },
      all: [
        '<%= config.path.jsCore %>',
        '<%= config.path.jsUtil %>'
      ]
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: '<%= config.path.base %>/js/core',
          mainConfigFile: '<%= config.path.base %>/js/core/app.js',
          name: 'app',
          out: '<%= config.path.build %>/js/app.js',
          preserveLicenseComments: true,
          useStrict: true,
          wrap: true
        }
      }
    },
    less: {
      development: {
        options: {
          paths: ['<%= config.path.build %>/css]']
        },
        files: {
          '<%= config.path.build %>/css/normalize.css': '<%= config.path.less %>/normalize.less',
          '<%= config.path.build %>/css/app.css': '<%= config.path.less %>/app.less',
        }
      }
    },
    jade: {
      dist: {
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
      }
    },
    copy: {
      main: {
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
            cwd: '<%= config.path.js %>/vendor/requirejs/',
            src: ['require.js'],
            dest: '<%= config.path.build %>/js/vendor/'
          }
        ]
      },
      test: {
        files: [
          {
            expand: true,
            cwd: '<%= config.path.js %>/vendor/requirejs/',
            src: ['require.js'],
            dest: '<%= config.path.test %>/vendors/'
          }
        ]
      }
    },
    clean: {
      build: ['<%= config.path.build %>/**/*'],
      test: ['<%= config.path.test %>/vendors/require.js'],
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

  grunt.registerTask('default', ['clean', 'jshint', 'copy:test','mocha', 'requirejs', 'less', 'jade', 'copy:main', 'serve']);
};