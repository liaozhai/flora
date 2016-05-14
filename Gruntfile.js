module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [
					'src/js/lib/handlebars/handlebars.js',
					'src/js/lib/jquery/jquery.js',
					'src/js/lib/bootstrap/js/bootstrap.js',
					'src/js/views/*.js',
					'src/js/app.js'
				],
				dest: 'public/js/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        sourceMap: true
			},
			dist: {
				files: {
					'public/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'src/js/app.js', 'src/js/views/*.js'],
			options: {
				multistr: true,
				// options here to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint']
		},
		copy: {
			main: {
				files: [
					{expand: true, cwd: 'bower_components/bootstrap/dist/', src: ['**'], dest: 'src/js/lib/bootstrap/'},
					{expand: true, cwd: 'src/js/lib/bootstrap/fonts/', src: ['**'], dest: 'public/fonts/'},
					{expand: true, cwd: 'bower_components/handlebars/', src: ['handlebars.js','handlebars.min.js'], dest: 'src/js/lib/handlebars/'},
					{expand: true, cwd: 'bower_components/jquery/dist/', src: ['jquery.js','jquery.min.js'], dest: 'src/js/lib/jquery/'}
				]
			}
		},
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1,
        sourceMap: true
			},
			target: {
				files: {
					'public/css/style.min.css': ['src/css/*.css', 'src/js/lib/bootstrap/css/bootstrap.css', 'src/js/lib/bootstrap/css/bootstrap-theme.css']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('default', ['jshint', 'copy', 'cssmin', 'concat', 'uglify']);

};
