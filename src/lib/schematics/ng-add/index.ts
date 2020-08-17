import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';
import { addPackageToPackageJson, getPackageVersionFromPackageJson } from '../utils/package-config';

const AUI_VERSION = '10.0.0';
const HAMMERJS_VERSION = '^2.0.8';
const ANGULAR_CDK_VERSION = '^10.1.3';


export default function (options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.debug('installPkgs');
    const ngCoreVersionTag = getPackageVersionFromPackageJson(host, '@angular/core')!;

    if (getPackageVersionFromPackageJson(host, '@angular/cdk') === null) {
      addPackageToPackageJson(host, '@angular/cdk', ANGULAR_CDK_VERSION);
    }

    addPackageToPackageJson(host, '@angular/forms', ngCoreVersionTag);
    addPackageToPackageJson(host, '@angular/animations', ngCoreVersionTag);

    addPackageToPackageJson(host, '@alyle/ui', `^${AUI_VERSION}`);
    if (options.gestures) {
      addPackageToPackageJson(host, 'hammerjs', HAMMERJS_VERSION);
    }
    const installTaskId = context.addTask(new NodePackageInstallTask());

    context.addTask(new RunSchematicTask('ng-add-setup-project', options), [installTaskId]);
  };
}
