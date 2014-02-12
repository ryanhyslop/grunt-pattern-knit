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

        var template = grunt.file.read('assets/test.html');
        var underlyings = [{"id":43,"name":"xau\/usd","minimum_quantity":15,"loco_long":"London","loco":"LDN"},{"id":44,"name":"xag\/usd","minimum_quantity":200,"loco_long":"London","loco":"LDN"},{"id":45,"name":"xpt\/usd","minimum_quantity":5,"loco_long":"London","loco":"LDN"},{"id":46,"name":"xpd\/usd","minimum_quantity":5,"loco_long":"London","loco":"LDN"},{"id":47,"name":"xpt\/usd","minimum_quantity":5,"loco_long":"Zurich","loco":"ZUR"},{"id":48,"name":"xpd\/usd","minimum_quantity":5,"loco_long":"Zurich","loco":"ZUR"}];
        var maturities = [{"id":148,"name":"o\/n"},{"id":149,"name":"t\/n"},{"id":150,"name":"s\/n"},{"id":151,"name":"1w"},{"id":152,"name":"2w"},{"id":153,"name":"1m"},{"id":154,"name":"2m"},{"id":155,"name":"3m"},{"id":156,"name":"6m"},{"id":157,"name":"9m"},{"id":158,"name":"12m"},{"id":159,"name":"18m"},{"id":160,"name":"2y"},{"id":161,"name":"3y"},{"id":162,"name":"4y"},{"id":163,"name":"5y"},{"id":164,"name":"6y"},{"id":165,"name":"7y"},{"id":166,"name":"8y"},{"id":167,"name":"9y"},{"id":168,"name":"10y"}];
        var test;

        test = _.template(template, { underlyings: underlyings, maturities: maturities });

        grunt.file.write('sample.html', test);

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
