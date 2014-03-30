# grunt-pattern-knit

> A task to build a static pattern and component library

Pattern Knit takes a collection of html files in the 'patterns' directory and outputs them all into a single html file, providing you a navigable overview of all components and patterns in your web application.


## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-pattern-knit --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-pattern-knit');
```

## The "patternknit" task

### Overview
In your project's Gruntfile, add a section named `patternknit` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  patternknit: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.css
Type: `String`
The path to your css file that you want to include in the compliled pattern library, relative to your gruntfile.


#### options.typekidId
Type: `String`
Your typekit id to be included in the pattern library should you require it.

### options.linkDirs
Type: `Object`
Pattern knit can create symbolic links to directories, the contents of which that you require in the library but don't wish to copy over, bower components being a typical example.

linkDirs accepts 3 properties: `bower` , `images` and `fonts` and the values of these properties are relative paths to the appropriate directories, relative to the ***pattern library*** dest

### Usage Examples
```js
    patternknit : {
      dist : {
        options : {
          css: 'path/to/main/cssfile.css',
          typekitId: '3f4f32ef',
          linkDirs : {
            // relative to patternknit.dest
            bower: '../bower_components',
            images: '../images',
            fonts: '../fonts'
          }
        },
        src: ['pattern-library/patterns/**/*.html'],
        dest: 'pattern-library/'
      }
    },
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

0.1.5 - Jumped to a bigger version as incorporated a lot of tidy ups and new features.

0.1.1 - Fixed 0.1.0 release and updated npm

0.1.0 - First release, was completely broken due to being a bit too excited to get it onto npm
