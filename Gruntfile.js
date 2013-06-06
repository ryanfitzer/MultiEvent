module.exports = function( grunt ) {

    grunt.initConfig({
        
        pkg: grunt.file.readJSON( 'package.json' ),
        
        banner: '/*! <%= pkg.name %> <%= pkg.version %> | Copyright (c) 2013 Ryan Fitzer | License: (http://www.opensource.org/licenses/mit-license.php) */\n',
        
        requirejs: {
            options: {
                baseUrl: './src',
                skipModuleInsertion: true,
                onBuildWrite: function ( moduleName, path, contents ) {
                    return contents.replace( /'multiEvent',/, '' );
                }
            },
            min: {
                options: {
                    name: 'multiEvent',
                    out: 'multiEvent.min.js'
                }
            },
            max: {
                options: {
                    optimize: 'none',
                    name: 'multiEvent',
                    out: 'multiEvent.js'
                }
            }
        },
        
        concat: {
            options: {
                banner: '<%= banner %>'
            },
            all: {
                files: {
                    'multiEvent.js': [ 'multiEvent.js' ],
                    'multiEvent.min.js': [ 'multiEvent.min.js' ],
                }
            }
        }
        
    });

    grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );

    grunt.registerTask( 'default', [ 'requirejs', 'concat' ] );

};