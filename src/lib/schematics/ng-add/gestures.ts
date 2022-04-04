import { Rule, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { Schema } from './schema';
import { getProjectFromWorkspace, getProjectMainFile, getAppModulePath, addSymbolToNgModuleMetadata } from '@angular/cdk/schematics';
import { InsertChange } from '@schematics/angular/utility/change';
import { getTsSourceFile, addImport } from '../utils/ast';

const hammerjsImportStatement = `import 'hammerjs';`;

/** Adds HammerJS to the main file of the specified Angular CLI project. */
export function addHammerJsToMain(options: Schema): Rule {
  return async (host: Tree, context) => {
    context.logger.debug('addHammerJsToMain');
    if (!options.gestures) {
      return;
    }
    const workspace = await getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);
    const mainFile = getProjectMainFile(project);
    const modulePath = getAppModulePath(host, mainFile);

    let recorder = host.beginUpdate(mainFile);
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


    addImport(host, modulePath, ['LyHammerGestureConfig'], '@alyle/ui');
    addImport(host, modulePath, ['HAMMER_GESTURE_CONFIG'], '@angular/platform-browser');

    const moduleSource = getTsSourceFile(host, modulePath);
    const themeSimbolName = `{ provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }`;
    const metadataChanges = addSymbolToNgModuleMetadata(
      moduleSource, modulePath, 'providers', themeSimbolName);
    if (metadataChanges) {
      recorder = host.beginUpdate(modulePath);
      metadataChanges.forEach((change: InsertChange) => {
        recorder.insertRight(change.pos, change.toAdd);
      });
      host.commitUpdate(recorder);
    }
  };
}
