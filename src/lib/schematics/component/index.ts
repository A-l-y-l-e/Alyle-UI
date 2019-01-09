import { Rule, Tree, externalSchematic, chain } from '@angular-devkit/schematics';
import { setUpStyles } from '../utils/styles';

function updateFiles(options): Rule {
  return (host: Tree) => {
    const componentPath = host.actions.filter(action => action.path.endsWith('.component.ts'))[0].path;
    const buffer = host.read(componentPath)!.toString();

    // remove style blank
    host.overwrite(componentPath, buffer.replace(/\,?\n  styles: \[\]/, ''));

    return chain([
      setUpStyles(options, componentPath)
    ]);
  };
}

export default function (options): Rule {
  const newOptions = {
    ...options,
    inlineStyle: true
  };
  return chain([
    externalSchematic('@schematics/angular', 'component', newOptions),
    updateFiles(newOptions)
  ]);
}
