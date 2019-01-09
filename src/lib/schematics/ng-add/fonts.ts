import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { getProjectTargets, targetBuildNotFoundError } from '@schematics/angular/utility/project-targets';

/** Adds the Roboto & Material Icons fonts to the index HTML file. */
export function addFontsToIndex(options: Schema): (host: Tree) => Tree {
  return (host: Tree) => {
    const projectTargets = getProjectTargets(host, options.project);

    if (!projectTargets.build) {
      throw targetBuildNotFoundError();
    }

    const indexPath = projectTargets.build.options.index;
    if (indexPath === undefined) {
      return host;
    }

    const buffer = host.read(indexPath);

    if (buffer === null) {
      throw new SchematicsException(`Could not read index file: ${indexPath}`);
    }

    const fonts = '<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons" rel="stylesheet">';
    const htmlText = buffer.toString().replace(/([\s]+)?\<\/head\>([\s]+)?\<body\>/, (match, token) => {
      return match.replace(token, `${token}\n  ${fonts}\n`);
    });
    host.overwrite(indexPath, htmlText);

    return host;
  };
}
