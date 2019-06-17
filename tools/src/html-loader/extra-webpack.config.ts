
import * as path from 'path';


export = (config) => {
  config.module.rules.unshift({
    test: /\.md$/,
    enforce: 'pre',
    include: [
      config.context
    ],
    use: [
      { loader: path.resolve(__dirname, './loader.js')}
    ]
  });

  return config;
};
