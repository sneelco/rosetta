module.exports = function(grunt) {
  var server,
      jasmine;

  grunt.initConfig({
    jshint: {
      files: {
        src: [
          '*.js',
          'controllers/*.js',
          'models/*.js',
          'routes/*.js',
          'static/scripts/**/*.js'
        ]
      },
    },
    watch: {
      scripts: {
        files: [
          '*.js',
          'controllers/**/*.js',
          'models/**/*.js',
          'routes/**/*.js',
          'specs/**/*.js'],
        tasks: ['start'],
        options: {
          nospawn: true
        }
      },
      static: {
        files: ['static/scripts/**/*.js'],
        tasks: ['jshint'],
        options: {
          nospawn: true
        }
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('start', function () {
    if (server) server.kill();
    server = grunt.util.spawn({
      cmd: 'node',
      args: ['server.js']
    }, function() {
      console.log('Restarting server');
    });
    server.stdout.pipe(process.stdout);
    server.stderr.pipe(process.stderr);
    grunt.task.run('jasmine');
  });

  grunt.registerTask('jasmine', function () {
    if (jasmine) jasmine.kill();
    jasmine = grunt.util.spawn({
      cmd: 'jasmine-node',
      args: ['--verbose', 'specs']
    }, function() {
      console.log('Running Jasmine');
    });
    jasmine.stdout.pipe(process.stdout);
    jasmine.stderr.pipe(process.stderr);
    grunt.task.run('watch');
  });

  grunt.registerTask('default', ['jshint', 'start']);
};