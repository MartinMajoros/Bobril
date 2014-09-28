module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['commonjs','jasmine'],
	
    files: [
      'src/**/*.js',
      'test/**/*.js',
	  { pattern: 'src/**/*.js.map', included: false },
      { pattern: 'src/**/*.ts', included: false },
	  { pattern: 'test/**/*.js.map', included: false },
      { pattern: 'test/**/*.ts', included: false }
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
	   'src/**/*.js': ['coverage','commonjs'],
	   'test/**/*.js': ['commonjs']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress','coverage'],

	coverageReporter: {
		reporters:[
			{type: 'html', dir:'coverage/'},
			{type: 'text-summary'}
		]
	},
	
    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
