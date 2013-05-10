module.exports = function( grunt ) {

    
    grunt.initConfig({
        
        pkg: grunt.file.readJSON( 'package.json' ),
        
        requirejs: {
            compile: {
                options: {
                    baseUrl: './src',
                    name: 'multi-event',
                    out: 'multi-event-min.js',
                    skipModuleInsertion: true,
                    onBuildWrite: function ( moduleName, path, contents ) {
                        return contents.replace( /'multi-event',/, '' );
                    },
                }
            }
        },
        
        concat: {
            dist: {
                src: [ 'multi-event-min.js' ],
                dest: 'multi-event-min.js'
            },
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> <%= pkg.version %> | Copyright (c) 2013 Ryan Fitzer | License: (http://www.opensource.org/licenses/mit-license.php) */'
            }
        }
        
    });

    grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );

    grunt.registerTask( 'default', [ 'requirejs', 'concat' ] );

};