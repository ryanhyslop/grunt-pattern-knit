/*
 * grunt-pattern-knit
 * https://github.com/ryanhyslop/grunt-pattern-knit
 *
 * Copyright (c) 2013 Ryan Hyslop
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

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

    // Some utility functions

    // Simple html character encoding
    function htmlEncode (text) {
        return String(text)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }


    // Merge pattern into a template
    function patternWrap ( pattern, filename ) {

        // This is a bit shit, would be nice to parse with an external template
        var content;

        content = '<div class="pattern">';
        content += '<div class="pattern-title">';
        content += filename;
        content += '</div>';
        content += '<div class="display">';
        content += pattern;
        content += '</div><div class="source"><textarea rows="6" cols="30">';
        content += htmlEncode(pattern);
        content += '</textarea>';
        content += '</div></div>';

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

      grunt.file.write(f.dest, patternHtmlJoined);

      // Print a success message.
      grunt.log.ok("Pattern Library Has Been Created");

    });
  });

};
