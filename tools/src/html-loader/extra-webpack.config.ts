
import * as path from 'path';
import chalk from 'chalk';


export = (config) => {
  console.log(chalk.yellowBright.bold('NOTICE: Markdown support has been enabled.'));
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
  config.module.rules.unshift({
    test: /\.md$/,
    loader: 'raw-loader'
  });

  return config;
};
