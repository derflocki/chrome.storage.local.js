
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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
				tasks: ['uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['uglify']);
};
