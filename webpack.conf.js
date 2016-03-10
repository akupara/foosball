const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const dest_dir = path.join(__dirname, './dist/');
const src_dir = path.join(__dirname, 'src');

module.exports = {
	entry: {
		index: path.join(src_dir, 'entry.ts'),		
        style: path.join(src_dir, 'style.js')
	},
	output: {
		path: dest_dir,
		filename: '[name].js',
		chunkFilename: '[name].js'
	},
  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js',
				'.json', '.less', '.css', '.png']
  },
  // Add loader for .ts files.
  module: {
    loaders: [
      {test: /\.ts$/,loader: 'awesome-typescript-loader?tsconfig=static_src/script/ts/tsconfig.json'},	  
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css?sourceMap') },
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' },
      { test: /\.json$/, loader: 'json-loader' },      
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=image/svg+xml' },
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css', {
		disable: false,
		allChunks: true
	}),
	new webpack.ProvidePlugin({
		$: "jquery",
		jQuery: "jquery",
		"window.jQuery": "jquery"
	})]
};


if(process.env['MODE'] !== 'production'){
  module.exports['devtool'] = 'inline-source-map'
}