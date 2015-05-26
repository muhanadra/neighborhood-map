module.exports = function(grunt){
  grunt.initConfig({
    pkg:grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'js/app.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    jsdoc : {
      dist : {
        src: ['js/app.js', 'README.md'],
        options: {
            destination: 'doc',
            configure: 'conf.json'
          }
      }
    },
    watch: {
      scripts: {
        files: ['js/app.js','css/style.css'],
        tasks: ['jshint'],
        options: {
          livereload: true,
          spawn: true
        },
      },
    },
     uglify: {
      options: {
        compress: {
          drop_console: true
        }
      },
      my_target: {
        options: {
          sourceMap: true,
          sourceMapName: 'js/app.min.map'
        },
        files: {
          'js/app.min.js': ['js/app.js']
        },
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['watch', 'jsdoc', 'uglify' , 'jshint' ]);
};