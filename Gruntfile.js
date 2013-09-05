module.exports = function( grunt ) {

    grunt.initConfig({
        
        pkg: grunt.file.readJSON( 'package.json' ),
        
        banner: '/*! <%= pkg.name %> <%= pkg.version %> | Copyright (c) 2013 Ryan Fitzer | License: (http://www.opensource.org/licenses/mit-license.php) */\n',
        
        concat: {
            
            options: {
                banner: '<%= banner %>'
            },
            
            all: {
                src: [ 'src/multiEvent.js' ],
                dest: 'multiEvent.js'
            }
        },
        
        uglify: {
            
            options: {
                preserveComments: 'some'
            },
            
            min: {
                src: [ 'multiEvent.js' ],
                dest: 'multiEvent.min.js'
            }
        },
        
    });

    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );

    grunt.registerTask( 'default', [
        'concat',
        'uglify'
    ]);

};