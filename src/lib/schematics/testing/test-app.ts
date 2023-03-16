import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';

/** Create a base app used for testing. */
export async function createTestApp(runner: SchematicTestRunner, appOptions = {}, tree?: Tree):
    Promise<UnitTestTree> {
  const workspaceTree = await runner.runExternalSchematicAsync('@schematics/angular', 'workspace', {
    name: 'workspace',
    version: '0.0.0',
    newProjectRoot: 'projects',
  }, tree).toPromise();

  return runner.runExternalSchematicAsync('@schematics/angular', 'application',
      {name: 'my-app', ...appOptions}, workspaceTree).toPromise();
}
