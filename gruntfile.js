module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        // cmq: {
        //     your_target: {
        //         "css/main.css": "css/tmp.css"
        //     }
        // },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    plugins: [new(require('less-plugin-autoprefix'))({ browsers: ["last 2 versions"] })]
                },
                files: {
                    "css/main.css": "css/source/main.less" // destination file and source file
                }
            }
        },
        watch: {
            styles: {
                files: ['css/**/*.less'], // which files to watch
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    // grunt.loadNpmTasks('grunt-combine-media-queries');
    grunt.registerTask('default', ['less', 'watch']);
};