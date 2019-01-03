import {WorkspaceProject} from '@angular-devkit/core/src/workspace';
import {SchematicsException} from '@angular-devkit/schematics';

/** Resolves the architect options for the build target of the given project. */
export function getProjectTargetOptions(project: WorkspaceProject, buildTarget: string) {
  const targets = project.targets || project.architect;
  if (targets &&
    targets[buildTarget] &&
    targets[buildTarget].options) {

    return targets[buildTarget].options;
  }

  throw new SchematicsException(
    `Cannot determine project target configuration for: ${buildTarget}.`);
}
