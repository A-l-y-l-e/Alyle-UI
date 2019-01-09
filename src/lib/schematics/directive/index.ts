import { Rule, Tree, externalSchematic, chain } from '@angular-devkit/schematics';
import { setUpStyles } from '../utils/styles';

function updateFiles(options): Rule {
  return (host: Tree) => {
    const directivePath = host.actions.filter(action => action.path.endsWith('.directive.ts'))[0].path;
    const buffer = host.read(directivePath)!.toString();

    // remove style blank
    host.overwrite(directivePath, buffer.replace(/\,?\n  styles: \[\]/, ''));

    return chain([
      setUpStyles(options, directivePath)
    ]);
  };
}

export default function (options): Rule {
  const newOptions = {
    ...options,
    inlineStyle: true
  };
  return chain([
    externalSchematic('@schematics/angular', 'directive', newOptions),
    updateFiles(newOptions)
  ]);
}
