module.exports = function(grunt) {
    require('jit-grunt')(grunt);
    grunt.initConfig({
        less: {
            development: {
                options: {
                    plugins: [
                        require('less-plugin-group-css-media-queries'),
                        new(require('less-plugin-autoprefix'))({ browsers: ["last 2 versions"] }),
                        new(require('less-plugin-clean-css'))({advanced: true})
                    ],
                    compress: false,
                    cleancss: true,
                    yuicompress: true,
                    optimization: 2,
                    sourceMap: true,
                    sourceMapFilename: 'css/style.map.css'
                },
                files: {
                    "css/style.min.css": "css/source/style.less" // destination file and source file
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
    grunt.registerTask('default', ['less', 'watch']);
};