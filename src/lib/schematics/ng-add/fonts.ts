import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { appendHtmlElementToHead, getProjectFromWorkspace, getProjectIndexFiles } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

/** Adds the Roboto & Material Icons fonts to the index HTML file. */
export function addFontsToIndex(options: Schema): (host: Tree) => Tree {
  return (host: Tree) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);
    const projectIndexFiles = getProjectIndexFiles(project);

    if (!projectIndexFiles.length) {
      throw new SchematicsException('No project index HTML file could be found.');
    }

    [
      'https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons'
    ].forEach(
      font => projectIndexFiles.forEach(
        (indexFilePath) => appendHtmlElementToHead(host, indexFilePath, `<link href="${font}" rel="stylesheet">`)
      )
    );

    return host;
  };
}
