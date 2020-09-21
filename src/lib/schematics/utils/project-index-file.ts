import { Path } from '@angular-devkit/core';
import { WorkspaceProject } from '@angular-devkit/core/src/experimental/workspace';
import { BrowserBuilderTarget } from '@schematics/angular/utility/workspace-models';
import { defaultTargetBuilders, getTargetsByBuilderName } from './project-targets';

/** Gets the path of the index file in the given project. */
export function getProjectIndexFiles(project: WorkspaceProject): Path[] {
  // Use a set to remove duplicate index files referenced in multiple build targets
  // of a project.
  return [...new Set(
      (getTargetsByBuilderName(project, defaultTargetBuilders.build) as BrowserBuilderTarget[])
          .filter(t => t.options.index)
          .map(t => t.options.index! as Path))];
}
