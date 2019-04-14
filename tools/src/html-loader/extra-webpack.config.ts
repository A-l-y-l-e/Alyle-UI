
import * as path from 'path';

module.exports = {
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          { loader: 'raw-loader' },
          { loader: path.resolve(__dirname, './loader.js') }
        ]
      }
    ]
  }
};
