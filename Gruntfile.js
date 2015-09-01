
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			src: 'chrome.storage.local.js',
			directives: {
				browser: true,
			}
		},
		uglify: {
			dist: {
				options: {
					compress: true,
				},
				files: {
					'chrome.storage.local.min.js': ['chrome.storage.local.js'],
				}
			},
		},
		watch: {
			dist: {
				files: ['chrome.storage.local.js'],
				tasks: ['jshint', 'uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'uglify']);
};
