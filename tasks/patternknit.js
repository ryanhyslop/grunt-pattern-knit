/*
 * grunt-pattern-knit
 * https://github.com/ryanhyslop/grunt-pattern-knit
 *
 * Copyright (c) 2013 Ryan Hyslop
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var _ = require('underscore');
  var fs = require('fs');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('patternknit', 'A task to build a static pattern and component library', function() {

        var pkg = grunt.file.readJSON('package.json');

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
                        header: __dirname + '/../assets/header.html',
                        footer: __dirname + '/../assets/footer.html',
                      }),

            headerTpl = grunt.file.read(options.header),

            headerHtml = _.template(headerTpl, { site: pkg.name }),

            footerHtml = grunt.file.read(options.footer),

            patternHtml = [],

            patternFiles = this.filesSrc,

            patternHtmlJoined;


        // Merge pattern into a template
        function patternWrap ( pattern, filename ) {

            var content;

            var template = grunt.file.read(__dirname + '/../assets/pattern-template.html');

            var id = filename.split('.')[0];

            content = _.template(template, { pattern: pattern, filename: filename, id: id });

            return content;

        }

        // Get the filename of a parsed file
        function getFileName ( filepath ) {
            var filename = filepath.split('/');
            filename = filename[filename.length - 1];
            return filename;
        }

        function createSymLink (srcpath, dest) {

          var destpath = dest + srcpath.split('/').pop();

          try {
            fs.symlinkSync(srcpath, destpath, 'dir');
            grunt.verbose.ok();
          } catch(e) {
            grunt.verbose.error();
            grunt.log.error(e);
            grunt.fail.warn('Failed to create symlink: ' + '(dir) ' + destpath + ' -> ' + srcpath + '.');
          }
        }

        // Add header to array
        patternHtml.push(headerHtml);

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            // Concat specified files.

            var src = f.src.filter(function(filepath) {
            // Warn on and remove invalid source files (if nonull was set).
            if (!grunt.file.exists(filepath)) {
              grunt.log.warn('Source file "' + filepath + '" not found.');
              return false;
            } else {
              return true;
            }
            }).map(function(filepath) {

                var filename = getFileName(filepath);

                grunt.log.writeln('>> Reading: ' + filename);

                return patternWrap(grunt.file.read(filepath), filename);

            }).join('');

            // Handle options.
            patternHtml.push(src);

            patternHtml.push(footerHtml);

            // Write joined contents to destination filepath.
            patternHtmlJoined = patternHtml.join('');

            grunt.file.write(f.dest + 'index.html', patternHtmlJoined);

        });

        //  Move Some Dependant Files
        grunt.file.copy(__dirname + '/../assets/base.css', this.data.dest + 'styles/base.css');
        grunt.file.copy(__dirname + '/../assets/prism.css', this.data.dest + 'styles/prism.css');
        grunt.file.copy(__dirname + '/../assets/prism.js', this.data.dest + 'js/prism.js');



        if(options.css){
            if (!grunt.file.exists(options.css)) {
                grunt.log.warn('CSS file specified "' + options.css + '" not found.');
            } else {
                grunt.file.copy(options.css, this.data.dest + 'styles/main.css');
            }
        }

        if( options.linkDirs ){
            // This is currently quite fragile, pass in an array of objects and interate instead?
            if( options.linkDirs.bower ) {
                if (!grunt.file.exists(this.data.dest + 'bower_components')) {
                    createSymLink(options.linkDirs.bower, this.data.dest);
                }
            }

            if( options.linkDirs.images ) {
                if (!grunt.file.exists(this.data.dest + 'images')) {
                    createSymLink(options.linkDirs.images, this.data.dest);
                }
            }

            if( options.linkDirs.fonts ) {
                if (!grunt.file.exists(this.data.dest + 'fonts')) {
                    createSymLink(options.linkDirs.fonts, this.data.dest);
                }
            }

        }

        grunt.log.ok("Pattern Library Has Been Created");

      });

};
