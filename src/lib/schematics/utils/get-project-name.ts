import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { getWorkspace } from '@schematics/angular/utility/config';

export function getDefaultProjectName(hostOrWorkspace: Tree | WorkspaceSchema) {
  let projectName: string | undefined;
  if ((hostOrWorkspace as WorkspaceSchema).defaultProject) {
    projectName = (hostOrWorkspace as WorkspaceSchema).defaultProject;
  } else {
    const workspace = getWorkspace(hostOrWorkspace as Tree);
    projectName = workspace.defaultProject;
  }

  if (!projectName) {
    throw new SchematicsException(`Could not find project in workspace: ${projectName}`);
  }
  return projectName;
}
