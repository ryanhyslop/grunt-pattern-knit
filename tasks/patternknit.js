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

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('patternknit', 'A task to build a static pattern and component library', function() {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
                        header: 'assets/header.html',
                        footer: '</body></html>'
                      }),

            headerHtml = grunt.file.read(options.header),

            footerHtml = options.footer,

            patternHtml = [],

            patternFiles = this.filesSrc,

            patternHtmlJoined;


        // Merge pattern into a template
        function patternWrap ( pattern, filename ) {

            var content;

            var template = grunt.file.read('assets/pattern-template.html');

            content = _.template(template, { pattern: pattern, filename: filename });

            return content;

        }

        // Get the filename of a parsed file
        function getFileName ( filepath ) {
            var filename = filepath.split('/');
            filename = filename[filename.length - 1];
            return filename;
        }


        // Add header to array

        patternHtml.push(headerHtml);

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            // Concat specified files.
            grunt.log.warn(f);
            var src = f.src.filter(function(filepath) {
            // Warn on and remove invalid source files (if nonull was set).
            if (!grunt.file.exists(filepath)) {
              grunt.log.warn('Source file "' + filepath + '" not found.');
              return false;
            } else {
              return true;
            }
            }).map(function(filepath) {
               grunt.log.writeln(filepath);
                var filename = getFileName(filepath);

                grunt.log.writeln('>> Reading: ' + filename);

                return patternWrap(grunt.file.read(filepath), filename);

            }).join('');

            // Handle options.
            patternHtml.push(src);

            patternHtml.push(footerHtml);

            // Write joined contents to destination filepath.
            patternHtmlJoined = patternHtml.join('');

            // grunt.file.write(f.dest + 'index.html', patternHtmlJoined);

        });

        grunt.file.copy('assets/base.css', this.data.dest + 'styles/base.css');

        if(options.css){
            if (!grunt.file.exists(options.css)) {
                grunt.log.warn('CSS file specified "' + filepath + '" not found.');
            } else {
                grunt.file.copy(options.css, this.data.dest + 'styles/main.css');
            }

        }
        // Print a success message.
        // grunt.log.ok("Pattern Library Has Been Created");

      });

};
