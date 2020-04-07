import { Rule, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { Schema } from './schema';
import { getProjectFromWorkspace, getProjectMainFile } from '@angular/cdk/schematics';

const hammerjsImportStatement = `import 'hammerjs';`;

/** Adds HammerJS to the main file of the specified Angular CLI project. */
export function addHammerJsToMain(options: Schema): Rule {
  return (host: Tree, context) => {
    context.logger.debug('addHammerJsToMain');
    if (!options.gestures) {
      return;
    }
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);
    const mainFile = getProjectMainFile(project);

    const recorder = host.beginUpdate(mainFile);
    const buffer = host.read(mainFile);

    if (!buffer) {
      return console.error(`Could not read the project main file (${mainFile}). Please manually ` +
        `import HammerJS in your main TypeScript file.`);
    }

    const fileContent = buffer.toString('utf8');

    if (fileContent.includes(hammerjsImportStatement)) {
      return console.log(`HammerJS is already imported in the project main file (${mainFile}).`);
    }

    recorder.insertRight(0, `${hammerjsImportStatement}\n`);
    host.commitUpdate(recorder);
  };
}
