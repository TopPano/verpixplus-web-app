'use strict';
let path = require('path');
let defaultSettings = require('./defaults');

// Additional npm or bower modules to include in builds
// Add all foreign plugins you may need into this array
// @example:
// let npmBase = path.join(__dirname, '../node_modules');
// let additionalPaths = [ path.join(npmBase, 'react-bootstrap') ];
let additionalPaths = [];

module.exports = {
  additionalPaths: additionalPaths,
  cache: true,
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.join(__dirname, '/../public/static/build'),
    filename: 'app.js',
    publicPath: defaultSettings.publicPath
  },
  postcss: (webpack) => {
    return [
      require('postcss-import')({
        addDependencyTo: webpack,
        path: [
          path.resolve(__dirname + "/../shared/components/Common/Styles")
        ]
      }),
      require('postcss-cssnext')(),
      require('precss')()
    ];
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.resolve(__dirname),
    alias: {
      actions: 'shared/actions/',
      components: 'shared/components/',
      config: 'shared/config/',
      content: 'shared/content/',
      constants: 'shared/constants/',
      containers: 'shared/containers/',
      etc: 'etc',
      lib: 'shared/lib',
      reducers: 'shared/reducers',
      i18n: 'shared/i18n',
      shared: 'shared',
      store: 'shared/store'
    }
  },
  module: {}
};
